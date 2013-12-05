Messages = new Meteor.Collection(null);
incrementSize = 10;
Session.set('limit', incrementSize);

var collections = [
    'Deptors',
    'Creditors',
    'Items',
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
        console.log('err', err);
    }
    _.each(collections, function (collection) {
        //progressCount += 1

        Meteor.subscribe(collection,
            Session.get(collection + 'limit'),
            Session.get(collection + 'skip'),
            Session.get('query'),
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

UpdateCount = function (method) {
    Meteor.call(method,
            Session.get('query'),
            { filter: Session.get('filter') },
            function(err, result) {
                err && console.log(err);
                Session.set('itemCount', result);
            });
};


