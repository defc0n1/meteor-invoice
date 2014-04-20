Template.table.rendered = function () {
};

var getDistinctGroups = function () {
    var res = [];
    var groups = Deptors.find({mailgroups: {$exists:1}}, {fields: {mailgroups: 1}}).fetch();
    groups.forEach(function(item) {
        _.each(item.mailgroups, function(v, k) {
            res.push(k);
        });
    });
    console.log(groups, res);
    return _.uniq(res);
};

Template.mailgroups.helpers({
    mailgroups: function () {
        return MailGroups.find();
    },
    deptors: function () {
        return Deptors.find({emails: {$ne: ''}});
    },
    member: function (elem) {
        if(this.mailgroups && this.mailgroups[Session.get('mailgroupname')] === 1) {
            return 'checked'
        }
        return ''
    },
});


Template.mailgroups.events({
    'click #add-mailgroup': function (event) {
        Session.set('showEditForm', true);
        Session.set('addMailGroup', true);
    },
    'click #cancel-mailgroup': function (event) {
        event.preventDefault();
        Session.set('showEditForm', false);
    },
    'click .edit-mailgroup': function (event) {
        Session.set('mailgroupname', this._id);
        Session.set('showEditForm', true);
    },
    'click .delete-mailgroup': function (event) {
        var that = this;
        bootbox.confirm('Er du sikker på at du vil slette denne mailgruppe?', function(res){
            if(res){
                Meteor.call('DeleteMailGroup', that._id, function (err, msg) {console.log(err,msg)});
            }
        });
    },
    'click #save-mailgroup': function (event) {
        event.preventDefault();
        if(Session.get('addMailGroup') === true) {
            var name = $("#groupname").val();
            var groupname = 'mailgroups.' + name;
            var re = /(\d|\w)+/.exec(name);
            if (re.length == 0 || re[0] != name){
                bootbox.alert('Æv, gruppe navnet er ugyldigt. Kun tal og a-z bogstaver!');
                return;
            }
            // ensure that name doesn't exist already, and that the reserved name, test is not used
            if (MailGroups.find({_id: name}).count() > 0 || name === 'test'){
                bootbox.alert('Æv, gruppe navnet eksisterer allerade. Prøv et andet!');
                return;
            }
            MailGroups.insert({_id: name}, function (err, msg) {});
            Session.set('addMailGroup', false);
        }
        else {
            var groupname = 'mailgroups.' + Session.get('mailgroupname');
        }
        var update = {};
        update[groupname] = 1;
        var checks = $(".customer");
        checks.each(function() {
            if(this.checked){
                Deptors.update({_id: new Meteor.Collection.ObjectID(this.id)}, {$set: update}, function (err, msg) {});
            }
            else{
                Deptors.update({_id: new Meteor.Collection.ObjectID(this.id)}, {$unset: update}, function (err, msg) {});
            }
        });
        Session.set('showEditForm', false);
    },
})
