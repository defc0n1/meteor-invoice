"use strict";
Router.before(
        function() {
            if (Meteor.loggingIn()) {
                //NProgress.start();
            }
            else if (!Meteor.user() && !Meteor.loggingIn()) {
                this.render('login');
                return this.stop();
            }
            else if(Meteor.user()) {
                //NProgress.done();
            }
        }, {except: ['login', 'forgotPassword']});

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
});

Router.map(function () {
    this.route('login', {
        path: '/login',
        template: 'login',
        before: function() {

            if (Meteor.loggingIn()) {
                NProgress.start();

            }
            if (Meteor.user()) {
                //NProgress.done();
                this.stop();
                Router.go('home');
                //this.redirect('/');
            }
        },
        after: function () {
            NProgress.stop();
        }
    });
    this.route('loading', {
        path: '/loading',
        template: 'loading'
    });
    this.route('home', {
        path: '/',
        template: 'home'
    });
    this.route('salesinvoices', {
        path: '/salesinvoices',
        template: 'salesinvoices'
    });
    this.route('deptors', {
        path: '/deptors',
        template: 'deptors'
    });
    this.route('invoice', {
        path: '/salesinvoices/:_id',
        template: 'invoice',
        layoutTemplate: '',
        before: function () {
            Session.set('_id', this.params._id);
        }
    });
});
