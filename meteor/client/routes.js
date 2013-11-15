"use strict";

// helper to determine the current active route
var determineActive = function (items, path, rootPath) {
    return _.map(items, function (item) {
        item.active = path == item.path ? 'active' : '';
        item.path = RootRoute(item.path);
        return item;
    });

}
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
        }, {except: ['login', 'forgotPassword', 'bareInvoice']});

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
            NProgress.done();
        }
    });
    this.route('loading', {
        path: '/loading',
        template: 'loading'
    });
    this.route('home', {
        path: '/',
        layoutTemplate: 'layout',
        template: 'home'
    });
    this.route('items', {
        path: '/items',
        layoutTemplate: 'layout',
        template: 'items'
    });
    this.route('sale_root', {
        path: '/sale',
        action: function () {
            alert('Endnu ikke implementeret')
            Router.go('sale', { type: 'postedSalesinvoices' });
        }
    });
    this.route('sale', {
        path: '/sale/:type',
        layoutTemplate: 'layout',
        action: function () {
            this.render(this.params.type)

        },
        data: function ()  {
            var items = [
                { name: 'Åbne fakturaer', path: 'openSalesinvoices'},
                { name: 'Bogførte fakturaer', path: 'postedSalesinvoices' },
                { name: 'Åbne kreditnota' },
                { name: 'Bogførte kreditnota' },
                { name: 'Tilbud' },
            ];
            items = determineActive(items, this.params.type, this.path);
            return {
                sidebarItems: items,
            };
        }
    });
    this.route('contacts', {
        path: '/contacts/:type',
        layoutTemplate: 'layout',
        action: function () {
            if (this.params.type === 'deptorsNoEmail') {
                Session.set('filter', { email: '' });
                this.render('deptors');
            }
            else{
                this.render(this.params.type);
            }
        },
        data: function ()  {
            var items = [
                { name: 'Debitorer', path: 'deptors'},
                { name: 'Kreditorer', path: 'creditors' },
                { name: 'Debitorer uden email', path: 'deptorsNoEmail' },
            ];
            items = determineActive(items, this.params.type, this.path);
            return {
                sidebarItems: items,
            };
        }
    });
    this.route('invoice', {
        path: '/sale/salesinvoices/:key',
        template: 'invoice',
        layoutTemplate: 'layout',
        before: function () {
            Session.set('key', this.params.key);
        }
    });
    this.route('bareInvoice', {
        path: '/sale/salesinvoices/bare/:key',
        layoutTemplate: 'invoiceLayout',
        template: 'invoice',
        before: function () {
            Session.set('key', this.params.key);
        }
    });
});
