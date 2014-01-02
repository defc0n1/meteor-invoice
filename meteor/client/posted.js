Template.posted.created = function () {
};
Template.posted.rendered = function () {
    log.info(Session.get('type'), 'test');
    Meteor.call(Session.get('type').getSingle, Session.get('record_number'), function (err, result) {
        Session.set('element', result);
        var total = 0;
        result.lines.forEach(function (line) {
            total += line.price * line.quantity;
        });
        Session.set('total', total);
    });
};
Template.posted.helpers({
});