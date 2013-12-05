Template.layout.events({
    'click .close': function (event) {
        Alerts.remove({ _id: this._id });
    },
});
Template.layout.helpers({
    alerts: Alerts.find(),// .fetch();
});
