CollectionCounts = new Meteor.Collection('counts');
Counters = new Meteor.Collection('counters');
Sale = new Meteor.Collection('sale');
Purchase = new Meteor.Collection('purchase');
Deptors = new Meteor.Collection('deptors');
Creditors = new Meteor.Collection('creditors');
Alerts = new Meteor.Collection('alerts');
TradeAccounts = new Meteor.Collection('accounts');
Items = new Meteor.Collection('items', { idGeneration: 'MONGO'});
FinanceEntries = new Meteor.Collection('financeentries');
MailGroups = new Meteor.Collection('mailgroups');
History = new Meteor.Collection('history');

ItemEntries = new Meteor.Collection(null);


UpdateCollection = function(collection, id, update){
        // accepts both string objectIds and
        // mongo object Ids, and converts accordingly
        if(_.isString(id)){
            id = new Meteor.Collection.ObjectID(id)
        }
        collection.update({ _id: id }, { $set: update }, function (err, msg) {
            console.log(err, msg);
            if (err) {
                console.log(err);
                //Messages.insert({ message: 'Nøgle eksisterer allerede' });
            }
        });

}
GetCurrentCollection = function (capitalize) {
    var typeName = Router.current().params.type;
    var capString = typeName.charAt(0).toUpperCase() + typeName.slice(1);
    return window[capString];
};

ClearFilters = function () {
var collections = [
    'Deptors',
    'Creditors',
    'Items',
    'FinanceEntries',
    'Sale',
    'Purchase',
    ];
    _.each(collections, function (collection) {
            Session.set(collection + 'limit', null),
            //delete Session[collection + 'skip'],
            Session.set(collection + 'skip', null),
            Session.set(collection + 'query', null),
            Session.set(collection + 'filter', null)

    });
    //$('#search-query').val('');
    Session.set('viewTitle', '');
}

SetFilter = function(filter, extend, router) {
    var typeName = Router.current().params.type;
    var capString = typeName.charAt(0).toUpperCase() + typeName.slice(1);
    var mapping = GetCurrentMapping();
    if (extend) {
        var oldFilter = Session.get(mapping.collection + 'filter');
        filter = _.extend(oldFilter || {}, filter);
    }
    Session.set(mapping.collection + 'filter', filter);
    if (router) {
        //router.subscribe(mapping.collection, router.params.key).wait();
    }
};

Required = function(name, message, f) {

    var val = $(name).val();
    if(!val){
        bootbox.alert(message);
        return false;
    }
    else{
        f(val);
    }
}
GetCurrentMappingName = function () {
    return Router.current().params.type;
};
GetCurrentMapping = function () {
    return Mapping[Router.current().params.type];
};
GetCurrentCollectionName = function () {
    return Mapping[Router.current().params.type].collection;
};
GetCurrentKey = function () {
    return Router.current().params.key;
};
GetCurrentType = function () {
    return Router.current().params.type;
};


BuildLink = function (elem, props, key) {
    if (props.key) {
        return props.root + props.map[elem[props.key]] + key;
    }
    else {
        return props.root + key;
    }
};


// these settings makes the stuff fit on the pdf conversion
lpp = 39;
lfirst = 26;
llast = 31;

log = {
    log: function (level, args) {
            var caller_line = (new Error).stack.split("\n")[4]
            var now = moment().format('DD-MM-YY HH:mm:ss');
            var message = '';
            _.each(args, function (m, i) {
                message += JSON.stringify(m) + ' ';
            });
            console.log(level, ':', now, message, caller_line);
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

