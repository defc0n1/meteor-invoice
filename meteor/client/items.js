"use strict"

Template.items.created = function () {
    RenderList('items');
    var list = [
    { name: 'Nummer', key: 'key' },
    { name: 'Navn', key: 'name'},
    { name: 'Gruppe', key: 'group'},
    { name: 'Kostpris', key: 'cost_price', formatter: 'GetPrice' },
    { name: 'Salgspris', key: 'price', formatter: 'GetPrice' },
    { name: 'Salgspris 1', key: 'price_1', formatter: 'GetPrice' },
    { name: 'Salgspris 2', key: 'price_2', formatter: 'GetPrice' },
    { name: 'Salgspris 3', key: 'price_3', formatter: 'GetPrice' },
    { name: 'Salgspris 4', key: 'price_4', formatter: 'GetPrice' },
    { name: 'Inderkolli', key: 'inner_box'},
    { name: 'Yderkolli', key: 'outer_box'},
    { name: 'EAN', key: 'ean'},
    { name: 'Beholdning', key: 'quantity'},
    ];
    Session.set('modalFields', list);
};

Template.items.items = function () {
    return Items.find({}, { sort: { key: -1 }}); // .fetch();
};
Template.items.events({
    'click .btn-show': function (event) {
        Session.set('selected', this);
        $('#myModal').modal({});
    },
    'click .btn-statistic': function (event) {
        Session.set('element', this);
        var stats = Meteor.call('getItemStats', this.key, function (err, res) {
            Session.set('stats', res);
            log.info(res);
            $('#itemstats').modal({});
        });
    },
});
