Template.unsubscribe.events({
    'submit #unsubscribe-form': function(e, t){
        e.preventDefault();
        var email = $('#email').val();
        Meteor.call('unsubscribe', email, function(err, msg) {console.log(err, msg)});
    }
});
