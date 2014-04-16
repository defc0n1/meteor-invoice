Template.editelementedit.rendered = function () {
    $.fn.editable.defaults.mode = 'inline';
    // auto move to the next editable when user clicks enter
    $('.edit-field').on('hidden', function (e, reason) {
        if (reason === 'save' || reason === 'nochange') {
            var match = $(this).closest('tr').next().find('.editable');
            if (match.length === 1) {
                match.editable('show');
                return;
            }
        }
    });
    //initialize the editable fields and update the element on edit
    this.$('.edit-field:not(.editable-click)').editable('destroy').editable({
        emptytext: 'Indtast værdi',
        success: function(response, newValue) {
            console.log($(this), this);
            var update = {};
            var field = $(this).attr('id');

            if (field === 'key') {
                Messages.insert({ message: 'Nøglen kan ikke ændres på nuværende tidspunkt.' });
                return;
            }
            var selected = Session.get('element');
            var dataIndex = $(this).attr('data-index');
            var forceReload = false;
            var dataKey = $(this).attr('data-key');
            if (dataIndex) {
                var newList = selected[dataKey] || [];
                if (dataIndex == -1) {
                    newList.push(newValue);
                    forceReload = true;
                }
                else{
                    newList.splice(dataIndex, 1, newValue);
                }
                newList = _.uniq(newList);
                update[dataKey] = newList;
            } else {
                update[dataKey] = newValue;
            }
            console.log(update)
            var res = GetCurrentCollection().update({ _id: selected._id }, { $set: update }, function (err, msg) {
                console.log(err, msg);
                if (err) {
                    console.log(err);
                    //var selector = '#' + field;
                    //$(selector).editable('setValue', selected[field] , true);
                    //Messages.insert({ message: 'Nøgle eksisterer allerede' });
                }
                if (forceReload){$('#main-content').html(Meteor.render(Template.editelement));}

            });
            // we might need to run the update sync, as editable expects the error to be returned
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
}
Template.editelement.rendered = function () {


    var elem = GetCurrentCollection().findOne({ key: Router.current().params.key });

    //TODO guard against non existing route

    Session.set('element', elem);
    Session.set('viewTitle', 'Redigerer ' + elem.key);

    // We attach an observed handler and update the
    // editable value on change
    var query = GetCurrentCollection().find({ _id: elem._id });
    var handle = query.observeChanges({
        changed: function (id, fields) {
            _.each(fields, function (v, k) {
                if ( _.isArray(v)) {
                    $('#main-content').html(Meteor.render(Template.editelement));
                }
                else {
                    $('#' + k).editable('setValue', v);
                }
            });
        }
    });


};
Template.editelement.helpers({
    fields: function (element) {
        // this may be called before session.element is set
        // thus we guard against undefined element
        var element = Session.get('element');
        if (!element) return [];
        var list = GetCurrentMapping().modalFields;
        list = _.map(list, function (elem) {
            elem['value'] = element[elem.key];
            return elem;
        });
        return list;
    },
});

Template.editelement.events({
    'click .remove-list-item': function(event) {
        var selected = Session.get('element');
        var key = this.elem.key;
        var list = selected[key];
        list.splice(this.index, 1);
        var update = {};
        update[key] = list;
        GetCurrentCollection().update({ _id: selected._id }, { $set: update }, function (err, msg) {
            console.log(err, msg);
            if (err) {
                console.log(err);
                //var selector = '#' + field;
                //$(selector).editable('setValue', selected[field] , true);
                //Messages.insert({ message: 'Nøgle eksisterer allerede' });
            }
        });
        $('#main-content').html(Meteor.render(Template.editelement));
    },
    'change .gln-group-select': function(event) {
        var gln_group = event.target.value;
        console.log(gln_group)
        var element = Session.get('element');
        if (gln_group) {
            var res = GetCurrentCollection().update({ _id: element._id }, { $set: { gln_group: gln_group } },
                function (err, msg) {
                    console.log(err, msg)
                }
            );
        }
        else{
            var res = GetCurrentCollection().update({ _id: element._id }, { $unset: { gln_group: "" } },
                function (err, msg) {
                }
            );
        }
    }
});
