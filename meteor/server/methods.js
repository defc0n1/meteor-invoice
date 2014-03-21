"use strict";

function auth(f) {        // (1)
    return function() {
        if (Meteor.userId()) {
            return f.apply(this, arguments);
        } else {
            return 'Not authorized';
        }
    };
}
Meteor.methods({
    CreateUser: auth(function (email) {
        var userId = Accounts.createUser({ email: email });
        Accounts.sendEnrollmentEmail(userId);
    }),
    GetNextSequence: auth(function (name) {
        var next = -1;
        for( var i = 0; i <= 10; i++) {
            var cursor = Sale.find({}, { fields: { key: 1 } , sort: { key: -1 }, limit: 1 })
            next = cursor.fetch()[0].key + 1;
            try{
                Sale.insert( {_id: new Meteor.Collection.ObjectID(), key: next, lines: [], type: 'invoice' });
                break;
            }
            catch(err) {
                console.log(err);
            }
        }
        return next;
    }),
    DeptorsSearch: auth(function (query, merger) {
        return FilterQuery(Deptors, DeptorSearchFields, query, merger).fetch();
    }),
    ItemsSearch: auth(function (query, merger) {
        return FilterQuery(Items, ItemSearchFields, query, merger).fetch();
    }),
    getSalesInvoice: auth(function (key) {
        return Sale.findOne({ key: parseInt(key) });
    }),
    getItemEntries: auth(function (cust_num) {
        console.log(cust_num);
        ItemEntries.remove({});
        //var res = Sale.find({customer_number: cust_num}, {fields: { item_entries: 1 }})
        //_.each(res, function(elem) {
            //if(elem.item_entries) {
                //_.each(elem.item_entries, function (entry) {
                    //ItemEntries.insert(entry);
                //});
            //}
        //});

        var res = Sale.aggregate([ {$match: {customer_number:cust_num}}, {$unwind:"$item_entries"},   {$group:{_id:null, clrs: {$push : "$item_entries"} }},   {$project:{_id:0, colors: "$clrs"}}])
        console.log(res[0].colors);
        //_.each(res[0].colors, function(elem) {
            //console.log('insert');
            //ItemEntries.insert(elem);
        //});
        return res[0].colors;
    }),
    getSalesCreditnota: auth(function (key) {
        return Sale.findOne({ key: parseInt(key) });
    }),
    getPurchaseCreditnota: auth(function (key) {
        return PurchaseCreditnotas.findOne({ key: parseInt(key) });
    }),
    getPurchaseInvoice: auth(function (key) {
        return PurchaseInvoices.findOne({ key: parseInt(key) });
    }),
    getInvoiceKeyByRecordNumber: auth(function (number) {
        return PurchaseInvoices.findOne({ creditor_invoice_number: parseInt(number) }, {fields: {key: 1} });
    }),
    getCreditnotaKeyByRecordNumber: auth(function (number) {
        return PurchaseCreditnotas.findOne({ creditor_creditnota_number: parseInt(number) }, {fields: {key: 1} });
    }),
    getItemStats: auth(function (number, startDate, endDate) {
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
    }),
    getCreditorStats: auth(function (number) {
        return CreditorEntries.aggregate([
                { $match: { creditor_number: number } },
                { $group: { _id: "$type", total: { $sum: "$amount" } } }
        ]);
    }),
    getDeptorStats: auth(function (number) {
        return DeptorEntries.aggregate([
                { $match: { deptor_number: number } },
                { $group: { _id: "$type", total: { $sum: "$amount" } } }
        ]);
    }),
    sendAmqp: auth(function (invoiceNumber) {
        var invoice = Sale.findOne({ key: invoiceNumber });
        var deptor = Deptors.findOne({ key: invoice.customer_number });
        if(!deptor.gln){
            log.info("AMQP edi send cancelled, no gln on deptor", deptor.key);
            Alerts.insert({ message: 'Afsendelse af EDI faktura ' +
                invoiceNumber + ' mislykkedes. GLN nummer mangler på debitor'});
            return;
        }
        if(!deptor.gln_group){
            log.info("AMQP edi send cancelled, no gln_group on deptor", deptor.key);
            Alerts.insert({ message: 'Afsendelse af EDI faktura ' + invoiceNumber +
                ' mislykkedes. GLN gruppe mangler på debitor' });
            return;
        }
        log.info('Sending invoice over amqp:', invoiceNumber);
        log.info('Sending invoice over amqp:', deptor.gln_group);

        // add ean to all items
        var lines_with_ean = [];
        invoice.lines.forEach(function(line) {
            if(line.item_number && !line.gln_number) {
                var item = Items.findOne({ key: line.item_number});
                line.gln_number = item.gln_number;
            }
            lines_with_ean.push(line);
        });
        invoice.lines = lines_with_ean;
        // construct the message
        var object = { invoice: invoice, deptor: deptor };
        object.dry_run = false;
        // set invoice state to processing
        Sale.update(
                { key: invoiceNumber },
                { $set: { 'sent.amqp.state': 'processing',
                          'sent.amqp.time': new Date() } }
        );
        // call in case of error
        var error = function (message) {
            log.error('Unsuccessful send of invoice:', invoiceNumber);
            Sale.update(
                    { key: invoiceNumber },
                    { $set: { 'sent.amqp.state': 'error' } });
            Alerts.insert({ message: 'Afsendelse af EDI faktura ' + invoiceNumber + ' mislykkedes pga.: ' + message });
        }
        amqp.rpc(object, Meteor.settings.amqp_queue, Meteor.bindEnvironment(function (response) {
            if (response.success === true) {
                console.log('successful send of invoice:', invoiceNumber);
                Sale.update(
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
    }),
    sendEmail: auth(function (id) {
        check(id, String);
        log.debug('Send mail called', id);
        var objectId = new Meteor.Collection.ObjectID(id)
        var invoice = Sale.findOne({ _id: objectId });
        var deptor = Deptors.findOne({ key: invoice.customer_number });
        if (!deptor.emails || deptor.emails.length == 0) {
            errors.sync(errors.missingMail, '', log.warning);
        }
        Sale.update(
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
        var emails = deptor.emails.join(',');
        if (Meteor.settings.env !== 'prod') {
            log.info('Sending to test email', Meteor.settings.test_mail);
            emails = Meteor.settings.test_mail;
        }

        var message = Mail.invoice;
        message.subject = 'Faktura ' + invoice.key;
        message.to = emails;
        message.attachments = [ { filename: 'faktura.pdf', filePath: '/tmp/' + invoice.key + '.pdf' } ];

        var error = function (err, msg) {
                Sale.update(
                    { _id: objectId },
                    { $set: { 'sent.mail.state': 'error' } });
                errors.async(err, msg, log.error);


        };
        Pdf.getInvoice(invoice, Meteor.bindEnvironment(function (err, msg) {
            console.log(err, msg);
            //if (err) error(errors.pdfConversion, err);
            log.info('File written to /tmp/' + invoice.key + '.pdf', err, msg);
            log.info('Conversion done, sending mail to', emails);
            transport.sendMail(message, Meteor.bindEnvironment(function (err, message) {
                if (err) error(errors.mailSend, err);
                else if (message.failedRecipients.length > 0) error(errors.recipients, message.failedRecipients);
                else {
                    log.info('Email successfully sent', emails);
                    Sale.update(
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
    })
});
