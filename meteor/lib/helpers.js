handlebarHelpers = {};
TableMaxLength = 22;
Shorten = function(arg) {
    if (arg && arg.length > TableMaxLength) {
        return arg.substr(0, 24);
    }
    return arg;

};
if( Meteor.isServer) {
    Handlebars = Meteor.require('handlebars');
}

var register = function(name, func) {
    handlebarHelpers[name] = func;
    Handlebars.registerHelper(name, func);

};

GetPrice = function (amount) {
        if(isNaN(amount)){
            var a = 0;
            return a.toFixed(2) ;
        }
        amount = amount/100;
        amount = amount.toFixed(2);
        //if(amount.length === 2){
        //return '00.' + amount;
        //}
    //var money = amount.substring(0, amount.length-2) + '.' + amount.substring(amount.length-2, amount.length);
    //return money;
        amount = amount + '';
        amount = amount.replace('.', ',');
        var val = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return val;
};
register('GetPrice', GetPrice);
register('showFewer', function() {
        return (parseInt(Router.current().params.page) || 10) <= 10 ? 'disabled' : '';
});
        //var size = CollectionCounts.findOne(GetCurrentMappingName()).count
        //var offset = 0;
        //if (size % incrementSize == 0) {
            //offset = -1
        //}
        //var skip = (parseInt(size/incrementSize) + offset) * 10
    //showMore: function() {
        //var type = Session.get('type');
        //var collection = type.collection;
        //var obj = CollectionCounts.findOne(GetCurrentMappingName());
        //if (obj) {
            //var disable = Session.get(collection + 'skip') + incrementSize >= obj.count;
            //return disable ? 'disabled' : '';
        //}
        //else {
            //return false;
        //}
        //return '';
    //},
GetDate = function (date) {
    if (date) {
        return moment(date).format('DD MMM YYYY');
    }
    else{
        return '';
    }
};
register('GetDate', GetDate);

GetDateTime = function (date) {
    if (date) {
        return moment(date).format('DD MMM YY, HH:mm:ss');
    }
    else{
        return '';
    }
};
register('GetDateTime', GetDateTime);

Handlebars.registerHelper('chain', function () {
    var args = _.initial(arguments);
    var value = undefined;
    var dyn_args = [];
    var that = this;
    args.reverse().forEach(function (arg, i) {
        if (handlebarHelpers[arg]) {
            value = handlebarHelpers[arg].apply(that, dyn_args);
            dyn_args = [value];
        }
        else {
            dyn_args.push(arg);
        }
        console.log(value, dyn_args)
    });
    return value;
});
register('CountText', function () {
    var obj_with_count = CollectionCounts.findOne(GetCurrentMappingName());
    if (obj_with_count === undefined)
        return "Beregner størrelse";

    var count = obj_with_count.count
    if (count < incrementSize) {
        return 'Viser alle';
    }
    else {
        var start = Session.get(GetCurrentCollectionName() + 'skip', 0) + 1;
        return 'Viser ' + start + ' til ' +
    Math.min((start + incrementSize - 1), count)  +
    ' af ' + count;
    }
});

register('Equals', function(val1, val2, out) {
    if (val1 == val2){
        return out;
    }
    else {
        return '';
    }
});
register('Session', function(arg) {
    // return the value of arg in session
    if (Meteor.isServer) {
        return this.total;
    }
    else {
        return Session.get(arg);
    }
});
register('Shorten', function(arg) {
    return Session.get('element');
});
register('xEditable', function() {
    var args = _.initial(arguments);
    var value = _.first(args);
    var selector = _.rest(args).join('');
    var el = $(selector);
    if(value){
        el.editable('setValue', value);
    }
    else{
        el.editable('setValue', null);
    }
return value;
});
register('ListIndex', function (arg) {
    return _.map(arg, function (item, index) {
        // In case each item is not object, we wrap it inside an object with a value key
        if ( !_.isObject(item) ) {
            item = { value: item };
        }
        item.index = index;
        return item;
    });
});
register('Element', function(arg) {
    if (Meteor.isServer) {
        return this;
    }
    else {
        return Session.get('element');
    }
});
var tooltipShorten = function (res, length) {
    if(res && res.length > length){
        var shortString = res.substr(0, length - 2) + '..';
        var link = '<a href="#" class="table-tooltip" data-toggle="tooltip" title="' + res + '">' + shortString + '</a>';
        return new Handlebars.SafeString(link);
    }
    else{
        return res;
    }
};
register('TooltipShorten', tooltipShorten);
register('ElementProp', function(elem, prop, method, link) {
    // guard against undefined
    if (!elem)
        return;

    var mapping = Session.get('type');
    if (link) {
        var path = window[link.method](elem, link.props, elem[prop]);
        var link = '<a class="link", href=/' + path + '>' + elem[prop] + '</a>';
        return new Handlebars.SafeString(link);
    }

    var res = '';
    if (window[method]) {
        res = window[method](elem[prop]);
    }
    else{
        res = elem[prop];
    }
    return tooltipShorten(res, TableMaxLength);
});
register('Prop', function() {
    var args = _.initial(arguments);
    var args = _.rest(args);
    if (Meteor.isServer) {
        var elem = this[arguments[0]];
    }
    else {
        var elem = Session.get(arguments[0]);
    }
    args.forEach(function (arg, i) {
        elem = elem[arg];
    });
    return elem;
});

register('Multiply', function (arg1, arg2) {
    return arg1 * arg2;
});

register('key_value', function (context, options) {
    var result = [];
    _.each(context, function(value, key, list){
        result.push({key:key, value:value});
    });
    return result;
});
