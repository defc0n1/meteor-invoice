Template.postedSalesinvoice.rendered = function () {
    Meteor.call('getSalesInvoice', Session.get('key'), function (err, result) {
        Session.set('element', result);
        var total = 0;
        result.lines.forEach(function (line) {
            total += line.price * line.quantity;
        });
        Session.set('total', total);
    });

};
Template.postedSalesinvoice.helpers({
    getLines: function () {
        var elem = Session.get('element');
        if (Router.current().route.name !== 'bareInvoice') return elem && elem.lines

        var page = Session.get('page');
        if (elem) {
            if (!page) return elem.lines;
            if (page === '1') {
                return _.chain(elem.lines).first(lfirst).value();
            }
            else {
                log.info('res');
                return _.chain(elem.lines).rest(lfirst + (page - 2) * lpp).first(lpp).value();
            }
        }
        return [];
        //if ( elem.lines.length >=

    },
    lastPage: function () {
        if (Router.current().route.name !== 'bareInvoice') return true;
        var page = Session.get('page');
        var elem = Session.get('element');
        return elem && lfirst + (page - 2) * lpp + lpp > elem.lines.length;

    },
    footerStyle: function () {
        if (Router.current().route.name !== 'bareInvoice') return '';
        var height = 31;
        var page = Session.get('page');
        var elem = Session.get('element');
        var px = height * 30 - (height * (elem.lines.length - (lfirst + (page - 2 ) * lpp)))
        if (page !== '1'){
            px += 100;
        }
        log.info(px);
        return 'padding-top:' + px + 'px;';

    },
    firstPage: function () {
        if (Router.current().route.name !== 'bareInvoice') return true;
        var page = Session.get('page');
        return page === '1';
    }
});



