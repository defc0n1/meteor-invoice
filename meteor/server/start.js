Wkhtmltopdf = Meteor.require('wkhtmltopdf');
Nodemailer = Meteor.require('nodemailer');
UUID = Meteor.require('node-uuid');
Future = Meteor.require('fibers/future');
Fiber = Meteor.require('fibers');
util = Meteor.require('util');

Meteor.startup(function () {
    process.env.TZ = 'UTC'
    log.debug(Meteor.settings);
    amqp.connect();

    //var day = 0
    //var m = 3
    //var sum = 0;
    //for(var i = 0; i < 100; i++){
        //day +=1;
        //var start = new Date(2014, m,day)
        //var end = new Date(2014, m,day+1)
        //var res = Sale.aggregate([ {$project: {entries: 1, posting_date: 1}},
            //{$unwind:"$entries"},
            //{ $match: {
                          //'entries.account_number': '1000',
            //'posting_date': {$gte: start, $lt: end}
                      //}},
                      //{$group: {_id: null, total: {$sum : "$entries.amount"}}}]);
        ////{$group: {_id: '$key', total: {$sum : 1}}}]);
        //if(res.length == 1){
            //console.log(res[0].total/100.0, start, end);
            //sum += res[0].total;
        //}
        //console.log('sum', sum/100.0, day+1);
    //}


        //var sum = 0
        //var start = new Date(2014, 1,28)
        //var end = new Date(2014, 1,29)
        //var res = Sale.aggregate([ {$project: {key: 1, entries: 1, posting_date: 1}},
            //{$unwind:"$entries"},
            //{ $match: {
                          //'entries.account_number': '1000',
            //'posting_date': {$gte: start, $lt: end}
                      //}},
                      //{$group: {_id: '$key', total: {$sum : "$entries.amount"}}},
                      //{$sort: {'_id': 1}},
                      //]);
        //console.log(res)
        //res.forEach(function(elem) {
            //sum += elem.total
        //})
        //console.log(sum)

//var m = 0
//for(var i = 0; i < 20; i++){
    //var start = new Date(2013, m,1)
    //var end = new Date(2013, m+1,1)
    //var res = Sale.aggregate([ {$project: {entries: 1, posting_date: 1, key: 1}},
            //{$unwind:"$entries"},
            //{ $match: {
                          //'entries.account_number': '1000',
        //'posting_date': {$gte: start, $lt: end}
                      //}},
                      ////{$group: {_id: '$key', total: {$sum : 1}}}]);
        //{$group: {_id: null, total: {$sum : "$entries.amount"}}}]);
    //if(res.length == 1)
        //console.log(res[0].total, start, end);
    //m += 1
//}
});

