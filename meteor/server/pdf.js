Pdf = {
    getInvoice: function (id, pages,  cb) {
        var base = 'show/postedSalesinvoice/' + id;
        var url = '';
        for(var i = 1; i <= pages; i++) {
            url += Meteor.absoluteUrl(base + '/' + i + ' ');
        }
        log.info(url);
        Wkhtmltopdf(url, { output: '/tmp/' + id + '.pdf', 'redirect-delay': 3000, 'zoom': 0.9 }, cb);
    },
};
