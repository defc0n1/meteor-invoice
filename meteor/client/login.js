Template.login.showResult = function() {
    return Session.get('showResult');
};
Template.login.message = function() {
    return Session.get('message');
};

Template.login.events({
    'submit #login-form': function(e, t){
        e.preventDefault();
        var email = t.find('#login-email').value;
        var password = t.find('#login-password').value;

        // trim and validate
        Meteor.loginWithPassword(email, password,
            function(err){
                if (err){
                    Session.set('message', err.reason);
                    // inform error
                    console.log(err);
                    Session.set('showResult', true);
                }
                else{
                    Session.set('message', 'Du er nu logget ind');
                    // logged in
                }
            }
        );
        return false;
    }
});
