Template.table.rendered = function () {
    var type = Session.get('type');
    UpdateCount(type.collection);
    Session.set('modalFields', type.modalFields);
    UpdateCount(type.collection);
}

Template.table.created = function () {
    Session.set('skip', 0);
}
Template.table.items = function () {
    var type = Session.get('type');
    return window[type.collection].find({}, { sort: { key: -1 }}); // .fetch();
};

Template.table.events({
    'click .edi-button': function(event) {
        // if already sent, we ask if user would like to resend
        var sent = this.elem.sent && this.elem.sent.amqp && this.elem.sent.amqp.state === 'success';
        if (sent) {
            var message = 'Denne faktura blev sendt d. ' +
                moment(this.elem.sent.amqp.date).format('DD MMM YYYY') +
                ' via AMQP.\n Vil du gensende fakturaen?';

            var element = this.elem;
            bootbox.confirm(message, function (res) {
                if (res) {
                    Meteor.call('sendAmqp', element.key);
                }
            });
        }
        else {
            Meteor.call('sendAmqp', this.elem.key);
        }
    },
    'click .email-button': function(event, temp) {
        // if already sent, we ask if user would like to resend
        var sent = this.elem.sent && this.elem.sent.mail && this.elem.sent.mail.state === 'success';
        if (sent) {
            var message = 'Denne faktura blev sendt d. ' +
                moment(this.elem.sent.mail.date).format('DD MMM YYYY') +
                ' via e-mail.\n Vil du gensende fakturaen?';

            var element = this.elem;
            bootbox.confirm(message, function (res) {
                res && Meteor.call('sendEmail', element._id.valueOf(), function (err, res) {
                    err && bootbox.alert(err);
                });
            });
        }
        else {
            Meteor.call('sendEmail', this.elem._id.valueOf(), function (err, res) {
               err && bootbox.alert(err);
            });
        }
    },
    'click .show-button': function(event) {
        var type = Session.get('type');
        Router.go('show', { type: type.singleView , key: this.elem._id.valueOf()  });
    },
    'click .modal-edit tbody>tr': function(event) {
        Session.set('selected', this);
        $('#myModal').modal({});
    },
    'click .show-item-button': function(event) {
        Session.set('selected', this);
        $('#myModal').modal({});
    },
    'click .statistics-button': function (event) {
        Session.set('element', this);
        var stats = Meteor.call('getItemStats', this.key, function (err, res) {
            Session.set('stats', res);
            log.info(res);
            $('#itemstats').modal({});
        });
    },
});

//return true if element is processing
var processing = function (element, type) {
    var sent = element.sent && (element.sent[type] !== undefined);
    return sent && element.sent[type].state === 'processing';

}
Template.table.helpers({
    sentBy: function(type) {
        if (!this.elem.sent || !this.elem.sent[type] || this.elem.sent[type].state === 'processing')
            return '';
        // green if success, otherwise, must be error state
        return this.elem.sent[type].state === 'success' ? 'btn-success' : 'btn-danger';
    },
    processing: function (type) {
        //speical case for edi invoices, only show if field is defined
        if (type === 'amqp' && !this.elem.customer_order_number) {
            return 'disabled';
        }
        var state = processing(this.elem, type) ? 'disabled'  : '';
        return state;
    },
    showSpinner: function () {
        var isProcessing = processing(this, 'mail') || processing(this, 'amqp');
        return isProcessing ? 'display: inherit' : 'display:none';
    }
});
