"use strict"

Template.deptors.created = function () {
    RenderList('deptors');
    var list = [
    { name: 'Nummer', key: 'key'},
    { name: 'Navn', key: 'name'},
    { name: 'Email', key: 'email'},
    { name: 'Telefon', key: 'phone'},
    { name: 'Fax', key: 'fax'},
    { name: 'Adresse', key: 'address'},
    { name: 'By', key: 'city'},
    { name: 'Postnummer', key: 'zip'},
    { name: 'Att.', key: 'attention'},
    ];
    Session.set('modalFields', list);
};

Template.deptors.items = function () {
    return Deptors.find({}, { sort: { key: -1 }}); // .fetch();
};
Template.deptors.events({
    'keyup #search-query': function(event) {
        Session.set('query', event.target.value);
        Session.set('skip', 0);
    },
    'click .deptors tbody>tr': function(event) {
        Session.set('selected', this);
        $('#myModal').modal({});
    },
    'click #editable-submit': function(event) {
        console.log(this);
    },
});

Template.deptors.helpers({
});
