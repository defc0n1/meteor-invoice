"use strict"

Template.creditors.created = function () {
    RenderList('creditors');
    var list = [
    { name: 'Nummer', key: 'key'},
    { name: 'Navn', key: 'name'},
    { name: 'Email', key: 'email'},
    { name: 'Telefon', key: 'phone'},
    { name: 'Fax', key: 'fax'},
    { name: 'Adresse', key: 'address'},
    { name: 'By', key: 'city'},
    { name: 'Postnummer', key: 'zip'},
    ];
    Session.set('modalFields', list);
};

Template.creditors.items = function () {
    return Creditors.find({}, { sort: { key: -1 }}); // .fetch();
};
Template.creditors.events({
    'click .creditors tbody>tr': function(event) {
        Session.set('selected', this);
        $('#myModal').modal({});
    },
    'click #editable-submit': function(event) {
        console.log(this);
    },
});
