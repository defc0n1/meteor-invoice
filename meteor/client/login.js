Template.login.events({
    'submit #login-form': function(e, t){
        e.preventDefault();
        var email = t.find('#login-email').value;
        var password = t.find('#login-password').value;

        // trim and validate
        Meteor.loginWithPassword(email, password,
            function(err){
                if (err){
                    $('#login-message').append(err.reason + '<br>');
                    console.log(err);
                }
                else{
                    $('#login-message').append('Du er nu logget ind<br>');
                }
            }
        );
        return false;
    },
    'click #forgot-password': function (e, t) {
        var email = t.find('#login-email').value;
        console.log('cap', email);
        if (!email) {
            $('#login-message').append('Indtast venligst email adresse<br>');
        }
        else{
            $('#login-message').append('Vent et øjeblik<br>');
            Accounts.forgotPassword({ email: email }, function(err) {
                if (err) {
                    $('#login-message').append(err.message + '<br>');
                }
                else {
                    $('#login-message').append('Vi har sendt en email med et password nulstillingslink til dig<br>');
                }
            });
        }
    }
});
