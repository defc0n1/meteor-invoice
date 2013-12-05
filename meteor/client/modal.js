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
    //console.log(this);
    $.fn.editable.defaults.mode = 'inline';

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
            //var res = Deptors.update({ _id: selected._id }, { $set: update }, function (err, msg) {
                //console.log(err, msg);
                //if (err) {
                    //var selector = '#' + field;
                    //$(selector).editable('setValue', selected[field] , true);
                    //Messages.insert({ message: 'Nøgle eksisterer allerede' });
                //}
            //});
            //return 'test2';
        },
        display: function (value) {

            var formatter = $(this).attr('data-formatter');
            if (formatter) {
                var func = window[formatter];
                $(this).html(func(value));
            }
        },
        error: function(msg) {
            return msg;
        }
    });
};
