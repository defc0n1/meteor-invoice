"use strict";
Template.topbar.events({
    'keyup #search-query': function(event) {
        var type = Session.get('type');
        Session.set(type.collection + 'query', event.target.value);
        Session.set(type.collection + 'skip', 0);
    },
    'click #logout': function () {
        Meteor.logout();
    }
});

Template.topbar.isSelected = function (route) {
    console.log(Router.current());
    console.log(route);
    var current = Router.current();
    if (!current) return '';

    return current.template === route ? 'active' : '';

};

Template.topbar.items = function () {
    var items = [
        { name: 'Salg', path: Router.routes['main'].path({ root: 'sale', type: 'postedSalesinvoices' }) },
        { name: 'Køb', path: Router.routes['main'].path({ root: 'purchase', type: 'postedPurchaseinvoices' }) },
        { name: 'Kontaker', path: Router.routes['main'].path({ root: 'contacts', type: 'deptors' }) },
        { name: 'Varer', path: Router.routes['main'].path({ root: 'items', type: 'items' }) },
        { name: 'Posteringer', path: Router.routes['main'].path({ root: 'entries', type: 'entries' }) },
        //{ name: 'Statistik', path: Router.routes['sale'].path({ type: '' }) },
        //{ name: 'Bogføring', path: Router.routes['sale'].path({ type: '' }) },
    ];
    var path = Router.current().path;
    items = _.map(items, function (item) {
        item.active = path.split('/')[1] == item.path.split('/')[1] ? 'active' : '';
        return item;
    });
    return items;
};
