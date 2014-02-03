Template.editelement.rendered = function () {

    $.fn.editable.defaults.mode = 'inline';

    var elem = GetCurrentCollection().findOne({ key: Router.current().params.key });

    //TODO guard against non existing route
    
    Session.set('element', elem);
    Session.set('viewTitle', 'Redigerer ' + elem.key);
    
    // We attach an observed handler and update the
    // editable value on change
    var query = Items.find({ _id: elem._id });
    var handle = query.observeChanges({
        changed: function (id, fields) {
            _.each(fields, function (v, k) {
                $('#' + k).editable('setValue', v);
                console.log(k, v);
            });
        }
    });

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
    $('.edit-field').editable({
        emptytext: 'Indtast værdi',
        success: function(response, newValue) {
            var update = {};
            var field = $(this).attr('id');

            if (field === 'key') {
                Messages.insert({ message: 'Nøglen kan ikke ændres på nuværende tidspunkt.' });
                return;
            }
            update[field] = newValue;
            var selected = Session.get('element');
            console.log(selected, newValue, response);
            var res = GetCurrentCollection().update({ _id: selected._id }, { $set: update }, function (err, msg) {
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
}
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
})
