channel = undefined;

Handlebars = Meteor.require('handlebars');
Wkhtmltopdf = Meteor.require('wkhtmltopdf');
Nodemailer = Meteor.require('nodemailer');
Future = Npm.require('fibers/future');

Meteor.startup(function () {

    console.log(Meteor.settings)
    var amqp = Meteor.require('amqplib');
    //amqp.connect().then(function(conn) {
    amqp.connect(Meteor.settings.amqp_host).then(function(conn) {
        process.once('SIGINT', conn.close.bind(conn));
        var ok = conn.createChannel();
        console.log('Amqp connection created');
        ok.then(function (ch) {
            channel = ch;
            console.log('Amqp channel created');
        });
    });
});

