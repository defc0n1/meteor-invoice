Wkhtmltopdf = Meteor.require('wkhtmltopdf');
Nodemailer = Meteor.require('nodemailer');
UUID = Meteor.require('node-uuid');
Future = Meteor.require('fibers/future');
Fiber = Meteor.require('fibers');
util = Meteor.require('util');

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
    log.debug(Meteor.settings);
    amqp.connect();
});
