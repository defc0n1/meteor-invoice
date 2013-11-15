"use strict";
Meteor.methods({
    salesinvoices: function (query, merger) {
        console.log(merger, 'test');
        return FilterQuery(SalesInvoices, InvoiceSearchFields, query, merger).count();
    },
    deptors: function (query, merger) {
        return FilterQuery(Deptors, InvoiceSearchFields, query, merger).count();
    },
    sendAmqp: function (invoiceNumber) {
        check(invoiceNumber, String);

        var invoice = SalesInvoices.findOne({ key: invoiceNumber });
        console.log(invoice.customer_number);
        var deptor = Deptors.findOne({ key: invoice.customer_number });
        console.log('Sending invoice over amqp:', invoiceNumber);

        var lines_with_ean = [];
        invoice.lines.forEach(function(line) {
            if(line.item_number && !line.ean) {
                var item = Items.findOne({ key: line.item_number});
                line.ean = item.ean;
            }

            lines_with_ean.push(line);
        });
        console.log(lines_with_ean);
        invoice.lines = lines_with_ean;

        var object = { invoice: invoice, deptor: deptor.search_name };

        SalesInvoices.update(
                { key: invoiceNumber },
                { $set: { 'sent.amqp.state': 'processing', 
                          'sent.amqp.time': new Date() } }
        );
        var answer = when.defer();
        // we reject the promise and timeout with an error after 3 seconds
        setTimeout(function () { answer.reject('Intet svar fra amqp') }, Meteor.settings.amqp_timeout);
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
                    { key: invoiceNumber },
                    { $push: { 'sent.amqp.history': new Date() },
                      $set: { 'sent.amqp.state': 'success' } });

            }
            else {
                console.log('Unsuccessful send of invoice:', invoiceNumber);
                SalesInvoices.update(
                    { key: invoiceNumber },
                    { $set: { 'sent.amqp.state': 'error' } });
                Alerts.insert({ message: 'Afsendelse af EDI faktura ' + invoiceNumber + ' mislykkedes pga.: ' + response.message });
            }
        }, function (e) {
            Meteor._debug("Exception from connection close callback:", e);
            console.log("Exception from connection close callback:", e);
            SalesInvoices.update(
                    { key: invoiceNumber },
                    { $set: { 'sent.amqp.state': 'error' } });
            console.log(err || message);
        }), Meteor.bindEnvironment(function (e) {
            console.log(' rejected', e);
            Meteor._debug("Exception from connection close callback:", e);
            SalesInvoices.update(
                    { key: invoiceNumber },
                    { $set: { 'sent.amqp.state': 'error' } });
            Alerts.insert({ message: 'Afsendelse af EDI faktura ' + invoiceNumber + ' mislykkedes pga.: ' + e });
        }, function (e) { console.log(e); }));
        //console.log(' returning ', res);
        return 'test';
    },
    getSalesInvoice: function(id) {
        check(id, String);
        console.log(id);
        console.log(new Meteor.Collection.ObjectID());
        return SalesInvoices.findOne({ _id: new Meteor.Collection.ObjectID(id) });
    },
    sendEmail: function (id) {
        check(id, String);
        var objectId = new Meteor.Collection.ObjectID(id)
        SalesInvoices.update(
                { _id: objectId },
                { $set: { 'sent.mail.time': new Date(),
                          'sent.mail.state': 'processing' } }
        );

        //Wkhtmltopdf('http://localhost:3000/salesinvoices/' + invoiceNumber, { output: '../../../../../public/' + invoiceNumber + '.pdf', 'javascript-delay': 1000 });
        console.log(Meteor.absoluteUrl('sale/salesinvoices/bare/' + id))
        Wkhtmltopdf(Meteor.absoluteUrl('sale/salesinvoices/bare/' + id), { output: '/tmp/' + id + '.pdf', 'javascript-delay': 1000 }, 
                function (err, msg) {
                    console.log(err, msg);
                });

        console.log(Meteor.settings);
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
            body: 'Din faktura er vedhæftet som en pdf fil.\n Venlig hilsen Trade House Danmark ApS',
            attachments: [
                {
                    filename: 'faktura.pdf',
                    filePath: '/tmp/' + id + '.pdf'
                }

            ]
        };
            //html: '<a href="http://localhost:3000/' + invoiceNumber + '.pdf">Hent din faktura her</a>'  });
        transport.sendMail(message, Meteor.bindEnvironment(function (err, message) {
            if (err || message.failedRecipients.length > 0){
                SalesInvoices.update(
                    { _id: objectId },
                    { $set: { 'sent.mail.state': 'error' } });
                console.log(err || message);
            }
            else{
                SalesInvoices.update(
                    { _id: objectId },
                    { $push: { 'sent.mail.history': new Date() },
                      $set: { 'sent.mail.state': 'success' } });
            }
        }, function (e) {
            Meteor._debug("Exception from connection close callback:", e);
            SalesInvoices.update(
                { _id: objectId },
                { $set: { 'sent.mail.state': 'error' } });
            console.log(err || message);
        }));
    }
});
