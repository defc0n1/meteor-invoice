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
            if (this.params.type === 'newSalesinvoice') {
                this.render('new');
            }
            else if (this.params.type === 'newItem') {
                console.log('test')
                $('#new-element-modal').modal({});
            }
            else {
                this.render('table');
            }
        },
    });
    this.route('show', {
        path: '/show/:type/:key',
        layoutTemplate: 'layout',
        action: function () {
            this.render('posted');

        },
        before: function () {
            Session.set('key', this.params.key);
            Session.set('type', Mapping[this.params.type]);
        }
    });
});
