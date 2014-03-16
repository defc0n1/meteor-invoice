var createAndOpen = function (text, collection, route) {
    bootbox.prompt(text, function(result) {
        //TODO validate input
        if (result !== null) {
            var id = collection.insert({ key: result });
            //TODO catch duplicate key error
            var element = collection.findOne({ _id : id });
            Router.go('edit2', { type: route , key: result });
        }
    });

}
Template.sidebar.events = {
    'click .new-item': function (event) {
        createAndOpen('Varenummer', Items, 'items');
    },
    'click .new-deptor': function (event) {
        createAndOpen('Debitor nummer', Deptors, 'deptors');
    },
    'click .new-creditor': function (event) {
        createAndOpen('Kreditor nummer', Creditors, 'creditors');
    },
    'click .new-salesinvoice': function (event) {
        Meteor.call('GetNextSequence', 'salesinvoice',
                function (err, sequence) {
                    Router.go('edit', { type: Router.current().params.type, key: sequence });
                });
    },
};


Template.sidebar.items = function () {
    var key = Router.current().params.key;
    var sidebar = {
        items: [
            { name: 'Ny vare', path: '#', id: 'newItem', click: 'new-item' },
            { name: 'Varer', path: Router.routes.main.path({ root: 'items', type:  'items' }) },
            { name: 'Varegrupper', path: Router.routes.main.path({ root: 'items', type:  'itemGroups'  }) },
        ],
        contacts: [
            { name: 'Ny debitor', path: '#', id: 'newDeptor', click: 'new-deptor' },
            { name: 'Debitorer', path: Router.routes.main.path({ root: 'contacts', type:  'deptors' }) },
            { name: 'Ny kreditor', path: '#', id: 'newCreditor', click: 'new-creditor' },
            { name: 'Kreditorer', path: Router.routes.main.path({ root: 'contacts', type:  'creditors'  }) },
        ],
        purchase: [
            { name: 'Åbne fakturaer', path: Router.routes.main.path({ root: 'purchase', type:  'openPurchaseinvoices' }) },
            { name: 'Bogførte fakturaer', path: Router.routes.main.path({ root: 'purchase', type:  'postedPurchaseinvoices'  }) },
            { name: 'Åbne kreditnota', path: Router.routes.main.path({ root: 'purchase', type:  'openPurchasecreditnotas'  }) },
            { name: 'Bogførte kreditnota', path: Router.routes.main.path({ root: 'purchase', type:  'postedPurchasecreditnotas'  }) },
        ],
        sale: [
            { name: 'Ny faktura', path: '#', click: 'new-salesinvoice' },
            { name: 'Åbne fakturaer', path: Router.routes.main.path({ root: 'sale', type:  'openSalesinvoices' }) },
            { name: 'Bogførte fakturaer', path: Router.routes.main.path({ root: 'sale', type:  'postedSalesinvoices'  }) },
            { name: 'Ny kreditnota', path: Router.routes.main.path({ root: 'new', type:  'newSalesCreditnota' }) },
            { name: 'Åbne kreditnota', path: Router.routes.main.path({ root: 'sale', type:  'openSalescreditnotas'  }) },
            { name: 'Bogførte kreditnota', path: Router.routes.main.path({ root: 'sale', type:  'postedSalescreditnotas'  }) },
        ],
        entries: [
            { name: 'Konti', path: Router.routes.main.path({ root: 'entries', type:  'accounts'  }) },
            { name: 'Vare', path: Router.routes.main.path({ root: 'entries', type:  'itemEntries'  }) },
            { name: 'Kreditor', path: Router.routes.main.path({ root: 'entries', type:  'creditorEntries'  }) },
            { name: 'Debitor', path: Router.routes.main.path({ root: 'entries', type:  'deptorEntries'  }) },
            { name: 'Finans', path: Router.routes.main.path({ root: 'entries', type:  'financeEntries'  }) },
        ],
        edit: [
            { name: 'Bogfør', path: Router.routes.main.path({ root: 'sale', type:  'openSalesinvoices' }) },
            { name: 'Slet', path: Router.routes.main.path({ root: 'sale', type:  'postedSalesinvoices'  }) },
        ],
        //show: [
            //{ name: 'Vareposteringer', path: Router.routes.dynamic.path({ type: 'itemEntries', key: key }) },
            //{ name: 'Debitorposteringer', path: Router.routes.dynamic.path({ type: 'deptorEntries', key: key }) },
            //{ name: 'Finansposteringer', path: Router.routes.dynamic.path({ type: 'financeEntries', key: key }) },
        //],
    };
    var root = Router.current().params.root;
    var type = Router.current().params.type;
    var path = Router.current().path;
    return _.map(sidebar[root], function (item) {
        item.active = item.path === path ? 'active' : '';
        return item;
    });


};
