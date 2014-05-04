"use strict";

//helper to preserver skip and query history when using browser history.
//To preserve set when going back from routeB to routeA
//set routeA : { routeB: true }
var historyMap = {
    'postedSalesinvoices' : { 'postedSalesinvoice' : true }
}
var updateFilters = function(type) {
            var obj = historyMap[type] || {};
            var skipClear = obj[history.state.type];
            if (!skipClear)
                ClearFilters();
}
Router.onStop(
    function () {
        history.pushState({ type: this.params.type }, '');
    }
)
Router.onBeforeAction(
        function() {

            if (Meteor.loggingIn()) {
            }
            else if (!Meteor.user() && !Meteor.loggingIn()) {
                //this.render('login');
                //this.render('login');
                Router.go('login');
                this.stop();
            }
            else if(Meteor.user()) {
            }
        }, {except: ['login', 'forgotPassword', 'setPassword', 'unsubscribe']});

Router.configure({
    //layoutTemplate: 'layout',
    loadingTemplate: 'loading',
});

Router.map(function () {
    this.route('setPassword', {
        path: '/set-password',
        action: function() {
            console.log('test', this.params.hash);
            if (Meteor.user()) {
                this.stop();
                Router.go('index');
                return;
            }
            this.render('enroll');
        },
    });
    this.route('login', {
        path: '/login',
        template: 'login',
        onBeforeAction: function() {

            if (Meteor.loggingIn()) {

            }
            if (Meteor.user()) {
                this.stop();
                Router.go('index');
                //this.redirect('/');
            }
        },
        onAfterAction: function () {
        }
    });
    this.route('index', {
        path: '/',
        layoutTemplate: 'layout',
        template: 'index'
    });
    this.route('main', {
        path: '/table/:root/:type',
        layoutTemplate: 'layout',
        action: function () {
            this.render('table');
        },
        onBeforeAction: function () {
            updateFilters(this.params.type);
            Session.set('type', Mapping[this.params.type]);
        }
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
        //layoutTemplate: 'layout',
        action: function () {
            this.render('unsubscribe');
        },
        //onBeforeAction: function() {
            //Session.set('type', Mapping[this.params.type]);
        //}
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
            return Meteor.subscribe('Custom', 'Deptors', {email: {$ne: ''}});
        }
    });
    this.route('customerordernumber', {
        path: '/customerordernumber',
        layoutTemplate: 'layout',
        action: function () {
            //Session.set('Itemslimit', 200);
            this.render('customerordernumber');
        },
        //waitOn: function () {
            //return Meteor.subscribe('Custom', 'Deptors', {email: {$ne: ''}});
        //}
    });
});
