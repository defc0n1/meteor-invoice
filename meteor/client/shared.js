Messages = new Meteor.Collection(null);
incrementSize = 10;
Session.set('limit', incrementSize);

Deps.autorun(function() {
    Meteor.subscribe('deptorChannel',
        Session.get('limit'),
        Session.get('skip'),
        Session.get('query'),
        Session.get('filter')
    );
    Meteor.subscribe('invchannel',
        Session.get('limit'),
        Session.get('skip'),
        Session.get('query'),
        Session.get('filter')
    );
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

}
