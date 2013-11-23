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
                Router.go('index');
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
    this.route('index', {
        path: '/',
        layoutTemplate: 'layout',
        template: 'index'
    });
    this.route('items', {
        path: '/items/:type',
        layoutTemplate: 'layout',
        template: 'items',
        data: function ()  {
            var items = [
                { name: 'Varer', path: 'items'},
                { name: 'Varegrupper', path: 'itemGroups' },
            ];
            items = determineActive(items, this.params.type, this.path);
            return {
                sidebarItems: items,
            };
        },
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
            this.render(this.params.type);
        },
        data: function ()  {
            var items = [
                { name: 'Åbne fakturaer', path: 'openSalesinvoices'},
                { name: 'Bogførte fakturaer', path: 'postedSalesinvoices' },
                { name: 'Åbne kreditnota', path: 'openSalescreditnotas' },
                { name: 'Bogførte kreditnota', path: 'postedSalescreditnotas' },
            ];
            items = determineActive(items, this.params.type, this.path);
            return {
                sidebarItems: items,
            };
        }
    });
    this.route('purchase', {
        path: '/purchase/:type',
        layoutTemplate: 'layout',
        action: function () {
            this.render(this.params.type);
        },
        data: function ()  {
            var items = [
                { name: 'Åbne fakturaer', path: 'openPurchaseinvoices'},
                { name: 'Bogførte fakturaer', path: 'postedPurchaseinvoices' },
                { name: 'Åbne kreditnota', path: 'openPurchasecreditnotas' },
                { name: 'Bogførte kreditnota', path: 'postedPurchasecreditnotas' },
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
            this.render(this.params.type);
        },
        data: function ()  {
            var items = [
                { name: 'Debitorer', path: 'deptors'},
                { name: 'Kreditorer', path: 'creditors' },
            ];
            items = determineActive(items, this.params.type, this.path);
            return {
                sidebarItems: items,
            };
        }
    });
    this.route('show', {
        path: '/show/:type/:key',
        layoutTemplate: 'layout',
        action: function () {
            this.render(this.params.type);
        },
        before: function () {
            Session.set('key', this.params.key);
        }
    });
    this.route('bareInvoice', {
        path: '/sale/salesinvoices/bare/:key',
        layoutTemplate: 'invoiceLayout',
        template: 'postedSalesinvoice',
        before: function () {
            Session.set('key', this.params.key);
        }
    });
});
