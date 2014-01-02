DeptorSearchFields = [ 'key', 'name' ];
CreditorSearchFields = [ 'key' ];
ItemSearchFields = [ 'key' ];
ItemEntriesSearchFields = [ 'key' ];
DeptorEntriesSearchFields = [ 'key' ];
CreditorEntriesSearchFields = [ 'key' ];
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
        var number = parseInt(query);
        if (!isNaN(number) && isFinite(query)) {
            list.push({ 'key': number });
        }
        filter = { $or : list };
    }
    if (!merger.options.limit) merger.options.limit = 10;

    //console.log(collection._prefix, merger, query)
    //log.error(_.extend(filter, merger.filter), _.extend({ sort: orderBy }, merger.options))
    return collection.find(_.extend(filter, merger.filter), _.extend({ sort: orderBy }, merger.options));
};

Meteor.publish('PostedSalesInvoices', function (limit, skip, query){
    return FilterQuery(SalesInvoices, SalesInvoiceSearchFields, query,
        { options: {limit: limit, skip: skip } ,
         filter: { posting_date: { $exists: true } } });
});
Meteor.publish('OpenSalesInvoices', function (limit, skip, query){
    console.log(skip)
    return FilterQuery(SalesInvoices, SalesInvoiceSearchFields, query,
        { options: {limit: limit, skip: skip },
         filter: { posting_date: { $exists: false } } });
});
Meteor.publish('PurchaseInvoices', function (limit, skip, query){
    return FilterQuery(PurchaseInvoices, PurchaseInvoiceSearchFields, query,
        { options: {limit: limit, skip: skip }});
});
Meteor.publish('SalesCreditnotas', function (limit, skip, query){
    return FilterQuery(SalesCreditnotas, SalesCreditnotaSearchFields, query,
        { options: {limit: limit, skip: skip }});
});
Meteor.publish('PurchaseCreditnotas', function (limit, skip, query){
    return FilterQuery(PurchaseCreditnotas, PurchaseCreditnotaSearchFields, query,
        { options: {limit: limit, skip: skip }});
});
Meteor.publish('Deptors', function (limit, skip, query, filter){
    return FilterQuery(Deptors, DeptorSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('Creditors', function (limit, skip, query, filter){
    return FilterQuery(Creditors, CreditorSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('Items', function (limit, skip, query, filter){
    return FilterQuery(Items, ItemSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('ItemEntries', function (limit, skip, query, filter){
    return FilterQuery(ItemEntries, ItemEntriesSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('DeptorEntries', function (limit, skip, query, filter){
    return FilterQuery(DeptorEntries, DeptorEntriesSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('CreditorEntries', function (limit, skip, query, filter){
    return FilterQuery(CreditorEntries, CreditorEntriesSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('alertChannel', function (user){
    return Alerts.find();
});
