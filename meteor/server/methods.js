"use strict";
Meteor.methods({
    GetNextSequence: function (name) {
        var next = -1;
        for( var i = 0; i <= 10; i++) {
            var cursor = SalesInvoices.find({}, { fields: { key: 1 } , sort: { key: -1 }, limit: 1 })
            next = cursor.fetch()[0].key + 1;
            try{
                SalesInvoices.insert( {_id: new Meteor.Collection.ObjectID(), key: next, lines: [] });
                break;
            }
            catch(err) {
                console.log(err);
            }
        }
        return next;
    },
    Count: function (collection, query, merger) {
        var filter = {}
        if (collection == 'OpenSalesInvoices') {
            collection = 'SalesInvoices';
            filter = { posting_date: { $exists: false } };
        }
        else if (collection == 'PostedSalesInvoices') {
            collection = 'SalesInvoices';
            filter = { posting_date: { $exists: true } };
        }
        return FilterQuery(global[collection], global[collection + 'SearchFields'], query, _.defaults(merger, { filter: filter })).count();
    },
    DeptorsSearch: function (query, merger) {
        return FilterQuery(Deptors, DeptorSearchFields, query, merger).fetch();
    },
    ItemEntries: function (query, merger) {
        return FilterQuery(ItemEntries, ItemEntriesSearchFields, query, merger).count();
    },
    CreditorEntries: function (query, merger) {
        return FilterQuery(CreditorEntries, CreditorEntriesSearchFields, query, merger).count();
    },
    DeptorEntries: function (query, merger) {
        return FilterQuery(DeptorEntries, DeptorEntriesSearchFields, query, merger).count();
    },
    ItemsSearch: function (query, merger) {
        return FilterQuery(Items, ItemSearchFields, query, merger).fetch();
    },    
    getSalesInvoice: function (key) {
        // check(id, String);
        // return SalesInvoices.findOne({ _id: new Meteor.Collection.ObjectID(id) });
        return SalesInvoices.findOne({ key: parseInt(key) });
    },
    getSalesCreditnota: function (key) {
        // check(id, String);
        // return SalesCreditnotas.findOne({ _id: new Meteor.Collection.ObjectID(id) });
        return SalesCreditnotas.findOne({ key: parseInt(key) });
    },
    getPurchaseCreditnota: function (key) {
        // check(id, String);
        // return PurchaseCreditnotas.findOne({ _id: new Meteor.Collection.ObjectID(id) });
        return PurchaseCreditnotas.findOne({ key: parseInt(key) });
    },
    getPurchaseInvoice: function (key) {
        // check(id, String);
        // return PurchaseInvoices.findOne({ _id: new Meteor.Collection.ObjectID(id) });
        return PurchaseInvoices.findOne({ key: parseInt(key) });
    },
    getInvoiceKeyByRecordNumber: function (number) {
        // check(id, String);
        // return PurchaseInvoices.findOne({ _id: new Meteor.Collection.ObjectID(id) });
        return PurchaseInvoices.findOne({ creditor_invoice_number: parseInt(number) }, {fields: {key: 1} });
    },
    getItemStats: function (number, startDate, endDate) {
        var match = { item_number: number };
        if (endDate) {
            match.date = { $lte: endDate };
        }
        if (startDate) {
            match.date = { $gte: startDate };
        }
        log.info(match);
        return ItemEntries.aggregate([
                { $match: match },
                { $group: { _id: "$type", total: { $sum: "$total_price" }, quantity: { $sum: "$quantity" } } }
                ]);
    },
    getCreditorStats: function (number) {
        return CreditorEntries.aggregate([
                { $match: { creditor_number: number } },
                { $group: { _id: "$type", total: { $sum: "$amount" } } }
        ]);
    },
    getDeptorStats: function (number) {
        return DeptorEntries.aggregate([
                { $match: { deptor_number: number } },
                { $group: { _id: "$type", total: { $sum: "$amount" } } }
        ]);
    },
    sendAmqp: function (invoiceNumber) {
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

        var message = Mail.invoice;
        message.to = email;
        message.attachments = [ { filename: 'faktura.pdf', filePath: '/tmp/' + id + '.pdf' } ];

        var error = function (err, msg) {
                SalesInvoices.update(
                    { _id: objectId },
                    { $set: { 'sent.mail.state': 'error' } });
                errors.async(err, msg, log.error);


        };
        var pages = Print.totalPages(invoice.lines.length);
        Pdf.getInvoice(invoice, {},  pages, Meteor.bindEnvironment(function (err, msg) {
            console.log(err, msg);
            if (err) error(errors.pdfConversion, err);
            log.info('File written to /tmp/' + id + '.pdf', err, msg);
            log.info('Conversion done, sending mail to', email);
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
