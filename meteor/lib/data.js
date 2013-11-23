SalesInvoices = new Meteor.Collection('salesinvoices');
SalesCreditnotas = new Meteor.Collection('salescreditnotas');
PurchaseInvoices = new Meteor.Collection('purchaseinvoices');
PurchaseCreditnotas = new Meteor.Collection('purchasecreditnotas');
Deptors = new Meteor.Collection('deptors');
Creditors = new Meteor.Collection('creditors');
Alerts = new Meteor.Collection('alerts');
Items = new Meteor.Collection('items');
ItemEntries = new Meteor.Collection('itementries');

RootRoute = function (args) {
    var route =  Router.current().path.split('/')[1];
    if (args) {
        route += '/' + args;
    }
    return route;

};


log = {
    log: function (level, args) {
            var now = moment().format('DD-MM-YY HH:mm:ss');
            var message = '';
            _.each(args, function (m, i) {
                message += JSON.stringify(m) + ' ';
            });
            console.log(level, ':', now, message);
        }
}
log.info = function () {
    log.log('INFO   ', arguments);
}
log.debug = function () {
    log.log('DEBUG  ', arguments);
}
log.error = function () {
    log.log('ERROR  ', arguments);
}
log.warning = function () {
    log.log('WARNING', arguments);
}
