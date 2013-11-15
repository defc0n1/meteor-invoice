SalesInvoices = new Meteor.Collection('salesinvoices');
Deptors = new Meteor.Collection('deptors');
Alerts = new Meteor.Collection('alerts');
Items = new Meteor.Collection('items');

RootRoute = function (args) {
    var route =  Router.current().path.split('/')[1];
    if (args) {
        route += '/' + args;
    }
    return route;

};

