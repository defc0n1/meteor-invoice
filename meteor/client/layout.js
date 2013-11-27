Template.layout.events({
    'click #next-page': function(event) {
        Session.set('skip', Session.get('skip') + incrementSize);
    },
    'click #previous-page': function(event) {
        console.log('dect');
        Session.set('skip', Session.get('skip') - incrementSize);
    },
    'click .close': function (event) {
        Alerts.remove({ _id: this._id });
    },
});
Template.layout.helpers({
    alerts: Alerts.find(),// .fetch();
});
