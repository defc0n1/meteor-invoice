Template.optouts.helpers({
    deptors: function () {
        return Deptors.find({'notifications.newsletter': 0});
    },
});
