"use strict";
//helper to preserver skip and query history when using browser history.
//To preserve set when going back from routeB to routeA
//set routeA : { routeB: true }
var historyMap = {
    'postedSalesinvoices' : { 'postedSalesinvoice' : true }
}
var updateFilters = function(type) {
    console.log(type)
    var obj = historyMap[type] || {};
    var skipClear = obj[history.state.type];
    if (!skipClear)
        ClearFilters();
};
Router.onStop(
    function () {
        history.pushState({ type: this.params.type }, '');
    }
)

Router.map(function () {
    this.route('setPassword', {
        path: '/set-password',
        layoutTemplate: '',
        onBeforeAction: function(pause) {
            console.log('test', this.params.hash);
            if (Meteor.user()) {
                pause();
                Router.go('index');
            }
        },
        action: function() {
            this.render('enroll');
        }
    });
    this.route('login', {
        path: '/login',
        template: 'login',
        layoutTemplate: '',
        onBeforeAction: function(pause) {

            if (Meteor.loggingIn()) {
            }
            if (Meteor.user()) {
                pause();
                Router.go('index');
            }
        },
    });
    this.route('index', {
        path: '/',
        layoutTemplate: 'layout',
        template: 'index',
        waitOn: function () {
            return Meteor.subscribe('History', 50, 0,
                this.params.query,
                {sort: {created: -1}},
                function () { }
            );
        },
    });
    this.route('main', {
        path: '/table/:root/:type/:page?/:query?',
        layoutTemplate: 'layout',
        action: function () {
            this.render('table');
        },
        onBeforeAction: function () {
            if(!this.params.page){
                this.params.page = 10;
            }
            //for history back button
            $('#search-query').val(this.params.query);
            var map = Mapping[this.params.type];
            Session.set('type', map);
        },
        waitOn: function () {
            var map = Mapping[this.params.type];
            //if(map.filter) {
                return Meteor.subscribe(map.collection,
                    parseInt(this.params.page) || incrementSize,
                    0,
                    this.params.query,
                    GetFilter(map.filter, true),
                    function () { }
                );
            //}
        },
        //unload: function() {
            //updateFilters(this.params.type);
        //}
    });
    this.route('edit2', {
        path: '/edit2/:type/:key',
        layoutTemplate: 'layout',
        action: function () {
            if(this.ready()){
                console.log(Items.find().fetch());
                this.render('editelement');

            }
        },
        waitOn: function () {
            return Meteor.subscribe('Custom', GetCurrentMapping().collection, {key: this.params.key});
        }
    });
    this.route('edit', {
        path: '/edit/:type/:key',
        layoutTemplate: 'layout',
        action: function () {
            this.render('new');
        },
        onBeforeAction: function () {
            Session.set('key', this.params.key);
            Session.set('type', Mapping['newSalesinvoice']);
        },
        waitOn: function () {
            return Meteor.subscribe('Custom', GetCurrentMapping().collection, {key: parseInt(this.params.key)});
        }
    });
    this.route('show', {
        path: '/show/:type/:key',
        layoutTemplate: 'layout',
        action: function () {
            this.render('posted');
        },
        onBeforeAction: function () {
            this.params.root = 'show';
            Session.set('key', this.params.key);
            Session.set('type', Mapping[this.params.type]);
        }
    });
    this.route('dynamic', {
        path: '/dynamic/:type/:key',
        layoutTemplate: 'layout',
        action: function () {
            this.render('table');
        },
        onBeforeAction: function() {
            Session.set('type', Mapping[this.params.type]);
        }
    });
    this.route('unsubscribe', {
        path: '/unsubscribe',
        layoutTemplate: '',
        action: function () {
            this.render('unsubscribe');
        },
    });
    this.route('dynamic', {
        path: '/custom/:root/:type',
        layoutTemplate: 'layout',
        action: function () {
            Session.set('Itemslimit', 200);
            this.render(this.params.type);
        },
    });
    this.route('campaigns', {
        path: '/campaigns/:root/:type',
        layoutTemplate: 'layout',
        action: function () {
            Session.set('addMailGroup', false);
            Session.set('showEditForm', false);
            Session.set('mailgroupname', undefined);
            this.render(this.params.type);

        },
        waitOn: function () {
            var handles = [
                Meteor.subscribe('History', 50, 0, {type: 'newsletter'}, {sort: {created: -1}}),
                Meteor.subscribe('Custom', 'Deptors', {'secondary_emails.0': {$exists: true}})
            ];
            return handles;
        }
    });
    this.route('quickgln', {
        path: '/quickqln/:page?/:query?',
        layoutTemplate: 'layout',
        onBeforeAction: function () {
            //for history back button
            $('#search-query').val(this.params.query);
        },
        waitOn: function () {
            //make the correct sidebar show
            this.params.root = 'items';
            var filter = { $or: [{gln_number: ''}, {gln_number: { $exists: 0 }}]};
            return Meteor.subscribe('Items',
                parseInt(this.params.page) || incrementSize,
                0,
                this.params.query,
                filter);
        }
    });
    this.route('facts', {
        path: '/facts',
        layoutTemplate: 'layout',
        action: function () {
            this.render('facts');
        },
    });
    this.route('customerordernumber', {
        path: '/customerordernumber/:page?/:query?',
        layoutTemplate: 'layout',
        action: function () {
            this.render('customerordernumber');
        },
        onBeforeAction: function () {
            //for history back button
            $('#search-query').val(this.params.query);
        },
        waitOn: function () {
            //make the correct sidebar show
            this.params.root = 'sale';
            var filter = { $and: [{ posting_date: { $exists: true } }, { $or: [{customer_order_number: ''}, {customer_order_number: { $exists: 0 }}]}]};
            return Meteor.subscribe('Sale',
                parseInt(this.params.page) || incrementSize,
                0,
                this.params.query,
                filter);
        }
    });
});

Deps.autorun(function() {
  var except = ['login', 'forgotPassword', 'setPassword', 'unsubscribe']
  if (Router.current() && !_.contains(except, Router.current().route.name) && Meteor.user() === null && !Meteor.loggingIn())
    Router.go('login');
});
