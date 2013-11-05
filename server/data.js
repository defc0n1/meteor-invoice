SalesInvoices = new Meteor.Collection('salesinvoices');
Deptors = new Meteor.Collection('deptors');
Alerts = new Meteor.Collection('alerts');
Items = new Meteor.Collection('items');

var queryMinLength = 2;
//var invoiceSearchFields = [ 'customer_number', '_id', 'name', 'city', 'zip' ];
var invoiceSearchFields = [ '_id' ];

Meteor.publish('invchannel', function (limit, skip, query){
    var filter = {};
    var orderBy = { _id: -1 };
    if (query && query.length > queryMinLength) {
        list = _.map(invoiceSearchFields, function (field) {
            console.log(field);
            var obj = {};
            obj[field] = { '$regex': query, '$options': 'i' };
            return obj;
        });
        filter = { $or : list };
    }
    return SalesInvoices.find(filter, { limit: limit, skip: skip, sort: orderBy });
});
Meteor.publish('deptorChannel', function (limit, skip, query){
    var filter = {};
    var orderBy = { _id: -1 };
    if (query && query.length > queryMinLength) {
        list = _.map(invoiceSearchFields, function (field) {
            console.log(field);
            var obj = {};
            obj[field] = { '$regex': query, '$options': 'i' };
            return obj;
        });
        filter = { $or : list };
    }
    return Deptors.find(filter, { limit: limit, skip: skip, sort: orderBy });
});
Meteor.publish('alertChannel', function (user){
    return Alerts.find();
});
