DeptorSearchFields = [ 'key' ];
CreditorSearchFields = [ 'key' ];
ItemSearchFields = [ 'key' ];
SalesInvoiceSearchFields = [ 'key', 'customer_number', 'name' ];
PurchaseInvoiceSearchFields = [ 'key' ];
SalesCreditnotaSearchFields = [ 'key' ];
PurchaseCreditnotaSearchFields = [ 'key' ];

var queryMinLength = 2;
//var invoiceSearchFields = [ 'customer_number', '_id', 'name', 'city', 'zip' ];

FilterQuery = function (collection, fields, query, merger) {
    if (!merger) merger = { options: {}};
    if (!merger.options) merger.options = {};

    var filter = {};
    var orderBy = { key: -1 };
    if (query && query.length >= queryMinLength) {
        list = _.map(fields, function (field) {
            var obj = {};
            obj[field] = { '$regex': query, '$options': 'i' };
            return obj;
        });
        filter = { $or : list };
    }
    if (!merger.options.limit) merger.options.limit = 10;

    return collection.find(_.extend(filter, merger.filter), _.extend({ sort: orderBy }, merger.options));

};

Meteor.publish('salesinvoiceChannel', function (limit, skip, query){
    return FilterQuery(SalesInvoices, SalesInvoiceSearchFields, query,
        { options: {limit: limit, skip: skip }});
});
Meteor.publish('purchaseinvoiceChannel', function (limit, skip, query){
    return FilterQuery(PurchaseInvoices, PurchaseInvoiceSearchFields, query,
        { options: {limit: limit, skip: skip }});
});
Meteor.publish('salescreditnotaChannel', function (limit, skip, query){
    return FilterQuery(SalesCreditnotas, SalesCreditnotaSearchFields, query,
        { options: {limit: limit, skip: skip }});
});
Meteor.publish('purchasecreditnotaChannel', function (limit, skip, query){
    return FilterQuery(PurchaseCreditnotas, PurchaseCreditnotaSearchFields, query,
        { options: {limit: limit, skip: skip }});
});
Meteor.publish('deptorChannel', function (limit, skip, query, filter){
    return FilterQuery(Deptors, DeptorSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('creditorChannel', function (limit, skip, query, filter){
    return FilterQuery(Creditors, CreditorSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('itemChannel', function (limit, skip, query, filter){
    return FilterQuery(Items, ItemSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('alertChannel', function (user){
    return Alerts.find();
});
