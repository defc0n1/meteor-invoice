Messages = new Meteor.Collection(null);
incrementSize = 10;
Session.set('limit', incrementSize);

var collections = [
    'Deptors',
    'Creditors',
    'Items',
    'OpenSalesInvoices',
    'PostedSalesInvoices',
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


var updateCounts = function (collections) {
    _.each(collections, function (collection) {
    Meteor.call('Count', collection,
            Session.get(collection + 'query'),
            { filter: Session.get(collection + 'filter') },
            function(err, result) {
                err && log.error(err);
                Session.set(collection + 'itemCount', result);
            });
    });
};
var cols = {
    'Deptors': undefined,
    'Creditors': undefined,
    'Items': undefined,
    'SalesInvoices': ['OpenSalesInvoices', 'PostedSalesInvoices'],
    'SalesCreditnotas': undefined,
    'PurchaseInvoices': undefined,
    'PurchaseCreditnotas': undefined,
};
DoCount = function () {
    _.chain(cols).keys().each(function (key) {
        extra = []
        if (cols[key]) {
            extra = cols[key];
        }
        else {
            extra = [key];
        }
        updateCounts(extra);
        //return window[key].find().observeChanges({
            //added: updateCounts(extra),
            //removed: updateCounts(extra),
        //});
    });
}
DoCount();

