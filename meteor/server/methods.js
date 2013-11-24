"use strict";
Meteor.methods({
    salesinvoices: function (query, merger) {
        return FilterQuery(SalesInvoices, SalesInvoiceSearchFields, query, merger).count();
    },
    salescreditnotas: function (query, merger) {
        return FilterQuery(SalesCreditnotas, SalesCreditnotaSearchFields, query, merger).count();
    },
    purchaseinvoices: function (query, merger) {
        return FilterQuery(PurchaseInvoices, PurchaseInvoiceSearchFields, query, merger).count();
    },
    purchasecreditnotas: function (query, merger) {
        return FilterQuery(PurchaseCreditnotas, PurchaseCreditnotaSearchFields, query, merger).count();
    },
    deptors: function (query, merger) {
        return FilterQuery(Deptors, DeptorSearchFields, query, merger).count();
    },
    creditors: function (query, merger) {
        return FilterQuery(Creditors, CreditorSearchFields, query, merger).count();
    },
    items: function (query, merger) {
        return FilterQuery(Items, ItemSearchFields, query, merger).count();
    },
    getSalesInvoice: function (id) {
        check(id, String);
        return SalesInvoices.findOne({ _id: new Meteor.Collection.ObjectID(id) });
    },
    getSalesCreditnota: function (id) {
        check(id, String);
        return SalesCreditnotas.findOne({ _id: new Meteor.Collection.ObjectID(id) });
    },
    getPurchaseCreditnota: function (id) {
        check(id, String);
        return PurchaseCreditnotas.findOne({ _id: new Meteor.Collection.ObjectID(id) });
    },
    getItemStats: function (number) {
        var res = ItemEntries.aggregate([
                { $match: { item_number: number } },
                { $group: { _id: "$type", total: { $sum: "$total_price" } } }
        ]);
        return res;
    },
    sendAmqp: function (invoiceNumber) {
        check(invoiceNumber, String);
        var invoice = SalesInvoices.findOne({ key: invoiceNumber });
        var deptor = Deptors.findOne({ key: invoice.customer_number });
        log.info('Sending invoice over amqp:', invoiceNumber);

        // add ean to all items
        var lines_with_ean = [];
        invoice.lines.forEach(function(line) {
            if(line.item_number && !line.ean) {
                var item = Items.findOne({ key: line.item_number});
                line.ean = item.ean;
            }
            lines_with_ean.push(line);
        });
        invoice.lines = lines_with_ean;

        // construct the message
        var object = { invoice: invoice, deptor: deptor.search_name };
        if (Meteor.settings.env !== 'prod') {
            log.info('Adding dry run property');
            object.dry_run = true;
        }
        else {
            object.dry_run = false;
        }
        // set invoice state to processing
        SalesInvoices.update(
                { key: invoiceNumber },
                { $set: { 'sent.amqp.state': 'processing',
                          'sent.amqp.time': new Date() } }
        );
        // call in case of error
        var error = function (message) {
            log.error('Unsuccessful send of invoice:', invoiceNumber);
            SalesInvoices.update(
                    { key: invoiceNumber },
                    { $set: { 'sent.amqp.state': 'error' } });
            Alerts.insert({ message: 'Afsendelse af EDI faktura ' + invoiceNumber + ' mislykkedes pga.: ' + message });
        }
        // do the rpc
        amqp.rpc(object, 'test', Meteor.bindEnvironment(function (response) {
            if (response.success === true) {
                console.log('successful send of invoice:', invoiceNumber);
                SalesInvoices.update(
                    { key: invoiceNumber },
                    { $push: { 'sent.amqp.history': new Date() },
                      $set: { 'sent.amqp.state': 'success' } });
            }
            else {
                error(response.message);
            }
        },
        function (e) {
            error(e);
        }));
    },
    sendEmail: function (id) {
        check(id, String);
        log.debug('Send mail called', id);
        var objectId = new Meteor.Collection.ObjectID(id)
        var invoice = SalesInvoices.findOne({ _id: objectId });
        var deptor = Deptors.findOne({ key: invoice.customer_number });
        if (!deptor.email) {
            //errors.sync(errors.missingMail, '', log.warning);
        }
        SalesInvoices.update(
                { _id: objectId },
                { $set: { 'sent.mail.time': new Date(),
                          'sent.mail.state': 'processing' } }
        );

        var transport = Nodemailer.createTransport('SMTP', {
            auth: {
                pass: Meteor.settings.smtp_pass,
                user: Meteor.settings.smtp_user
            },
            port: 587,
            host: Meteor.settings.smtp_host,
            //secureConnection: 'true'
        });
        var email = deptor.email;
        if (Meteor.settings.env !== 'prod') {
            log.info('Sending to test email', Meteor.settings.test_mail);
            email = Meteor.settings.test_mail;
        }

        var message = {
            sender: 'tradehouse@tradehouse.as',
            to: email,
            subject: 'Faktura 123',
            body: 'Din faktura er vedhæftet som en pdf fil.\n Venlig hilsen Trade House Danmark ApS',
            attachments: [
                {
                    filename: 'faktura.pdf',
                    filePath: '/tmp/' + id + '.pdf'
                }
            ]
        };
        var error = function (err, msg) {
                SalesInvoices.update(
                    { _id: objectId },
                    { $set: { 'sent.mail.state': 'error' } });
                errors.async(err, msg, log.error);


        };
        //fut = new Future()
        //Wkhtmltopdf(Meteor.absoluteUrl('sale/salesinvoices/bare/' + id), { output: '/tmp/' + id + '.pdf', 'javascript-delay': 1000 },
        Wkhtmltopdf(Meteor.absoluteUrl('sale/salesinvoices/bare/' + id), { output: '/tmp/' + id + '.pdf', 'redirect-delay': 3000 },
        //Wkhtmltopdf(Meteor.absoluteUrl('sale/salesinvoices/bare/' + id), { output: '/tmp/' + id + '.pdf' },
                Meteor.bindEnvironment(function (err, msg) {
                    console.log(err, msg);
                    if (err) error(errors.pdfConversion, err);
                    log.info('File written to /tmp/' + id + '.pdf', err, msg);
                    log.info('Conversion done, sending mail to', deptor.email);
                    transport.sendMail(message, Meteor.bindEnvironment(function (err, message) {
                        if (err) error(errors.mailSend, err);
                        else if (message.failedRecipients.length > 0) error(errors.recipients, message.failedRecipients);
                        else {
                            log.info('Email successfully send', deptor.email);
                            SalesInvoices.update(
                                { _id: objectId },
                                { $push: { 'sent.mail.history': new Date() },
                                    $set: { 'sent.mail.state': 'success' } });
                        }
                    }, function (e) {
                        error(errors.unknown, e);
                    }));
                }, function (e) {
                    error(errors.unknown, e);
                }));
    }
});
