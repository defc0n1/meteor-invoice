Wkhtmltopdf = Meteor.require('wkhtmltopdf');
Nodemailer = Meteor.require('nodemailer');
UUID = Meteor.require('node-uuid');
Future = Meteor.require('fibers/future');
Fiber = Meteor.require('fibers');
util = Meteor.require('util');
Handlebars = Meteor.require('handlebars');

//process.on('SIGINT', function () {
    //console.log('Closing AMQP connection');
    ////connection.end()
//});
//process.on('SIGHUP', function () {
    //console.log('Closing AMQP connection');
    ////connection.end()
//});
//process.on('SIGTERM', function () {
    //console.log('Closing AMQP connection');
    ////connection.end()
//});

Meteor.startup(function () {
    var fs = Meteor.require('fs');
    fs.writeFile(Meteor.settings.pid, process.pid, function(err) {
        if (err) console.log(err);
        console.log(process.pid);
    });
    log.debug(Meteor.settings);
    amqp.connect();
});

Handlebars.registerHelper('GetDate', GetDate);
Handlebars.registerHelper('GetPrice', GetPrice);
var getLines = function (elem, page) {
        console.log(page);
        if (elem) {
            if (!page) return elem.lines;
            if (page === '1') {
                return _.chain(elem.lines).first(lfirst).value();
            }
            else {
                log.info('res');
                return _.chain(elem.lines).rest(lfirst + (page - 2) * lpp).first(lpp).value();
            }
        }
        return [];
};
Handlebars.registerHelper('Prop', function(arg) {
    console.log(arg, 'dsfdfssa');
    var args = _.initial(arguments);
    var elem = this[_.first(arguments)];
    _.rest(args, 1).forEach(function (arg, i) {
        elem = elem[arg];
    });
    return elem;
});
Handlebars.registerHelper('chain', function () {
    var args = _.initial(arguments);
    var value = undefined;
    var dyn_args = [];
    args.reverse().forEach(function (arg, i) {
        if (Handlebars.helpers[arg]) {
            value = Handlebars.helpers[arg].apply(this, dyn_args);
            dyn_args = [value];
        }
        else {
            dyn_args.push(arg);
        }
    });
    return value;
});

//var invoice = SalesInvoices.findOne( { key: "87104"});
var invoice = SalesInvoices.findOne();
//console.log(invoice);
//Pdf.getInvoice(invoice, 3); 
