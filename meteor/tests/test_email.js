var assert = require('assert');

suite('Methods', function() {
    test('in the server', function(done, server) {

        var successes = 0;
        server.eval(function() {

            //var tests = [ lfirst - 2, lfirst - 1, lfirst, lfirst + 1, lfirst + 2 ];
            var tests = [56, 57];

            var line = {
            "item_number" : "51114",
            "info" : "Herre bælter",
            "last_updated" : "2014-03-02T11:01:16.463Z",
            "ean" : "",
            "total_with_tax" : 540000,
            "price" : 1800,
            "total_without_tax" : 432000,
            "quantity" : 240
            }
            _.each(tests, function(i) {
                var testInvoice = {
                        "address" : "Sct.Mathias marked",
                        "address_1" : "Butik 316",
                        "amount" : 540000,
                        "attention" : "",
                        "comments" : ['comment 1dfsajklklfdskajkfdsaldfsjkladfjkdkjladfaskjldasljkdfkdfskljdfjskaldsfajkldfsldfsjkldfsakfdsjkl', 'dsafjfdaskl;dkl;dfs;fdsajkdfsajkdsfajkdsafk;ldfsakjakl;adfsjkldsfkjldfsadkl;sfajkdsfkjldsakjldfsajkldkjldfsakljadfsjkldfskl;comment 2, fdasjk;dfsjdsfa;lddskjd;dsafdfsk;dfsd;fsajkdfsakjdsljkdfskjldsfkjldsfjklfdskjldfsljkdfskjldfsjklsdfklj'],
                        "city" : "Viborg",
                        "customer_number" : "86626277",
                        "customer_order_number" : "",
                        "delivery_date" : "2014-02-03T00:00:00Z",
                        "deptor_number" : "86626277",
                        "edi" : "Nej",
                        "entry_number" : 330860,
                        "last_updated" : "2014-03-06T12:40:14.102Z",
                        "lines" : [
                        ],
                        "name" : "Hæle og Nøglebar",
                        "name_1" : "",
                            "order_date" : "2014-01-21T00:00:00Z",
                        "posting_date" : "2014-01-31T00:00:00Z",
                        "posting_group" : "V",
                        "total_with_tax" : 0,
                        "type" : "invoice",
                        "zip" : "8800"
                }
                for(var l = 0; l <= i; l++){
                    testInvoice.lines.push(line);
                }
                testInvoice.key = i;
                var res = Pdf.getInvoice(testInvoice, function(pages, key) {
                    var PFParser = Meteor.require("pdf2json");
                    var pdfParser = new PFParser();
                    var onError = function(err) {
                        console.log(err, 'error in pdf parsing');
                    };
                    var onReady = function(obj) {
                        emit('pdf', { pdf: obj.data.Pages.length, expected: pages, numOfTests: tests.length });
                    }
                    pdfParser.on("pdfParser_dataReady", _.bind(onReady));
                    pdfParser.on("pdfParser_dataError", _.bind(onError));
                    var json = pdfParser.loadPDF('/tmp/' + key + '.pdf');
                });
            });

        });
        server.on('pdf', function(res) {
            assert.equal(res.pdf, res.expected);
            successes++;
            if (successes == res.numOfTests)
                done();
        });
    });
});
