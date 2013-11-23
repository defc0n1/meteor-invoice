Template.postedSalescreditnota.rendered = function () {
    Meteor.call('getSalesCreditnota', Session.get('key'), function (err, result) {
        Session.set('element', result);
        var total = 0;
        result.lines.forEach(function (line) {
            total += line.price * line.quantity;
        });
        Session.set('total', total);
    });

};
