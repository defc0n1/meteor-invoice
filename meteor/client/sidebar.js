Template.sidebar.events = {
    'click .new-item': function (event) {
        var id = event.srcElement.id;
        var mapping = Mapping[id];
        mapping.create();
    },
};


Template.sidebar.items = function () {
    var sidebar = {
        items: [
            { name: 'Ny vare', path: '#', id: 'newItem', click: 'new-item' },
            { name: 'Varer', path: Router.routes.main.path({ root: 'items', type:  'items' }) },
            { name: 'Varegrupper', path: Router.routes.main.path({ root: 'items', type:  'itemGroups'  }) },
        ],
        contacts: [
            { name: 'Debitorer', path: Router.routes.main.path({ root: 'contacts', type:  'deptors' }) },
            { name: 'Kreditorer', path: Router.routes.main.path({ root: 'contacts', type:  'creditors'  }) },
        ],
        purchase: [
            { name: 'Åbne fakturaer', path: Router.routes.main.path({ root: 'purchase', type:  'openPurchaseinvoices' }) },
            { name: 'Bogførte fakturaer', path: Router.routes.main.path({ root: 'purchase', type:  'postedPurchaseinvoices'  }) },
            { name: 'Åbne kreditnota', path: Router.routes.main.path({ root: 'purchase', type:  'openPurchasecreditnotas'  }) },
            { name: 'Bogførte kreditnota', path: Router.routes.main.path({ root: 'purchase', type:  'postedPurchasecreditnotas'  }) },
        ],
        sale: [
            { name: 'Ny faktura', path: '#', id: 'newSalesinvoice', click: 'new-item', goto: Router.routes.main.path({ root: 'new', type:  'newSalesinvoice' }) },
            { name: 'Åbne fakturaer', path: Router.routes.main.path({ root: 'sale', type:  'openSalesinvoices' }) },
            { name: 'Bogførte fakturaer', path: Router.routes.main.path({ root: 'sale', type:  'postedSalesinvoices'  }) },
            { name: 'Ny kreditnota', path: Router.routes.main.path({ root: 'new', type:  'newSalesCreditnota' }) },
            { name: 'Åbne kreditnota', path: Router.routes.main.path({ root: 'sale', type:  'openSalescreditnotas'  }) },
            { name: 'Bogførte kreditnota', path: Router.routes.main.path({ root: 'sale', type:  'postedSalescreditnotas'  }) },
        ],
        entries: [
            { name: 'Vare', path: Router.routes.main.path({ root: 'entries', type:  'itemEntries'  }) },
            { name: 'Kreditor', path: Router.routes.main.path({ root: 'entries', type:  'creditorEntries'  }) },
            { name: 'Debitor', path: Router.routes.main.path({ root: 'entries', type:  'deptorEntries'  }) },
        ],
        edit: [
            { name: 'Bogfør', path: Router.routes.main.path({ root: 'sale', type:  'openSalesinvoices' }) },
            { name: 'Slet', path: Router.routes.main.path({ root: 'sale', type:  'postedSalesinvoices'  }) },
        ],
    };
    var root = Router.current().params.root;
    var type = Router.current().params.type;
    var path = Router.current().path;
    return _.map(sidebar[root], function (item) {
        item.active = item.path === path ? 'active' : '';
        return item;
    });


};
