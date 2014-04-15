Template.table.rendered = function () {
    var type = Session.get('type');
    if(type.filter) {
        SetFilter(type.filter, true);
    }
    Session.set('modalFields', type.modalFields);
    Session.setDefault(type.collection + 'skip', 0);
    $('.table-tooltip').tooltip();
};

Template.table.created = function () {
};
Template.table.items = function () {
    var type = Session.get('type');
    return window[type.collection].find({}, { sort: { key: -1 }});
};

changePage = function (count) {
    var collection = Session.get('type').collection;
    Session.set(collection + 'skip',
            Session.get(collection + 'skip') + count);
};
Template.table.events({
    'click .edi-button': function(event) {
        var message = '';
        // if already sent, we ask if user would like to resend
        var sent = this.elem.sent && this.elem.sent.amqp && this.elem.sent.amqp.state === 'success';
        if (sent) {
            message = 'Denne faktura blev sendt d. ' +
                moment(this.elem.sent.amqp.time).format('DD MMM YYYY') +
                ' via AMQP.\n Vil du gensende fakturaen?';

        }
        else{
            message = 'Vil du sende denne faktura med Edi?';
        }
        var element = this.elem;
        bootbox.confirm(message, function (res) {
            if (res) {
                Meteor.call('sendAmqp', element.key);
            }
        });
    },
    'click .email-button': function(event, temp) {
        // if already sent, we ask if user would like to resend
        var sent = this.elem.sent && this.elem.sent.mail && this.elem.sent.mail.state === 'success';
        if (sent) {
            var message = 'Denne faktura blev sendt d. ' +
                moment(this.elem.sent.mail.time).format('DD MMM YYYY') +
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

        if (type.collection == 'CreditorEntries') {
            event.preventDefault();

            var elem = this.elem;
            var view = type.views[elem.type];

            Meteor.call(view.method, elem.record_number, function (err, result) {
                Router.go('show', { type: view.path, key: result.key  });
            });
        }
    },
    'click .goto-dropdown li': function (event) {
        event.preventDefault();
        console.log(this);
        //Router.go('dynamic', { type: this.mapping, key: this.elem.key });
        if (this.mapping === 'deptorEntries') {
            SetFilter({ customer_number: this.elem.customer_number });
            Session.set('viewTitle', 'Debitorposter: ' + this.elem.customer_number);
            Router.go('dynamic', { type: this.mapping, key: this.elem.customer_number });
        } else if ( this.mapping === 'itemEntries') {
            //SetFilter({ customer_number: this.params.key });
            var that = this;
            Meteor.call('getItemEntries', this.elem.customer_number, function (err, res) {
                res.forEach(function (elem) {
                    ItemEntries.insert(elem);
                });
                Router.go('dynamic', { type: that.mapping, key: that.elem.customer_number });
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
    'click .table-edit-element-button': function(event) {
        Router.go('edit2', { type: GetCurrentType() , key: this.elem.key });
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
    'click #first-page': function(event) {
        var collection = Session.get('type').collection;
        Session.set(collection + 'skip', 0);
    },
    'click #last-page': function(event) {
        var collection = Session.get('type').collection;
        var size = CollectionCounts.findOne(GetCurrentMappingName()).count
        var offset = 0;
        if (size % incrementSize == 0) {
            offset = -1
        }
        var skip = (parseInt(size/incrementSize) + offset) * 10
        Session.set(collection + 'skip', skip);
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
        var state = processing(this.elem, type) ? 'disabled'  : '';
        return state;
    },
    showSpinner: function () {
        var isProcessing = processing(this, 'mail') || processing(this, 'amqp');
        return isProcessing ? 'display: inherit' : 'display:none';
    },
    showBack: function() {
        var type = Session.get('type');
        var collection = type.collection;
        var disable = Session.equals(collection + 'skip', 0) || Session.equals(collection + 'skip', null);
        return disable ? 'disabled' : '';
    },
    showForward: function() {
        var type = Session.get('type');
        var collection = type.collection;
        var obj = CollectionCounts.findOne(GetCurrentMappingName());
        if (obj) {
            var disable = Session.get(collection + 'skip') + incrementSize >= obj.count;
            return disable ? 'disabled' : '';
        }
        else {
            return false;
        }
    },
});
