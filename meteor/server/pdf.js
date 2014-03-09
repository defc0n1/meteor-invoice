var getLines = function (elem, page) {
        console.log(page);
        if (elem) {
            if (!page) return elem.lines;
            if (page === 1) {
                return _.chain(elem.lines).first(lfirst).value();
            }
            else {
                return _.chain(elem.lines).rest(lfirst + (page - 2) * lpp).first(lpp).value();
            }
        }
        return [];
};
Pdf = {
    getFooter: function (page, elem) {
        var height = 31;
        var px = height * llast - (height * (elem.lines.length - (lfirst + (page - 2 ) * lpp)))
        if (page !== '1'){
            px += 100;
        }
        return 'padding-top:' + px + 'px;';
    },
    getInvoice: function (invoice, cb) {
        var pages = Print.totalPages(invoice.lines.length);
        var fs = Meteor.require('fs');
        var url = '';

        var total = 0;
        invoice.lines.forEach(function (line) {
            total += line.price * line.quantity;
        });
        Assets.getText('bootstrap.min.css', function (err, res) {
            Assets.getText('pdf.handlebars', function (err, temp) {
                var template = Handlebars.compile(temp, {noEscape: true});
                for(var i = 1; i <= pages; i++) {
                    var html = template({
                        style: res,
                        firstPage: i == 1,
                        lastPage: i == pages,
                        total: total,
                        footerStyle: Pdf.getFooter(i, invoice),
                        getLines: getLines(invoice, i),
                        Element: invoice,
                        type: Mapping['postedSalesinvoice'] });
                    var fileName = "/tmp/" + invoice.key + '-' + i + '.html';
                    url += 'file://' + fileName + ' ';
                    var fut = new Future();
                    var onComp = function (a, b) {
                        //console.log('wrote', a, b);
                        fut.return();
                    };
                    var stream = fs.writeFile(fileName, html, onComp);
                    fut.wait();
                }
                Wkhtmltopdf(url, { output: '/tmp/' + invoice.key + '.pdf', encoding: 'utf8'});
                cb(undefined, "ok");
            });
        });
    },
};
