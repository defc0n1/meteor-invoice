Template.postedPurchasecreditnota.rendered = function () {
    Meteor.call('getPurchaseCreditnota', Session.get('key'), function (err, result) {
        console.log(result);
        Session.set('element', result);
        var total = 0;
        result.lines.forEach(function (line) {
            total += line.price * line.quantity;
        });
        Session.set('total', total);
    });

};
