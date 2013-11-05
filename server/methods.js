"use strict";
Meteor.methods({
    salesInvoiceCount: function () {
        return SalesInvoices.find().count();
    },
    sendAmqp: function (invoiceNumber) {
        check(invoiceNumber, String);

        var invoice = SalesInvoices.findOne({ _id: invoiceNumber });
        console.log(invoice.customer_number);
        var deptor = Deptors.findOne({ _id: invoice.customer_number });
        console.log('Sending invoice over amqp:', invoiceNumber);

        var lines_with_ean = [];
        invoice.lines.forEach(function(line) {
            if(line.item_number && !line.ean) {
                var item = Items.findOne({ _id: line.item_number});
                line.ean = item.ean;
            }

            lines_with_ean.push(line);
        });
        console.log(lines_with_ean);
        invoice.lines = lines_with_ean;

        var object = { invoice: invoice, deptor: deptor.search_name };

        SalesInvoices.update(
                { _id: invoiceNumber },
                { $set: { 'sent.amqp.state': 'processing' } }
        );
        //var when = Meteor.require.when('when')
        var answer = when.defer();
        //var corrId = uuid();
        var corrId = 'test';
        function maybeAnswer (msg) {
            if (msg.properties.correlationId === corrId) {
                answer.resolve(msg.content.toString());
            }
        }

        // reply queue
        var ok = channel.assertQueue('', {exclusive: true})
        .then(function(qok) {
            console.log(' [a] Reply queue created');
            return qok.queue;
        });

        ok = ok.then(function(queue) {
            return channel.consume(queue, maybeAnswer, {noAck: true})
            .then(function() {
                console.log(' [b] Ready to consume from reply queue');
                return queue;
            });
        });

        ok = ok.then(function(queue) {
            console.log(' [c] Requesting edi');
            var res = channel.sendToQueue('test', new Buffer(JSON.stringify(object)),
                { correlationId: corrId, replyTo: queue });
            return answer.promise;
        });

        ok.then(Meteor.bindEnvironment(function (res) {
            console.log(' [d] Got response');
            console.log(res);
            var response = JSON.parse(res);

            console.log(response)
            if (response.success === true) {
                console.log('successful send of invoice:', invoiceNumber);
                SalesInvoices.update(
                    { _id: invoiceNumber },
                    { $push: { 'sent.amqp.history': new Date() },
                      $set: { 'sent.amqp.state': 'success' } });

            }
            else {
                console.log('Unsuccessful send of invoice:', invoiceNumber);
                SalesInvoices.update(
                    { _id: invoiceNumber },
                    { $set: { 'sent.amqp.state': 'error' } });
                Alerts.insert({ message: 'Afsendelse af EDI faktura ' + invoiceNumber + ' mislykkedes pga.: ' + response.message });
            }
        }, function (e) {
            Meteor._debug("Exception from connection close callback:", e);
            SalesInvoices.update(
                    { _id: invoiceNumber },
                    { $set: { 'sent.amqp.state': 'error' } });
            console.log(err || message);
        }));
        //console.log(' returning ', res);
        return 'test';
    },
    getSalesInvoice: function(id) {
        check(id, String);
        return SalesInvoices.findOne({ _id: id });
    },
    sendEmail: function (invoiceNumber) {
        check(invoiceNumber, String);
        SalesInvoices.update(
                { _id: invoiceNumber },
                { $set: { 'sent.mail.state': 'processing' } }
        );

        //Wkhtmltopdf('http://localhost:3000/salesinvoices/' + invoiceNumber, { output: '../../../../../public/' + invoiceNumber + '.pdf', 'javascript-delay': 1000 });
        Wkhtmltopdf('http://localhost:3000/salesinvoices/' + invoiceNumber, { output: '/tmp/' + invoiceNumber + '.pdf', 'javascript-delay': 1000 });

        var transport = Nodemailer.createTransport('SMTP', {
            auth: {
                pass: Meteor.settings.smtp_pass,
                user: Meteor.settings.smtp_user
            },
            port: 587,
            host: Meteor.settings.smtp_host,
            //secureConnection: 'true'
        });


        var message = {
            sender: 'tradehouse@tradehouse.as',
            to: Meteor.settings.test_mail,
            subject: 'Faktura 123',
            body: 'test',
            attachments: [
                {
                    filename: 'faktura.pdf',
                    filePath: '/tmp/' + invoiceNumber + '.pdf'
                }

            ]
        };
            //html: '<a href="http://localhost:3000/' + invoiceNumber + '.pdf">Hent din faktura her</a>'  });
        transport.sendMail(message, Meteor.bindEnvironment(function (err, message) {
            if (err || message.failedRecipients.length > 0){
                SalesInvoices.update(
                    { _id: invoiceNumber },
                    { $set: { 'sent.mail.state': 'error' } });
                console.log(err || message);
            }
            else{
                SalesInvoices.update(
                    { _id: invoiceNumber },
                    { $push: { 'sent.mail.history': new Date() },
                      $set: { 'sent.mail.state': 'success' } });
            }
        }, function (e) {
            Meteor._debug("Exception from connection close callback:", e);
            SalesInvoices.update(
                { _id: invoiceNumber },
                { $set: { 'sent.mail.state': 'error' } });
            console.log(err || message);
        }));
    }
});
