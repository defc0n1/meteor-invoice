Accounts.config({
    forbidClientAccountCreation: true
});
Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('set-password/#/reset-password/' + token);
  };
Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl('set-password/#/enroll-account/' + token);
  };
Accounts.emailTemplates.from = "Invoice administration <tradehouse@tradehouse.as>";
