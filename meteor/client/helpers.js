
TableMaxLength = 22;
Shorten = function(arg) {
    if (arg.length > TableMaxLength) {
        return arg.substr(0, 24);
    }
    return arg;

};

var handlebarHelpers = {}

var register = function(name, func) {
    handlebarHelpers[name] = func;
    Handlebars.registerHelper(name, func);

}
register('CountText', function () {
    var type = Session.get('type');
    var collection = type.subCollection || type.collection;
    var count = Session.get(collection + 'itemCount');
    if (count < incrementSize) {
        return 'Viser alle';
    }
    else {
        var start = Session.get(collection + 'skip', 0) + 1;
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
register('Shorten', function(arg) {
    return Session.get('element');
});
register('ListIndex', function (arg) {
    return _.map(arg, function (item, index) {
      item.index = index;
      return item;
    });
});
register('Element', function(arg) {
  return Session.get('element');
});
register('ElementProp', function(elem, prop, method, isLink) {

  // console.log(elem);

  if (isLink) {
    var view = Session.get('type').views[elem.type];
    
    if (view) {
      var path = 'show/' + Session.get('type').views[elem.type].path + '/' + elem['record_number'];
      var link = '<a class="link", href=/' + path + '>' + elem[prop] + '</a>';
      return new Handlebars.SafeString(link);
    }
  }

  var res = '';
  if (window[method]) {
       res = window[method](elem[prop]);
  }
  else{
      res = elem[prop];
  }
  if (res && res.length > TableMaxLength) {
      var shortString = res.substr(0, TableMaxLength - 2) + '..';
      var link = '<a href="#" class="table-tooltip" data-toggle="tooltip" title="' + res + '">' + shortString + '</a>';
      return new Handlebars.SafeString(link);
  }
  return res;
});
register('Prop', function() {
    var args = _.initial(arguments);
    var args = _.rest(args);
    var elem = Session.get(arguments[0]);
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
