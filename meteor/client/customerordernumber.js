var filter = Mapping.postedSalesinvoices.filter
filter.$and.push({ $or: [{customer_order_number: ''}, {customer_order_number: { $exists: 0 }}]})
Template.customerordernumber.rendered = function () {
    Session.set('type', Mapping.postedSalesinvoices);
    Session.set('Salefilter', filter);
};
Template.customerordernumber.helpers({
    items: Sale.find(filter)
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
