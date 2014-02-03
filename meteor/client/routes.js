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
        }, {except: ['login', 'forgotPassword']});

Router.configure({
    //layoutTemplate: 'layout',
    loadingTemplate: 'loading',
});

Router.map(function () {
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
            Session.set('type', Mapping[this.params.type]);
            this.render('table');
        },
    });
    this.route('edit2', {
        path: '/edit2/:type/:key',
        layoutTemplate: 'layout',
        action: function () {
            //Session.set('type', Mapping[this.params.type]);
            var capString = this.params.type.charAt(0).toUpperCase() + this.params.type.slice(1);
            Session.set(capString + 'filter', { key: this.params.key });
            this.render('editelement');
        },
    });
    this.route('edit', {
        path: '/edit/:type/:key',
        layoutTemplate: 'layout',
        action: function () {
            Session.set('key', this.params.key);
            Session.set('type', Mapping[this.params.type]);
            this.render('new');
        },
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
            //TODO: Capitalize mapping names
            var capString = this.params.type.charAt(0).toUpperCase() + this.params.type.slice(1);
            Session.set(capString + 'filter', { record_number: parseInt(this.params.key) });
            Session.set('type', Mapping[this.params.type]);
        }
    });
});
