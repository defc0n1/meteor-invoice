Template.enroll.events({
    'submit #login-form': function(e, t){
        e.preventDefault();
        var password = t.find('#password').value;
        var passwordRepeat = t.find('#password-repeat').value;

        if (password != passwordRepeat) {
            $('#message').html('Passwords matcher ikke!');
        }
        else if (password.length < 4) {
            $('#message').html('Password skal være mindst 4 karakterer!');
        }
        else if (!Accounts._enrollAccountToken && !Accounts._resetPasswordToken) {
            $('#message').html('Ugyldig password token!');
        }
        else {
            Accounts.resetPassword(Accounts._enrollAccountToken || Accounts._resetPasswordToken, password, function(err) {
                if (err) {
                    $('#message').html(err.message);
                }
            });
        }
        return false;
    }
});
