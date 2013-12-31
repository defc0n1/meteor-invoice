Mapping = {
    postedPurchaseinvoice: {
        getSingle: 'getPurchaseInvoice',
        view: 'postedSalesinvoice',
        text: {
            date: 'Fakturadato:',
            typeNumber: 'Købsfakturanr.:',
        },
    },
    postedPurchasecreditnota: {
        getSingle: 'getPurchaseCreditnota',
        view:'posted',
        text: {
            date: 'Kreditnotadato:',
            typeNumber: 'Købsreditnotanr.:',
        },
    },
    postedSalesinvoice: {
        getSingle: 'getSalesInvoice',
        view: 'postedSalesinvoice',
        showCustInfo: true,
        text: {
            date: 'Fakturadato:',
            typeNumber: 'Fakturanr.:',
        },
    },
    postedSalescreditnota: {
        getSingle: 'getSalesCreditnota',
        view:'posted',
        showCustInfo: true,
        text: {
            date: 'Kreditnotadato:',
            typeNumber: 'Kreditnotanr.:',
        },
    },
    postedSalescreditnotas: {
        collection: 'SalesCreditnotas',
        singleView: 'postedSalescreditnota',
        table: [
            { header: 'Nummer', key: 'key' },
            { header: 'Kundenummer', key: 'customer_number' },
            { header: 'Navn', key: 'name' },
            { header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            { header: 'Send', key: '', buttons: [
                { text: 'Edi', key: 'amqp' , classes:'edi-button' },
                { icon: 'envelope', key: 'mail' , classes:'email-button'  },
                { text: 'Vis', classes: 'show-button' },

           ] },
        ],
    },
    postedSalesinvoices: {
        collection: 'SalesInvoices',
        subCollection: 'PostedSalesInvoices',
        filter: { $or: [ { posting_date: { $exists: true } } ] }, 
        singleView: 'postedSalesinvoice',
        table: [
            { header: 'Nummer', key: 'key' },
            { header: 'Kundenummer', key: 'customer_number' },
            { header: 'Navn', key: 'name' },
            { header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            { header: 'Send', key: '', buttons: [
                { text: 'Edi', key: 'amqp' , classes:'edi-button' },
                { icon: 'envelope', key: 'mail' , classes:'email-button'  },
                { text: 'Vis', classes: ['show-button'] },

           ] },
        ],
    },
    openSalesinvoices: {
        collection: 'SalesInvoices',
        subCollection: 'OpenSalesInvoices',
        singleView: 'openSalesinvoice',
        filter: { $or: [ { posting_date: { $exists: false } }, 
            { posting_date: null }, { posting_date: '' } ] },
        table: [
            { header: 'Nummer', key: 'key' },
            { header: 'Kundenummer', key: 'customer_number' },
            { header: 'Navn', key: 'name' },
            { header: 'Rediger', key: '', buttons: [
                { text: 'Bogfør', classes: '' },
                { icon: 'wrench', classes: 'edit-button' },
                { icon: 'remove', classes: 'delete-button' },
           ] },
        ],
    },
    postedPurchasecreditnotas: {
        collection: 'PurchaseCreditnotas',
        singleView: 'postedPurchasecreditnota',
        table: [
            { header: 'Nummer', key: 'key' },
            { header: 'Leverendørnummer', key: 'supplier_number' },
            { header: 'Navn', key: 'name' },
            { header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            { header: 'Send', key: '', buttons: [
                { text: 'Vis', classes: 'show-button' },

           ] },
        ],
    },
    postedPurchaseinvoices: {
        collection: 'PurchaseInvoices',
        singleView: 'postedPurchaseinvoice',
        table: [
            { header: 'Nummer', key: 'key' },
            { header: 'Leverendørnummer', key: 'supplier_number' },
            { header: 'Navn', key: 'name' },
            { header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            { header: 'Send', key: '', buttons: [
                { text: 'Vis', classes: ['show-button'] },

           ] },
        ],
    },
    deptors: {
        collection: 'Deptors',
        class: 'modal-edit',
        table: [
            { header: 'Nummer', key: 'key' },
            { header: 'Navn', key: 'name', formatter: 'Shorten' },
            { header: 'Adresse', key: 'address' },
            { header: 'By', key: 'zip' },
            { header: 'Saldo', key: '' },
            { header: '', key: '', buttons: [
                { icon: 'wrench', classes: 'show-deptor-button' },
                { text: 'Kontokort', classes: 'account-deptor-button' },
                { text: 'Statistik', classes: 'deptor-statistics-button' },
                ] },
        ],
        modalFields: [ { name: 'Nummer', key: 'key'},
        { name: 'Navn', key: 'name'},
        { name: 'Email', key: 'email'},
        { name: 'Telefon', key: 'phone'},
        { name: 'Fax', key: 'fax'},
        { name: 'Adresse', key: 'address'},
        { name: 'By', key: 'city'},
        { name: 'Postnummer', key: 'zip'},
        { name: 'Att.', key: 'attention'} ],
    },
    creditors: {
        collection: 'Creditors',
        class: 'modal-edit',
        table: [
            { header: 'Nummer', key: 'key' },
            { header: 'Navn', key: 'name', formatter: 'Shorten' },
            { header: 'Adresse', key: 'address' },
            { header: 'By', key: 'zip' },
            { header: 'Saldo', key: '' },
            { header: '', key: '', buttons: [
                { icon: 'wrench', classes: 'show-creditor-button' },
                { text: 'Kontokort', classes: 'account-creditor-button' },
                { text: 'Statistik', classes: 'creditor-statistics-button' },
                ] },
        ],
        modalFields: [ { name: 'Nummer', key: 'key'},
        { name: 'Navn', key: 'name'},
        { name: 'Email', key: 'email'},
        { name: 'Telefon', key: 'phone'},
        { name: 'Fax', key: 'fax'},
        { name: 'Adresse', key: 'address'},
        { name: 'By', key: 'city'},
        { name: 'Postnummer', key: 'zip'},
        { name: 'Att.', key: 'attention'} ],
    },
    items: {
        collection: 'Items',
        //class: 'modal-edit',
        table: [
            { header: 'Nummer', key: 'key' },
            { header: 'Navn', key: 'name' },
            { header: 'Gruppe', key: 'group' },
            { header: 'Kostpris', key: 'cost_price', formatter: 'GetPrice' },
            { header: 'Salgspris', key: 'price', formatter: 'GetPrice' },
            { header: 'Beholdning', key: 'quantity' },
            { header: '', key: '', buttons: [
                { icon: 'wrench', classes: 'show-item-button' },
                { text: 'Statistik', classes: 'item-statistics-button' },
           ] },
        ],
        modalFields: [
        { name: 'Nummer', key: 'key' },
        { name: 'Navn', key: 'name'},
        { name: 'Gruppe', key: 'group'},
        { name: 'Kostpris', key: 'cost_price', formatter: 'GetPrice' },
        { name: 'Salgspris', key: 'price', formatter: 'GetPrice' },
        { name: 'Salgspris 1', key: 'price_1', formatter: 'GetPrice' },
        { name: 'Salgspris 2', key: 'price_2', formatter: 'GetPrice' },
        { name: 'Salgspris 3', key: 'price_3', formatter: 'GetPrice' },
        { name: 'Salgspris 4', key: 'price_4', formatter: 'GetPrice' },
        { name: 'Inderkolli', key: 'inner_box'},
        { name: 'Yderkolli', key: 'outer_box'},
        { name: 'EAN', key: 'ean'},
        { name: 'Beholdning', key: 'quantity'},
        ]
    },
    newSalesinvoice: {
        modalText: 'Salgsfakturanummer',
        headerFields: [
            { header: 'Fakturanummer', key: 'key', fixed: true }, // fixed means non-editable
            { header: 'Kundenummer', key: 'customer_number', from: 'key' },
            { header: 'Navn', key: 'name', from: 'name' },
            { header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
        ],
        lineFields: [
            { from: 'quantity', key: 'quantity' },
            { from: 'name', key: 'info' },
            { from: 'key', key: 'item_number' },
            { from: 'price', key: 'price', formatter: 'GetPrice' },
        ],
        create: function () {
            Meteor.call('GetNextSequence', 'salesinvoice', 
                    function (err, sequence) {
                        Router.go('edit', { type: Router.current().params.type, key: sequence });
                    });
        }
    },
    get newItem () {
        return {
            new: true,
            modalText: 'Varenummer',
            collection: 'Items',
            background: this.items,
            modalFields: this.items.modalFields,
            create: function (key) {


        bootbox.prompt(mapping.modalText, function(result) {
            if (result === null) {
                // pass
            } else {
                //create element and move to it's page
            }
        });
                var id = Items.insert({ key: key });
                var element = Items.findOne({ _id : id });
                Session.set('selected', element);
                Session.set('showModal', true);
                $('#myModal').modal({});
            },
        }
    }
};
