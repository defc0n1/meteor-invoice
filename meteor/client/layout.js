'use strict';

Template.layout.events({
    'click .close': function (event) {
        Alerts.remove({ _id: this._id });
    },
    'click #show-more': function(event) {
        ChangePage(true);
    },
    'click #show-fewer': function(event) {
        ChangePage(false);
    },
});
Template.layout.helpers({
    alerts: Alerts.find(),// .fetch();
});
