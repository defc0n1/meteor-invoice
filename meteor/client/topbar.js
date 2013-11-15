"use strict";
Template.topbar.events({
    'keyup #search-query': function(event) {
        console.log(event);
        Session.set('query', event.target.value);
        Session.set('skip', 0);
        UpdateCount();
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
        { name: 'Salg', path: Router.routes['sale'].path({ type: 'postedSalesinvoices' }) },
        { name: 'Køb', path: Router.routes['sale'].path({ type: '' }) },
        { name: 'Kontaker', path: Router.routes['contacts'].path({ type: 'deptors' }) },
        { name: 'Varer', path: Router.routes['items'].path({ type: '' }) },
        { name: 'Statistik', path: Router.routes['sale'].path({ type: '' }) },
        { name: 'Bogføring', path: Router.routes['sale'].path({ type: '' }) },
    ];
    var path = Router.current().path;
    items = _.map(items, function (item) {
        item.active = path == item.path ? 'active' : '';
        return item;
    });
    return items;
};
