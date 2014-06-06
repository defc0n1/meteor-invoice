
Template.mailsending.rendered = function() {
    $('.table-tooltip').tooltip();
    Session.set('showTestMail', true);
};
Template.mailsending.helpers({
    mailgroups: function () {
        return MailGroups.find();
    },
    history: function () {
        return History.find({type: 'newsletter'});
    },
});

Template.mailsending.events({
    'change #group': function(event){
        Session.set('showTestMail', event.target.value == 'test');
    },
    'click #send': function (event) {
        event.preventDefault();
        var group = $('#group').val();
        Required('#image-url', 'Billede url skal angives', function(url){
            Required('#subject', 'Emne skal angives', function(subject){
                if(group === 'test'){
                    Required('#email', 'Test email addresse er krævet når der sendes til test-gruppen', function(email){
                        Meteor.call('sendNewsletter', group, email, url, subject, function (err, msg) {console.log(err,msg)});
                    });
                }
                else{
                    bootbox.confirm('Vil du sende den pågældende mail til gruppe' + group + '?', function(res){
                        if(res){
                            Meteor.call('sendNewsletter', group, undefined, url, subject, function (err, msg) {console.log(err,msg)});
                        }
                    });
                }
            });
        });
    },
});
