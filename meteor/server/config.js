Accounts.config({
    forbidClientAccountCreation: !Meteor.settings.allowClientAccountCreation
});
Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('set-password/#/reset-password/' + token);
  };
Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl('set-password/#/enroll-account/' + token);
  };
Accounts.emailTemplates.from = "Invoice administration <tradehouse@tradehouse.as>";

Facts.setUserIdFilter(function () { return true; });
