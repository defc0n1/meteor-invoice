InvoiceSearchFields = [ 'key' ];
DeptorSearchFields = [ 'key' ];

var queryMinLength = 2;
//var invoiceSearchFields = [ 'customer_number', '_id', 'name', 'city', 'zip' ];

FilterQuery = function (collection, fields, query, merger) {
    if (!merger) merger = { options: {}};
    if (!merger.options) merger.options = {}; 

    var filter = {};
    var orderBy = { key: -1 };
    if (query && query.length > queryMinLength) {
        list = _.map(fields, function (field) {
            var obj = {};
            obj[field] = { '$regex': query, '$options': 'i' };
            return obj;
        });
        filter = { $or : list };
    }
    console.log(merger);
    if (!merger.options.limit) merger.options.limit = 10;
    console.log(merger);
    return collection.find(_.extend(filter, merger.filter), _.extend({ sort: orderBy }, merger.options));

};

Meteor.publish('invchannel', function (limit, skip, query){
    return FilterQuery(SalesInvoices, InvoiceSearchFields, query,
        { options: {limit: limit, skip: skip }});
});
Meteor.publish('deptorChannel', function (limit, skip, query, filter){
    return FilterQuery(Deptors, DeptorSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('alertChannel', function (user){
    return Alerts.find();
});
