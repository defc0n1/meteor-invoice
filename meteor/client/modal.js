Template.modal.events({
    'keyup': function (event) {
        // manually close modal on esc in case we are not editing
        event.keyCode === 27 && !Session.get('modal_prevent_close') && $('#myModal').modal('hide');
    },
});
Template.modalInner.events({
    'click .editable-submit .modal-edit-field': function(event) {
    },
    'click .close': function (event) {
        Messages.remove({ _id: this._id });
    },
});
Template.modalInner.helpers({
    element: function () {
        return Session.get('selected'); // .fetch();
    },
    fields: function (element) {
        // don't run  element has been clicked
        if (!element) return [];
        var list = Session.get('type').modalFields;
        list = _.map(list, function (elem) {
            elem['value'] = element[elem.key];
            return elem;
        });
        return list;
    },
    messages: function () {
        return Messages.find().fetch();
        return [{ message: 'test'}]
        //Messages.find(); // .fetch();
    }
});

Template.modalInner.rendered = function () {

    $.fn.editable.defaults.mode = 'inline';

    var selected = Session.get('selected');
    if (selected) {
        // when the selected item is defined, we attach an observed handler and update the
        // editable value on change
        var query = Items.find({ _id: selected._id });
        var handle = query.observeChanges({
            changed: function (id, fields) {
                _.each(fields, function (v, k) {
                    $('#' + k).editable('setValue', v);
                    console.log(k, v);
                });
            }
        });
    }

    // disable esc-close-modal when an editable is active
    $('.modal-edit-field').on('hidden', function (e, reason) {
        if (reason === 'save' || reason === 'nochange') {
            var match = $(this).closest('tr').next().find('.editable');
            if (match.length === 1) {
                match.editable('show');
                return;
            }
        }
        // set focus back to modal to make it closable
        // in case we did not open a new editable
        Session.set('modal_prevent_close', false);
        $('#myModal').focus();
    });
    $('.modal-edit-field').on('shown', function (e, reason) {
        Session.set('modal_prevent_close', true);
    });

    $('.modal-edit-field').editable({
        emptytext: 'Indtast værdi',
        success: function(response, newValue) {
            var update = {};
            var field = $(this).attr('id');

            if (field === 'key') {
                Messages.insert({ message: 'Nøglen kan ikke ændres på nuværende tidspunkt.' });
                return;
            }
            update[field] = newValue;
            var selected = Session.get('selected');
            console.log(selected, newValue, response);
            var res = Items.update({ _id: selected._id }, { $set: update }, function (err, msg) {
                console.log(err, msg);
                if (err) {
                    console.log(err);
                    //var selector = '#' + field;
                    //$(selector).editable('setValue', selected[field] , true);
                    //Messages.insert({ message: 'Nøgle eksisterer allerede' });
                }
            });
            //we might need to run the update sync, as editable expects the error to be returned
        },
        display: function (value) {

            var formatter = $(this).attr('data-formatter');
            // call the formatter function if defined
            if (formatter) {
                var func = window[formatter];
                $(this).html(func(value));
            }
            //ootherwise, just insert the new value
            else{
                $(this).html(value);
            }
        },
    });
};
