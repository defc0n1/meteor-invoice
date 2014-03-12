Messages = new Meteor.Collection(null);
incrementSize = 10;
Session.set('limit', incrementSize);


Meteor.subscribe('TradeAccounts');
Meteor.subscribe('alertChannel');
Meteor.subscribe("CollectionCounts");

var collections = [
    'Deptors',
    'Creditors',
    'Items',
    'FinanceEntries',
    'Sale',
    'Purchase',
    ];
Deps.autorun(function() {
    var progressCount = 1;
    try {
        NProgress.start();
    }
    catch (err) {
        log.error('err', err);
    }
    _.each(collections, function (collection) {
        //progressCount += 1
        Meteor.subscribe(collection,
            Session.get(collection + 'limit'),
            Session.get(collection + 'skip'),
            Session.get(collection + 'query'),
            Session.get(collection + 'filter'),
            function () {
                progressCount -= 1;
                if (progressCount <= 0) {
                    NProgress.done();
                }
            });
    });
});
