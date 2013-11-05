// setup

var SalesInvoices = new Meteor.Collection('salesinvoices');
var incrementSize = 10;
Session.set('limit', 10);
Session.set('skip', 0);
Meteor.call('salesInvoiceCount', function(err, result) {
    console.log(err, result);
    Session.set('salesInvoiceCount', result);
});


Deps.autorun(function() {
    Meteor.subscribe('invchannel', Session.get('limit'), Session.get('skip'), Session.get('query'));
});

Template.salesinvoices.items = function () {
    //return [ 1,2,3,4];
    //return log(SalesInvoices.findOne())
    //
    return SalesInvoices.find({}, { sort: { _id: -1 }}); // .fetch();

};

Template.salesinvoices.events({
    'keyup #search-query': function(event) {
        Session.set('query', event.target.value);
        Session.set('skip', 0);
    },
    'click #next-page': function(event) {
        Session.set('skip', Session.get('skip') + incrementSize);
    },
    'click #previous-page': function(event) {
        console.log('dect');
        Session.set('skip', Session.get('skip') - incrementSize);
    },
    'click .edi-button': function(event) {
        // if already sent, we ask if user would like to resend
        var do_send = this.sent === undefined;

        if (!do_send) {
            var message = 'Denne faktura blev sendt d. ' +
                moment(this.sent.date).format('DD MMM YYYY') +
                ' via ' + this.sent.type + '\n Vil du gensende fakturaen?';
            if (confirm(message)) {
                do_send = true;
            }
        }
        if (do_send) {

            Meteor.call('sendAmqp', this._id, function(err, result) {
                console.log(err, result);
            });
        }
    },
    'click .email-button': function(event) {
        // if already sent, we ask if user would like to resend
        var do_send = this.sent === undefined;

        if (!do_send) {
            var message = 'Denne faktura blev sendt d. ' +
                moment(this.sent.date).format('DD MMM YYYY') +
                ' via ' + this.sent.type + '\n Vil du gensende fakturaen?';
            if (confirm(message)) {
                do_send = true;
            }
        }
        if (do_send) {
            Meteor.call('sendEmail', this._id, function(err, result) {
                console.log(err, result);
            });
        }
    }
});

Template.salesinvoices.helpers({
    showPrevious: function() {
        var disable = Session.equals('skip', 0);
        return disable ? 'disabled' : '';
    },
    showNext: function() {
        var disable = Session.get('skip') + incrementSize >= Session.get('salesInvoiceCount')
        return disable ? 'disabled' : '';
    },
    getDate: function(date) {
        return moment(date).format('DD MMM YYYY') + ' - ' + moment(date).fromNow();
    },
    sentBy: function(type) {
        if (!this.sent || !this.sent[type] || this.sent[type].state === 'processing')
            return '';
        // green if success, otherwise, must be error state
        return this.sent[type].state === 'success' ? 'btn-success' : 'btn-danger';
    },
    processing: function(type) {
        var sent = this.sent && (this.sent[type] !== undefined) ;
        var state = sent && this.sent[type].state === 'processing' ? ''  : 'none';
        return state;
    },
    countText: function(date) {
        var start = Session.get('skip') + 1;
        return 'Viser ' + start + ' til ' +
                (start + incrementSize - 1) +
                ' af ' + Session.get('salesInvoiceCount');
    }
});
