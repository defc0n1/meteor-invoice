Template.itemstatsinner.helpers({
    fields: function (element) {

    },
    messages: function () {
        return Messages.find().fetch();
        return [{ message: 'test'}]
        //Messages.find(); // .fetch();
    }
});
