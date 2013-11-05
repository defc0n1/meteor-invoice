var Deptors = new Meteor.Collection('deptors');
var incrementSize = 10;
Session.set('limit', 10);
Session.set('skip', 0);
//Meteor.call('salesInvoiceCount', function(err, result) {
    //console.log(err, result);
    //Session.set('salesInvoiceCount', result);
//});

Template.deptors.rendered = function () {
};
Template.modalInner.rendered = function () {
    //console.log(this);
    $.fn.editable.defaults.mode = 'inline';
    $('#username').editable({
        success: function(response, newValue) {
            console.log(response, newValue);
            Deptors.update({ _id: Session.get('selected')._id }, { $set: { name: newValue } });
        }
    });
};
Template.modalInner.events({
    'click .editable-submit #username': function(event) {
        console.log(this, event);
    }
});

Deps.autorun(function() {
    Meteor.subscribe('deptorChannel', Session.get('limit'), Session.get('skip'), Session.get('query'));
});

Template.deptors.items = function () {
    //return [ 1,2,3,4];
    //return log(SalesInvoices.findOne())
    //
    return Deptors.find({}, { sort: { _id: -1 }}); // .fetch();

};

Template.modalInner.element = function () {
    return Session.get('selected'); // .fetch();
}

Template.deptors.events({
    'keyup #search-query': function(event) {
        Session.set('query', event.target.value);
        Session.set('skip', 0);
    },
    'click .deptors tr': function(event) {
        Session.set('selected', this);
        $('#myModal').modal({});
    },
    'click #editable-submit': function(event) {
        console.log(this);
    },
    'click #previous-page': function(event) {
        console.log('dect');
        Session.set('skip', Session.get('skip') - incrementSize);
    },
});

Template.deptors.helpers({
    showPrevious: function() {
        var disable = Session.equals('skip', 0);
        return disable ? 'disabled' : '';
    },
    showNext: function() {
        var disable = Session.get('skip') + incrementSize >= Session.get('salesInvoiceCount')
        return disable ? 'disabled' : '';
    },
    countText: function(date) {
        var start = Session.get('skip') + 1;
        return 'Viser ' + start + ' til ' +
                (start + incrementSize - 1) +
                ' af ' + Session.get('salesInvoiceCount');
    }
});
