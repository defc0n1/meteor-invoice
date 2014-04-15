Mail = {

    invoice:{
        sender: 'tradehouse@tradehouse.as',
        subject: 'Faktura 123',
        body: 'Din faktura er vedhæftet som pdf fil.\nVenlig hilsen Tradehouse Denmark ApS',
    },
    getTransport: function() {
        return transport = Nodemailer.createTransport('SMTP', {
            auth: {
                pass: Meteor.settings.smtp_pass,
                user: Meteor.settings.smtp_user
            },
            port: 587,
            host: Meteor.settings.smtp_host,
            //secureConnection: 'true'
        });
    },
}
