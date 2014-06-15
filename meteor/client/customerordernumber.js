'use strict'
Template.customerordernumber.rendered = function () {
    Session.set('type', Mapping.postedSalesinvoices);
};
Template.customerordernumber.helpers({
    items: Sale.find()
});
Template.customerordernumberrow.rendered = function() {
    $.fn.editable.defaults.mode = 'inline';
    this.$('.edit-field:not(.editable-click)').editable('destroy').editable({
        emptytext: 'Indtast værdi',
        success: function(response, newValue) {
            var update = {};
            var id = $(this).attr('data-id');

            update = {customer_order_number: newValue};
            console.log(update, id);
            UpdateCollection(Sale, id, update);
        },
    });
};
