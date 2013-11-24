Messages = new Meteor.Collection(null);
incrementSize = 10;
Session.set('limit', incrementSize);

Deps.autorun(function() {
    var collections = [
        'deptorChannel',
        'creditorChannel',
        'itemChannel',
        'salesinvoiceChannel',
        'salescreditnotaChannel',
        'purchaseinvoiceChannel',
        'purchasecreditnotaChannel',
    ];
    var progressCount = 0;
    console.log('deps');
    try {
        NProgress.start();
        log.info('started')
    }
    catch (err) {
        console.log('err');
    }
    _.each(collections, function (collection) {
        progressCount += 1
        Meteor.subscribe(collection,
            Session.get('limit'),
            Session.get('skip'),
            Session.get('query'),
            Session.get('filter'),
            function (ready) {
                progressCount -= 1;
                log.info('ready')
                if (progressCount === 0) {
                    log.info('done')
                    NProgress.done();
                }
            });

    });
    Meteor.subscribe('alertChannel');
});

UpdateCount = function () {
    Meteor.call(
            Session.get('currentCollection'),
            Session.get('query'),
            { filter: Session.get('filter') },
            function(err, result) {
                err && console.log(err);
                Session.set('itemCount', result);
            });
};

RenderList = function (collection) {
    Session.set('currentCollection', collection);
    Session.set('skip', 0);
    UpdateCount();

};
GetPrice = function (amount) {
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
