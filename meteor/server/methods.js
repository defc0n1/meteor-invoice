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
    unsubscribe: function (email) {
        var res = Deptors.update({secondary_emails: { $in: [email]}},{$set: {'notifications.newsletter': 0}});
    },
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
    DeleteMailGroup: auth(function (name) {
        log.info('Removing mailgroup', name)
        var update = {};
        var groupname = 'mailgroups.' + name;
        update[groupname] = 1;
        Deptors.update(update, {$unset: update}, {multi: true});
        MailGroups.remove({_id: name});
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
        console.log(res[0]);
        //_.each(res[0].colors, function(elem) {
            //console.log('insert');
            //ItemEntries.insert(elem);
        //});
        return res[0].colors;
    }),
    getBalance: auth(function () {
        //var res = Sale.find({customer_number: cust_num}, {fields: { item_entries: 1 }})
        //_.each(res, function(elem) {
            //if(elem.item_entries) {
                //_.each(elem.item_entries, function (entry) {
                    //ItemEntries.insert(entry);
                //});
            //}
        //});
        var res = Sale.aggregate([ {$project: {'entries': 1}},
            {$unwind:"$entries"},
            { $match: {
                         'entries.account_number': '1000'}},
            {$group: {_id: null, total: {$sum : "$entries.amount"}}}]);
        console.log(res);
        //_.each(res[0].colors, function(elem) {
            //console.log('insert');
            //ItemEntries.insert(elem);
        //});
        return res;
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
        // only invoices wich contains the item number
        var match = { posting_date: {}, 'lines.item_number': number };
        //var match = { posting_date: {}};
        if (endDate) {
            var date = new Date(endDate)
            match.posting_date = { $lte: date };
        }
        if (startDate) {
            var date = new Date(startDate)
            match.posting_date.$gte = date;
        }
        log.info(startDate, endDate);
        log.info(match.posting_date);
        var query = [
            { $match: match },
            {$project: {lines: 1, key: 1, _id: 0}},
            { $unwind: "$lines"},
            // only lines with the item number
            { $match: { 'lines.item_number': number}},
            { $group: { _id: "sale", total: { $sum: "$lines.total_without_tax" }, quantity: { $sum: "$lines.quantity" } } }
        ];
        log.info(query);
        match.type = 'invoice';
        var res1 = Sale.aggregate(query)[0];
        match.type = 'creditnota';
        var res2 = Sale.aggregate(query)[0];
        if(!res2 && res1){
            return [{_id: 'Salg', total: res1.total, quantity: res1.quantity}];
        }
        else if(!res1 && res2){
            return [{_id: 'Salg', total: -res2.total, quantity: -res2.quantity}];
        }
        return [{_id: 'Salg', total: res1.total - res2.total, quantity: res1.quantity - res2.quantity}];

        //return Sale.aggregate([
                //{ $match: match },
                //{ $group: { _id: "$type", total: { $sum: "$total_price" }, quantity: { $sum: "$quantity" } } }
                //]);
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
    sendAmqp: auth(function (invCredNumber) {
        var invCred = Sale.findOne({ key: invCredNumber });
        var deptor = Deptors.findOne({ key: invCred.customer_number });
        if(!deptor){
            log.info("AMQP edi send cancelled, no deptor", invCred.customer_number);
            Alerts.insert({ message: 'Afsendelse af EDI faktura/kreditnota ' +
                invCredNumber + ' mislykkedes. Debitor findes ikke'});
            return;
        }
        if(!deptor.gln){
            log.info("AMQP edi send cancelled, no gln on deptor", deptor.key);
            Alerts.insert({ message: 'Afsendelse af EDI dokument ' +
                invCredNumber + ' mislykkedes. GLN nummer mangler på debitor'});
            return;
        }
        if(!deptor.gln_group){
            log.info("AMQP edi send cancelled, no gln_group on deptor", deptor.key);
            Alerts.insert({ message: 'Afsendelse af EDI faktura/kreditnota ' + invCredNumber +
                ' mislykkedes. GLN gruppe mangler på debitor' });
            return;
        }
        log.info('Sending invoice/creditnota over amqp:', invCredNumber);

        // add ean to all items
        var lines_with_ean = [];
        invCred.lines.forEach(function(line) {
            if(line.item_number && !line.gln_number) {
                var item = Items.findOne({ key: line.item_number});
                if(!item){
                    log.info("AMQP edi send cancelled, item does not exist", line.item_number);
                    Alerts.insert({ message: 'Afsendelse af EDI faktura/kreditnota ' +
                        invCredNumber + ' mislykkedes. Vare eksisterer ikke:' + line.item_number});
                    errors.sync('test', 'test');
                }
                line.gln_number = item.gln_number;
            }
            lines_with_ean.push(line);
        });
        invCred.lines = lines_with_ean;
        // construct the message
        var object = { doc: invCred, deptor: deptor };
        object.dry_run = false;
        // set invoice/creditnota state to processing
        var historyId = UUID.v1()
        History.insert({_id: historyId, state: 'pending', type: 'edi', created: new Date(), user: Meteor.user().emails[0].address,
            data: {number: invCredNumber}});
        Sale.update(
                { key: invCredNumber },
                { $set: { 'sent.amqp.state': 'processing',
                          'sent.amqp.time': new Date() } }
        );
        // call in case of error
        var error = function (message) {
            log.error('Unsuccessful send of invoice/creditnota:', invCredNumber);
            History.update({_id: historyId}, { $set: {state: 'error', error: message}});
            Sale.update(
                    { key: invCredNumber },
                    { $set: { 'sent.amqp.state': 'error' } });
            Alerts.insert({ message: 'Afsendelse af EDI faktura ' + invCredNumber + ' mislykkedes pga.: ' + message });
        }
        amqp.rpc(object, Meteor.settings.amqp_queue, Meteor.bindEnvironment(function (response) {
            if (response.success === true) {
                console.log('successful send of invoice/creditnota:', invCredNumber);
                History.update({_id: historyId}, { $set: {state: 'success'}});
                Sale.update(
                    { key: invCredNumber },
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
    sendNewsletter: auth(function(groupName, email, imageName, subject) {
        var historyId = UUID.v1()
        var count = 1;
        if(email){
            var emails = email;
        }
        else {
            var group = 'mailgroups.' + groupName;
            var match = {'notifications.newsletter': {$ne: 0}};
            match[group] = 1;
            var recipients = Deptors.find(match).fetch();
            var emails = [];
            _.each(recipients, function(v, k) {
                emails = emails.concat(v.secondary_emails);
            });
            if (Meteor.settings.env !== 'prod') {
                log.info('Sending to test email', Meteor.settings.test_mail);
                emails = Meteor.settings.test_mail;
            }
            else{
                count = emails.length;
                var emails = emails.join(',')
            }
        }
        History.insert({_id: historyId, state: 'pending', type: 'newsletter', created: new Date(), user: Meteor.user().emails[0].address,
            data: {emails: emails, group: groupName, imageName: imageName, count: count}});
        log.info('Preparing to send newsletter to', group, emails);
        Assets.getText('newsletter.handlebars', function (err, temp) {
            var template = Handlebars.compile(temp, {noEscape: true});
            var html = template({
                subject: subject,
                imageName: imageName });

            var transport = Mail.getTransport();
            var message = {
                sender: 'tradehouse@tradehouse.as',
                subject: subject,
                html: html,
                bcc: emails,
                replyTo: 'post@tradehouse.as',
            }

            transport.sendMail(message, Meteor.bindEnvironment(function (err, message) {
                if (err) errors.async(errors.mailSend, err);
                else if (message.failedRecipients.length > 0) {
                    errors.async(errors.recipients, message.failedRecipients, log.error);
                    History.update({_id: historyId}, { $set: {state: 'error', error: e}});
                }
                else {
                    log.info('Email successfully sent', message.to);
                    History.update({_id: historyId}, { $set: {state: 'success'}});
                }
            }, function (e) {
                History.update({_id: historyId}, { $set: {state: 'error', error: e}});
                errors.async(errors.unknown, e, log.warning);
            }));
        });
    }),
    sendEmail: auth(function (id) {
        check(id, String);
        log.debug('Send mail called', id);
        var objectId = new Meteor.Collection.ObjectID(id)
        var invoice = Sale.findOne({ _id: objectId });
        var deptor = Deptors.findOne({ key: invoice.customer_number });
        if (!deptor.primary_emails || deptor.primary_emails.length == 0) {
            errors.sync(errors.missingMail, '', log.warning);
        }
        Sale.update(
                { _id: objectId },
                { $set: { 'sent.mail.time': new Date(),
                          'sent.mail.state': 'processing' } }
        );

        var transport = Mail.getTransport();
        var emails = deptor.primary_emails.join(',');
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
