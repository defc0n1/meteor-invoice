Template.modalInner.events({
    'click .editable-submit .modal-edit-field': function(event) {
        console.log(this, event);
    },
    'click .close': function (event) {
        Messages.remove({ _id: this._id });
    }
});
Template.modalInner.helpers({
    element: function () {
        return Session.get('selected'); // .fetch();
    },
    fields: function (element) {
        // don't run  element has been clicked
        if (!element) return [];
        var list = Session.get('modalFields');
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
    $('.modal-edit-field').editable({
        success: function(response, newValue) {
            var update = {};
            var field = $(this).attr('id');

            if (field === 'key') {
                Messages.insert({ message: 'Nøglen kan ikke ændres på nuværende tidspunkt.' });
                return;
            }
            update[field] = newValue;
            var selected = Session.get('selected');
            var res = Deptors.update({ _id: selected._id }, { $set: update }, function (err, msg) {
                console.log(err, msg);
                if (err) {
                    var selector = '#' + field;
                    $(selector).editable('setValue', selected[field] , true);
                    Messages.insert({ message: 'Nøgle eksisterer allerede' });
                }
            });
            //return 'test2';
        },
        error: function(msg) {
            return msg;
        }
    });
};
