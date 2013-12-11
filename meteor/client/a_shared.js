Messages = new Meteor.Collection(null);
incrementSize = 10;
Session.set('limit', incrementSize);

var collections = [
    'Deptors',
    'Creditors',
    'Items',
    'ItemEntries',
    'DeptorEntries',
    'CreditorEntries',
    'SalesInvoices',
    'SalesCreditnotas',
    'PurchaseInvoices',
    'PurchaseCreditnotas',
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
    Meteor.subscribe('alertChannel');
});

//this could instead be run on collection ready
Deps.autorun(function () {
    var type = Session.get('type');
    if (type) {
        Meteor.call(type.collection,
                Session.get(type.collection + 'query'),
                { filter: Session.get(type.collection + 'filter') },
                function(err, result) {
                    err && log.error(err);
                    Session.set('itemCount', result);
                });
    }
});


