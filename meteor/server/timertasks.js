/***************************************
 Check for invoices in processing state that have been so for too long.
 Update these to error state
 ***************************************/
Meteor.setInterval(function () {
    var res = Sale.find({ 'sent.amqp.state' : 'processing' });
    var now = new Date().getTime();
    res.forEach(function (elem) {
        // in case its more than 2 minutes old
        if (now - elem.sent.amqp.time.getTime() > 1000*60*2) {
            Sale.update(
                    { _id: elem._id },
                    { $set: { 'sent.amqp.time': new Date(),
                              'sent.amqp.state': 'error' } }
            );
        }
    });
    var res = Sale.find({ 'sent.mail.state' : 'processing' })
    res.forEach(function (elem) {
        // in case its more than 2 minutes old
        if (now - elem.sent.mail.time.getTime() > 1000*60*2) {
            Sale.update(
                    { _id: elem._id },
                    { $set: { 'sent.mail.time': new Date(),
                              'sent.mail.state': 'error' } }
            );
        }
    });
}, 2000);

Meteor.setInterval(function () {
    _.each(Mapping,function (val, key) {
        if(val.collection) {
            CollectionCounts.upsert(
                { _id: key }, 
                {_id: key, count: global[val.collection].find(val.filter || {}).count()});
        }
    });

}, 2000);
