Accounts.config({
    forbidClientAccountCreation: true
});
Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('set-password/#/reset-password/' + token);
  };
Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl('enroll-account/#/enroll-account/' + token);
  };
