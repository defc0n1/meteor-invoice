Wkhtmltopdf = Meteor.require('wkhtmltopdf');
Nodemailer = Meteor.require('nodemailer');
UUID = Meteor.require('node-uuid');
Future = Meteor.require('fibers/future');
Fiber = Meteor.require('fibers');
util = Meteor.require('util');

Meteor.startup(function () {
    log.debug(Meteor.settings);
    amqp.connect();
});
