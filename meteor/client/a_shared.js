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

UpdateCount = function (method) {
    Meteor.call(method,
            Session.get('query'),
            { filter: Session.get('filter') },
            function(err, result) {
                err && console.log(err);
                Session.set('itemCount', result);
            });
};

