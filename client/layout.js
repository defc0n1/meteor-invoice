var Alerts = new Meteor.Collection('alerts');
Deps.autorun(function() {
    Meteor.subscribe('alertChannel');
});
Template.layout.alerts = function () {
    return Alerts.find(); // .fetch();

};
Template.layout.events({
    'click .close': function (event) {
        Alerts.remove({ _id: this._id });
    }
});
