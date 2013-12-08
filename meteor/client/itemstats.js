Template.itemstatsinner.rendered = function () {
    $('#stats-start-date').datepicker({ autoclose: true })
    $('#stats-start-date').datepicker('update', new Date(2000, 1, 1));
    $('#stats-end-date').datepicker({ autoclose: true }).on('changeDate', function (e) {
        var elem = Session.get('element');
        var stats = Meteor.call('getItemStats', elem.elem.key, undefined, e.date, function (err, res) {
            Session.set('stats', res);
        });
    });
    $('#stats-end-date').datepicker();//('update', new Date());
    //var elem = Session.get('element');
    //var stats = Meteor.call('getItemStats', this.elem.key, function (err, res) {
        //Session.set('stats', res);
        //$('#itemstats').modal({});
    //});
}
Template.itemstatsinner.helpers({
    fields: function (element) {

    },
    messages: function () {
        return Messages.find().fetch();
        return [{ message: 'test'}]
        //Messages.find(); // .fetch();
    }
});

Template.itemstatsinner.events({

});
