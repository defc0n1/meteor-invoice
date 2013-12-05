var helpers = {
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
        var px = height * llast - (height * (elem.lines.length - (lfirst + (page - 2 ) * lpp)))
        if (page !== '1'){
            px += 100;
        }
        log.info(px);
        return 'padding-top:' + px + 'px;';

    },
    firstPage: function () {
        console.log('test');
        return true
        //return this.page === '1';
    }
};

//_.each(helpers, function (val, key) {
    //Handlebars.registerHelper(key, val);
//});
var getLines = function (elem, page) {
        console.log(page);
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
};
//Handlebars.registerHelper('firstPage', function () { return true });
Pdf = {
    getFooter: function (page, elem) {
        var height = 31;
        var px = height * llast - (height * (elem.lines.length - (lfirst + (page - 2 ) * lpp)))
        if (page !== '1'){
            px += 100;
        }
        log.info(px);
        return 'padding-top:' + px + 'px;';
    },
    getInvoice: function (invoice, pages,  cb) {
        var fs = Meteor.require('fs');
        var url = '';
        Assets.getText('bootstrap.min.css', function (err, res) {
            Assets.getText('pdf.handlebars', function (err, temp) {
                var template = Handlebars.compile(temp, {noEscape: true});
                for(var i = 1; i <= pages; i++) {
                    var html = template({
                        style: res, 
                        firstPage: i == 1,
                        lastPage: i == pages,
                        footerStyle: Pdf.getFooter(i, invoice),
                        custInfo: true,
                        getLines: getLines(invoice, i),
                        Element: invoice, type: Mapping['postedSalesinvoice'] });
                    var fileName = "/tmp/my_file" + i + '.html'
                    url += 'file://' + fileName + ' ';
                    var fut = new Future();
                    var onComp = function (a, b) { console.log('wrote', a, b); fut.return() }
                    var stream = fs.writeFile(fileName, html, onComp);
                    fut.wait()
                }
                log.info(url);
                log.info(url, 'stop wait');
                //Wkhtmltopdf(url, { output: '/tmp/tmp.pdf', encoding: 'utf8', zoom: 0.9 });
                Wkhtmltopdf(url, { output: '/tmp/tmp.pdf', encoding: 'utf8'});
            });
        });
    },
};
