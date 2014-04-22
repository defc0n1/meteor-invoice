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
            var selected = GetCurrentCollection().findOne({ key: Router.current().params.key });
            var dataIndex = $(this).attr('data-index');
            var dataKey = $(this).attr('data-key');
            if (dataIndex) {
                var newList = selected[dataKey] || [];
                if (dataIndex == -1) {
                    newList.push(newValue);
                    var reset = true;
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
            UpdateCollection(GetCurrentCollection(), selected._id, update) 
            // we might need to run the update sync, as editable expects the error to be returned
            if(reset){
                return {newValue: null};
            }
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
    var element = GetCurrentCollection().findOne({ key: Router.current().params.key });
    //guard against non existing route
    if (!element) return; 
    Session.set('viewTitle', 'Redigerer ' + element.key);
};
Template.editelement.helpers({
    fields: function (element) {
        var element = GetCurrentCollection().findOne({ key: Router.current().params.key });
        //guard against non existing route
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
        var selected = GetCurrentCollection().findOne({ key: Router.current().params.key });
        console.log(this);
        var key = this.key;
        var list = selected[key];
        list.splice(this.index, 1);
        var update = {};
        update[key] = list;
        UpdateCollection(GetCurrentCollection(), selected._id, update) 
    },
    'change .gln-group-select': function(event) {
        var gln_group = event.target.value;
        var element = GetCurrentCollection().findOne({ key: Router.current().params.key });
        if (gln_group) {
            UpdateCollection(GetCurrentCollection(), element._id, {gln_group: gln_group}) 
        }
        else{
            var res = GetCurrentCollection().update({ _id: element._id }, { $unset: { gln_group: "" } },
                function (err, msg) {
                }
            );
        }
    }
});

