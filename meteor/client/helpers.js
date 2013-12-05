
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

register('GetDate', GetDate);

register('GetPrice', GetPrice);

register('Session', function(arg) {
    return Session.get(arg);
});
register('Element', function(arg) {
    return Session.get('element');
});
register('ElementProp', function(elem, prop, method) {
    if (window[method]) {
        return window[method](elem[prop]);
    }
    return elem[prop];
});
register('Prop', function(arg) {
    var args = Array.prototype.slice.call(arguments).slice(1, arguments.length - 1);
    var elem = Session.get(arguments[0]);
    args.forEach(function (arg, i) {
        elem = elem[arg];
    });
    return elem;
});

register('Multiply', function(arg1, arg2) {
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
Handlebars.registerHelper('With', function(){
  // Handlebars passes the options as the last argument.
  var args = _.initial(arguments);
  var options = _.last(arguments);

  var withContext = {};
  var only = false;

  if(args.length >= 1){
    var onlyArg = _.first(args);
    if(_.isString(onlyArg) && onlyArg == 'only'){
      only = true;
      args = _.tail(args);
    }
  }

  // Extend the current context unless only is specified.
  var initialContext = only ? {} : this;

  // Merge all of the passed context arguments.
  args.unshift({});
  var argsContext = _.extend.apply(_, args);

  // Finally, merge everything including the hash.
  var context = _.extend({}, initialContext, argsContext, options.hash);
  return options.fn(context);
});
