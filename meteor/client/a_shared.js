incrementSize = 10;

Messages = new Meteor.Collection(null);

Meteor.subscribe('TradeAccounts');
Meteor.subscribe('alertChannel');
Meteor.subscribe("CollectionCounts");
Meteor.subscribe("MailGroups");
