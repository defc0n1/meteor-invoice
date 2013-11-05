Template.invoice.rendered = function () {
    Meteor.call('getSalesInvoice', Session.get('_id'), function (err, result) {
        Session.set('invoice', result);
        var total = 0;
        result.lines.forEach(function (line) {
            total += line.price * line.quantity;

        });
        Session.set('total', total);
    });

};

Template.invoice.getPrice = function (amount) {
        if(isNaN(amount)){
            var a = 0;
            return a.toFixed(2) ;
        }
        amount = amount/100;
        amount = amount.toFixed(2);
        //if(amount.length === 2){
        //return '00.' + amount;
        //}
    //var money = amount.substring(0, amount.length-2) + '.' + amount.substring(amount.length-2, amount.length);
    //return money;
        amount = amount + '';
        amount = amount.replace('.', ',');
        var val = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
        return val;
};

Template.invoice.helpers({
    element: function () {
        //console.log(Session.get('invoice'));
        return Session.get('invoice');
    },
    getLineTotal: function (amount, qty) {
        return Template.invoice.getPrice(amount * qty);

    },
    getTax: function () {
        return Template.invoice.getPrice(Session.get('total') * 0.25);
    },
    getTotal: function () {
        return Template.invoice.getPrice(Session.get('total'));
    },
    getTotalWithTax: function () {
        return Template.invoice.getPrice(Session.get('total') * 1.25);
    },
    getDate: function (date) {
        return 'test';
        console.log(date);
        if (date) {
            return moment(date).format('DD MMM YYYY');
        }
        else
            return 'test';
    }
});
