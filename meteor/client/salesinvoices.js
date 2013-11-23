

Template.postedSalesinvoices.created = function () {
    RenderList('salesinvoices');
    var list = [
    { name: 'Nummer', key: 'key'},
    { name: 'Navn', key: 'name'},
    { name: 'Email', key: 'email'},
    { name: 'Telefon', key: 'phone'},
    { name: 'Fax', key: 'fax'},
    { name: 'Adresse', key: 'address'},
    { name: 'By', key: 'city'},
    { name: 'Postnummer', key: 'zip'},
    { name: 'Att.', key: 'attention'},
    ];
    Session.set('modalFields', list);
}
Template.postedSalesinvoices.rendered = function () {
};

Template.postedSalesinvoices.items = function () {
    return SalesInvoices.find({}, { sort: { key: -1 }}); // .fetch();
};

Template.postedSalesinvoices.events({
    'click .edi-button': function(event) {
        // if already sent, we ask if user would like to resend
        var sent = this.sent && this.sent.amqp && this.sent.amqp.state === 'success';
        if (sent) {
            var message = 'Denne faktura blev sendt d. ' +
                moment(this.sent.amqp.date).format('DD MMM YYYY') +
                ' via AMQP.\n Vil du gensende fakturaen?';

            var element = this;
            bootbox.confirm(message, function (res) {
                if (res) {
                    Meteor.call('sendAmqp', element.key);
                }
            });
        }
        else {
            Meteor.call('sendAmqp', this.key);
        }
    },
    'click .email-button': function(event) {
        // if already sent, we ask if user would like to resend
        var sent = this.sent && this.sent.mail && this.sent.mail.state === 'success';
        if (sent) {
            var message = 'Denne faktura blev sendt d. ' +
                moment(this.sent.mail.date).format('DD MMM YYYY') +
                ' via e-mail.\n Vil du gensende fakturaen?';

            var element = this;
            bootbox.confirm(message, function (res) {
                res && Meteor.call('sendEmail', element._id.valueOf(), function (err, res) {
                    err && bootbox.alert(err);
                });
            });
        }
        else {
            Meteor.call('sendEmail', this._id.valueOf(), function (err, res) {
               err && bootbox.alert(err);
            });
        }
    },
    'click .show-button': function(event) {
        Router.go('show', { type: 'postedSalesinvoice', key: this._id.valueOf()  });
    },
});

//return true if element is processing
var processing = function (element, type) {
    var sent = element.sent && (element.sent[type] !== undefined);
    return sent && element.sent[type].state === 'processing'

}
Template.postedSalesinvoices.helpers({
    getDate: function(date) {
        return moment(date).format('DD MMM YYYY'); // + ' - ' + moment(date).fromNow();
    },
    sentBy: function(type) {
        if (!this.sent || !this.sent[type] || this.sent[type].state === 'processing')
            return '';
        // green if success, otherwise, must be error state
        return this.sent[type].state === 'success' ? 'btn-success' : 'btn-danger';
    },
    processing: function(type) {
        var state = processing(this, type) ? 'disabled'  : '';
        //if (sent && state !== 'disabled' && Session.get(type)) {
            //Session.set(type, null);
        //}
        return state;
    },
    showSpinner: function () {
        var isProcessing = processing(this, 'mail') || processing(this, 'amqp');
        return isProcessing ? 'display: inherit' : 'display:none';
    }
});
