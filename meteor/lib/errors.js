errors = {
    missingMail: { code: 201, msg: 'Ingen emailadresse på debitor' },
    pdfConversion: { code: 202, msg: 'Fejl ved pdf generering' },
    mailSend: { code: 203, msg: 'Fejl ved afsendelse af mail' },
    recipients: { code: 204, msg: 'Modtager ugyldig' },
    unknown: { code: 600, msg: 'Ukendt fejl' },
    sync: function (err, msg, log) {
        log && log(err, msg);
        throw new Meteor.Error(err.code, err.msg + ' ' +  msg);
    },
    async: function (err, msg, log) {
        log && log(err, msg);
        Alerts.insert({ code: err.code, message: err.msg + ' ' +  msg});
    },
};

