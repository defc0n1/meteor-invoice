"use strict";

// helper to determine the current active route
Router.before(
        function() {
            // clear session variables
            if (Meteor.loggingIn()) {
                //NProgress.start();
            }
            else if (!Meteor.user() && !Meteor.loggingIn()) {
                //this.render('login');
                //this.render('login');
                Router.go('login');
                this.stop();
            }
            else if(Meteor.user()) {
                //NProgress.done();
            }
        }, {except: ['login', 'forgotPassword', 'setPassword']});

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
        before: function() {

            if (Meteor.loggingIn()) {
                //NProgress.start();

            }
            if (Meteor.user()) {
                //NProgress.done();
                this.stop();
                Router.go('index');
                //this.redirect('/');
            }
        },
        after: function () {
            //NProgress.done();
        }
    });
    this.route('index', {
        path: '/',
        layoutTemplate: 'layout',
        template: 'index'
    });
    this.route('main', {
        path: '/:root/:type',
        layoutTemplate: 'layout',
        action: function () {
            this.render('table');
        },
        before: function () {
            ClearFilters()
            Session.set('type', Mapping[this.params.type]);
        }
    });
    this.route('edit2', {
        path: '/edit2/:type/:key',
        layoutTemplate: 'layout',
        action: function () {
            this.render('editelement');
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
        before: function () {
            Session.set('key', this.params.key);
            //Session.set('type', Mapping[this.params.type]);
            Session.set('type', Mapping['newSalesinvoice']);
        }
    });
    this.route('show', {
        path: '/show/:type/:key',
        layoutTemplate: 'layout',
        action: function () {
            this.render('posted');
        },
        before: function () {
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
        before: function() {
            Session.set('type', Mapping[this.params.type]);
        }
    });
});
