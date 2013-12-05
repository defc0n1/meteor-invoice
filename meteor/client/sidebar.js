Template.sidebar.items = function (route) {
    var sidebar = {
        items: [
            { name: 'Ny vare', path: Router.routes.main.path({ root: 'items', type:  'newItem' }) },
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
            { name: 'Ny faktura', path: Router.routes.main.path({ root: 'sale', type:  'newSalesinvoice' }) },
            { name: 'Åbne fakturaer', path: Router.routes.main.path({ root: 'sale', type:  'openSalesinvoices' }) },
            { name: 'Bogførte fakturaer', path: Router.routes.main.path({ root: 'sale', type:  'postedSalesinvoices'  }) },
            { name: 'Ny kreditnota', path: Router.routes.main.path({ root: 'sale', type:  'newSalesCreditnota' }) },
            { name: 'Åbne kreditnota', path: Router.routes.main.path({ root: 'sale', type:  'openSalescreditnotas'  }) },
            { name: 'Bogførte kreditnota', path: Router.routes.main.path({ root: 'sale', type:  'postedSalescreditnotas'  }) },
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
