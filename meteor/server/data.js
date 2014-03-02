DeptorSearchFields = [ 'key', 'name' ];
CreditorSearchFields = [ 'key' ];
ItemSearchFields = [ 'key' ];
FinanceEntriesSearchFields = [ 'key' ];
PurchaseSearchFields = [ 'key' ];
SaleSearchFields = [ 'key' ];

var queryMinLength = 2;
//var invoiceSearchFields = [ 'customer_number', '_id', 'name', 'city', 'zip' ];

FilterQuery = function (collection, fields, query, merger) {
    if (!merger) merger = { options: {}};
    if (!merger.options) merger.options = {};

    var filter = {};
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


    var sort = merger.filter && merger.filter.sort ? merger.filter.sort : { key: -1};
    if(merger.filter && merger.filter.sort)
        delete merger.filter.sort;
    var finalQuery = _.extend(filter, merger.filter);
    //console.log(merger, sort)
    var options = _.extend(merger.options, { sort: sort });
    var options = merger.options
    console.log(finalQuery, options, collection._name);
    return collection.find(finalQuery, options);
};
Meteor.publish('DeptorPostings', function (limit, skip, query, filter){
    return FilterQuery(Sale, SaleSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('Sale', function (limit, skip, query, filter){
    return FilterQuery(Sale, SaleSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('Purchase', function (limit, skip, query, filter){
    return FilterQuery(Purchase, PurchaseSearchFields, query,
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
Meteor.publish('FinanceEntries', function (limit, skip, query, filter){
    return FilterQuery(FinanceEntries, FinanceEntriesSearchFields, query,
        { options: {limit: limit, skip: skip }, filter: filter});
});
Meteor.publish('alertChannel', function (){
    return Alerts.find();
});
Meteor.publish('TradeAccounts', function (){
    return TradeAccounts.find();
});

//throttle = _.debounce(function (collection, count, ref) {
    //self.changed("counts", collection, {count: count});
//}, 10);

//Meteor.publish("CollectionCounts", function (collection, filter) {
  //var self = this;
  //var count = 0;
  //var initializing = true;
  //var handle = global[collection].find(filter).observeChanges({
    //added: function (id) {
      //count++;
      ////if (!initializing)
        ////self.changed("counts", collection, {count: count});
    //},
    //removed: function (id) {
      ////count--;
      ////self.changed("counts", collection, {count: count});
    //}
    //// don't care about moved or changed
  //});

  //// Observe only returns after the initial added callbacks have
  //// run.  Now return an initial value and mark the subscription
  //// as ready.
  //initializing = false;
  //self.added("counts", collection, {count: count});
  //self.ready();

  //// Stop observing the cursor when client unsubs.
  //// Stopping a subscription automatically takes
  //// care of sending the client any removed messages.
  //self.onStop(function () {
    //handle.stop();
  //});
//});

Meteor.publish('CollectionCounts', function (collection, query){
    return CollectionCounts.find();
});

Meteor.publish('Custom', function (collection, query){
    return global[collection].find(query);
});
