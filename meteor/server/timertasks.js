/***************************************
 Check for invoices in processing state that have been so for too long.
 Update these to error state
 ***************************************/
Meteor.setInterval(function () {
    var res = SalesInvoices.find({ 'sent.amqp.state' : 'processing' });
    var now = new Date().getTime();
    res.forEach(function (elem) {
        // in case its more than 2 minutes old
        if (now - elem.sent.amqp.time.getTime() > 1000*60*2) {
            SalesInvoices.update(
                    { _id: elem._id },
                    { $set: { 'sent.amqp.time': new Date(),
                              'sent.amqp.state': 'error' } }
            );
        }
    });
    var res = SalesInvoices.find({ 'sent.mail.state' : 'processing' })
    res.forEach(function (elem) {
        // in case its more than 2 minutes old
        if (now - elem.sent.mail.time.getTime() > 1000*60*2) {
            SalesInvoices.update(
                    { _id: elem._id },
                    { $set: { 'sent.mail.time': new Date(),
                              'sent.mail.state': 'error' } }
            );
        }
    });
}, 2000);
