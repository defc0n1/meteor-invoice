Template.quickglneditfield.events({
    'click .copy-ean': function(event){
        Items.update({_id: this._id}, {$set: {gln_number: this.ean}}, function (err, msg) {
            console.log(err, msg);
            if (err) {
                console.log(err);
                //var selector = '#' + field;
                //$(selector).editable('setValue', selected[field] , true);
                //Messages.insert({ message: 'Nøgle eksisterer allerede' });
            }
        });
    }
});
Template.quickglneditfield.rendered = function() {
    $.fn.editable.defaults.mode = 'inline';
    this.$('.edit-field:not(.editable-click)').editable('destroy').editable({
        emptytext: 'Indtast værdi',
        success: function(response, newValue) {
            console.log($(this), this);
            var update = {};
            var id = $(this).attr('data-id');
            var forceReload = false;

            update = {gln_number: newValue};
            console.log(update, id)
            Items.update({_id: new Meteor.Collection.ObjectID(id)}, {$set: update}, function (err, msg) {
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
    });
};
Template.quickgln.helpers({
    items: function() {
        return Items.find({ $or: [{gln_number: ''}, {gln_number: { $exists: 0 }}]});
    }
});
