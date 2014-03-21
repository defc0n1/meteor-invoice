
var getLines = function (elem, page) {
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
    totalPages: function (nLines) {
        var pages = 1;
        var linesOnLast = 0;
        for(var i = 1; i <= nLines; i++) {
            linesOnLast++;
            if (i > lfirst +  lpp * (pages -  1)) {
                pages += 1;
                linesOnLast = 0;
            }
        };
        if (pages > 1 && linesOnLast > llast){
            pages++;
        }
            return pages;
    },
    getInvoice: function (invoice, cb) {
        var pages = Pdf.totalPages(invoice.lines.length);
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
                        pageText: 'Side ' + i + ' af ' + pages,
                        total: total,
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
                Wkhtmltopdf(url, { output: '/tmp/' + invoice.key + '.pdf', encoding: 'utf8'}, function(code, signal){
                    console.log(code, signal);
                    cb(pages, invoice.key);
                });
            });
        });
    },
};
