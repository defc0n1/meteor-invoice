var queryMinLength = 2;

var buildRangeQuery = function (query) {
    range = query.split('..');
    if (range.length == 2) {
        var range_query = { $and : [ { key: { $gte: parseInt(range[0]) } }, { key: { $lte: parseInt(range[1]) }} ] };
        return range_query;
    }
    return undefined;
};

var buildFieldQuery = function(searchFields, query) {
    var list = _.map(searchFields, function (field) {
        var number = parseInt(query);
        if (!isNaN(number) && isFinite(query) && field === 'key') {
            return {'$where': '/^' + number + '.*/.test(this.key)'};
        }
        else{
            var obj = {};
            obj[field] = {'$regex': query, '$options': 'i'};
            return obj;
        }
    });
    return { $or : list };
}

FilterQuery = function (collection, searchFields, query, filter, limit, skip) {
    console.log('query', JSON.stringify(query), 'filter', JSON.stringify(filter));

    // options is an optional argument
    var opts = { options: {}};

    // default limit is 10
    opts.limit = limit || 10;

    // default skip is 0, do not skip if it is zero to enable oplog tailing
    if (skip && skip != 0) opts.skip = skip;

    // always sort desc by key
    opts.sort = { key: -1};

    // build query from the search string, either range or regex
    var search_query = {};
    if (query && query.length >= queryMinLength) {
        search_query = buildRangeQuery(query) || buildFieldQuery(searchFields, query);
    }
    //console.log('search_query', JSON.stringify(search_query));

    var finalQuery = {};
    if (search_query && filter) {
        // if both are defined, we put them in an and
        finalQuery.$and = [filter, search_query];
    }
    else {
        // one must be undefined/empty, so we can safely extend
        finalQuery = _.extend(search_query, filter);
    }

    console.log(JSON.stringify(finalQuery), opts, collection._name);
    return collection.find(finalQuery, opts);
};

SearchFields = {
    Sale: [ 'key', 'name', 'customer_number'],
    Purchase: [ 'key' ],
    Item: [ 'key' ],
    Creditor: [ 'key', 'name' ],
    Deptor: [ 'key', 'name' ]
};

var publish_collections = [
    'DeptorPostings', 'Sale', 'History', 'Purchase', 'Deptors', 'Creditors',
    'Items', 'FinanceEntries',
];

_.each(publish_collections, function (collection) {
    Meteor.publish(collection, function (limit, skip, query, filter){
        if (!this.userId) {
            this.ready();
            return;
        }
        return FilterQuery(
            global[collection],
            SearchFields[collection] || [],
            query,
            filter,
            limit,
            skip);
    });
})
var simple_publish_collections = [
    'Alerts', 'MailGroups', 'CollectionCounts', 'TradeAccounts',
];

_.each(simple_publish_collections, function (collection) {
    Meteor.publish(collection, function (limit, skip, query, filter){
        if (!this.userId) {
            this.ready();
            return;
        }
        return global[collection].find();
    });
})
Meteor.publish('Custom', function (collection, query){
    if (!this.userId) {
        this.ready();
        return;
    }
    return global[collection].find(query);
});

