incrementSize = 10;

Messages = new Meteor.Collection(null);

Meteor.subscribe('TradeAccounts');
Meteor.subscribe('Alerts');
Meteor.subscribe("CollectionCounts");
Meteor.subscribe("MailGroups");
