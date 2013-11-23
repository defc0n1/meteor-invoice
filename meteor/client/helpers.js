
var handlebarHelpers = {}

var register = function(name, func) {
    handlebarHelpers[name] = func;
    Handlebars.registerHelper(name, func);

}
register('countText', function () {
    var count = Session.get('itemCount');
    if (count < incrementSize) {
        return 'Viser alle';
    }
    else {
        var start = Session.get('skip') + 1;
        return 'Viser ' + start + ' til ' +
        Math.min((start + incrementSize - 1), count)  +
        ' af ' + count;
    }
});

register('showPrevious', function() {
    var disable = Session.equals('skip', 0);
    return disable ? 'disabled' : '';
});
register('showNext', function() {
    var disable = Session.get('skip') + incrementSize >= Session.get('itemCount');
    return disable ? 'disabled' : '';
});

register('GetDate', function(date) {
    if (date) {
        return moment(date).format('DD MMM YYYY');
    }
    else{
        return '';
    }
});

register('GetPrice', GetPrice);

register('Session', function(arg) {
    return Session.get(arg);
});

register('Element', function(arg) {
    return Session.get('element');
});
register('ElementProp', function(arg) {
    elem = Session.get('element');
    return elem && elem[arg];
});

register('Multiply', function(arg1, arg2) {
    console.log(arg1, arg2)
    return arg1 * arg2;
});

Handlebars.registerHelper('chain', function () {
    var args = Array.prototype.slice.call(arguments).slice(0, arguments.length - 1);
    var value = undefined;
    var dyn_args = [];
    args.reverse().forEach(function (arg, i) {
        if (handlebarHelpers[arg]) {
            value = handlebarHelpers[arg].apply(this, dyn_args);
            dyn_args = [value];
        }
        else {
            dyn_args.push(arg);
        }
    });
    return value;
});
