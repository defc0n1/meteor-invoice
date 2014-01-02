Template.table.rendered = function () {
    var type = Session.get('type');
    var doit = false
    if (type.new) {
        doit = true
        type = type.background;
        Session.set('type', type);
    }
    Session.set('modalFields', type.modalFields);
    var col = type.subCollection || type.collection 
    Session.setDefault(col + 'skip', 0);
    if (doit) {
        Session.set('selected', {});
        $('#myModal').modal({});
    }
    $('.table-tooltip').tooltip();
}

Template.table.created = function () {
}
Template.table.items = function () {
    var type = Session.get('type');
    return window[type.collection].find(type.filter || {}, { sort: { key: -1 }}); // .fetch();
};

changePage = function (count) {
    var collection = Session.get('type').subCollection || Session.get('type').collection;
    Session.set(collection + 'skip',
            Session.get(collection + 'skip') + count);
}
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
    'click .link': function(event) {
        var type = Session.get('type');
        
        if ( type.collection == 'CreditorEntries' ) {
            event.preventDefault();
            
            var elem = this.elem;
            Meteor.call('getInvoiceKeyByRecordNumber', elem.record_number, function (err, result) {
                Router.go('show', { type: type.views[elem.type], key: result.key  });
            });
        }
    },
    'click .show-button': function(event) {
        var type = Session.get('type');
        Router.go('show', { type: type.singleView, key: this.elem.key  });
    },
    'click .delete-button': function(event) {
        var id = this.elem._id;
        bootbox.confirm('Vil du slette denne faktura?', function (res) {
            if (res) {
                window[Session.get('type').collection].remove({ _id: id });
                DoCount();
            }
        });

    },
    'click .edit-button': function(event) {
        var type = Session.get('type');
        Router.go('edit', { type: Router.current().params.type, key: this.elem.key  });
    },
    //'click .modal-edit tbody>tr': function(event) {
        //Session.set('selected', this);
        //$('#myModal').modal({});
    //},
    'click .show-deptor-button': function(event) {
        Session.set('selected', this.elem);
        $('#myModal').modal({});
    },
    'click .show-creditor-button': function(event) {
        Session.set('selected', this.elem);
        $('#myModal').modal({});
    },
    'click .show-item-button': function(event) {
        Session.set('selected', this.elem);
        Session.set('showModal', true);
        $('#myModal').modal({});
    },
    'click .item-statistics-button': function (event) {
        Session.set('element', this);
        var stats = Meteor.call('getItemStats', this.elem.key, function (err, res) {
            Session.set('stats', res);
            $('#itemstats').modal({});
        });
    },
    'click .creditor-statistics-button': function (event) {
        Session.set('element', this);
        var stats = Meteor.call('getCreditorStats', this.elem.key, function (err, res) {
            Session.set('stats', res);
            $('#itemstats').modal({});
        });
    },
    'click .deptor-statistics-button': function (event) {
        Session.set('element', this);
        log.error('test');
        var stats = Meteor.call('getDeptorStats', this.elem.key, function (err, res) {
            Session.set('stats', res);
            $('#itemstats').modal({});
        });
    },
    'click #next-page': function(event) {
        changePage(incrementSize);
    },
    'click #previous-page': function(event) {
        changePage(-incrementSize);
    },
});

//return true if element is processing
var processing = function (element, type) {
    var sent = element.sent && (element.sent[type] !== undefined);
    return sent && element.sent[type].state === 'processing';

};
Template.table.helpers({
    showModal: Session.get('showModal'),
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
    },
    showPrevious: function() {
        var type = Session.get('type');
        var collection = type.subCollection || type.collection;
        var disable = Session.equals(collection + 'skip', 0);
        return disable ? 'disabled' : '';
    },
    showNext: function() {
        var type = Session.get('type');
        var collection = type.subCollection || type.collection;
        var disable = Session.get(collection + 'skip') + incrementSize >= Session.get(collection + 'itemCount');
        return disable ? 'disabled' : '';
    },
});
