var not_posted = { $or: [ { posting_date: { $exists: false } },
                { posting_date: null }, { posting_date: '' } ] };

var is_posted = { $and: [ { posting_date: { $exists: true } },
    { posting_date: { $nin:[null, ''] }} ] };

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
        collection: 'Sale',
        filter: { $and: [ { type: 'creditnota' }, is_posted ] },
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
        collection: 'Sale',
        filter: { $and: [ { type: 'invoice' }, is_posted ] },
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
                { icon: 'chevron-down', options: [
                    { text: 'Vareposteringer', mapping: 'itemEntries' },
                    { text: 'Debitorposteringer', mapping: 'deptorEntries' },
                    { text: 'Finansposteringer', mapping: 'financeEntries' },
                ] },
           ] },
        ],
    },
    openSalesinvoices: {
        collection: 'Sale',
        filter: { $and: [ { type: 'invoice' }, not_posted ] },
        singleView: 'openSalesinvoice',
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
    openSalescreditnotas: {
        collection: 'Sale',
        filter: { $and: [ { type: 'creditnota' }, not_posted ] },
        singleView: 'openSalescredinota',
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
    //postedPurchasecreditnotas: {
        //collection: 'PurchaseCreditnotas',
        //singleView: 'postedPurchasecreditnota',
        //table: [
            //{ header: 'Nummer', key: 'key' },
            //{ header: 'Leverendørnummer', key: 'supplier_number' },
            //{ header: 'Navn', key: 'name' },
            //{ header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            //{ header: 'Send', key: '', buttons: [
                //{ text: 'Vis', classes: 'show-button' },

           //] },
        //],
    //},
    //postedPurchaseinvoices: {
        //collection: 'PurchaseInvoices',
        //singleView: 'postedPurchaseinvoice',
        //table: [
            //{ header: 'Nummer', key: 'key' },
            //{ header: 'Leverendørnummer', key: 'supplier_number' },
            //{ header: 'Navn', key: 'name' },
            //{ header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            //{ header: 'Send', key: '', buttons: [
                //{ text: 'Vis', classes: ['show-button'] },

           //] },
        //],
    //},
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
                { icon: 'wrench', classes: 'table-edit-element-button' },
                { text: 'Kontokort', classes: 'account-deptor-button' },
                { text: 'Statistik', classes: 'deptor-statistics-button' },
                ] },
        ],
        modalFields: [ { name: 'Nummer', key: 'key'},
        { name: 'Navn', key: 'name'},
        { name: 'Emails bogholderi', key: 'primary_emails', list: true, classes: 'list-group' },
        { name: 'Emails information', key: 'secondary_emails', list: true, classes: 'list-group' },
        { name: 'Telefon', key: 'phone'},
        { name: 'Fax', key: 'fax'},
        { name: 'Adresse', key: 'address'},
        { name: 'By', key: 'city'},
        { name: 'Postnummer', key: 'zip'},
        { name: 'Att.', key: 'attention'},
        { name: 'GLN-nummer', key: 'gln'},
        { name: 'GLN-gruppe', key: 'gln_group', dropdown: true, classes: 'gln-group-select', content: [
            { value: '', name: 'Ikke EDI'},
            { value: 'supergros', name: 'Super Gross'},
            { value: 'dansksupermarked', name: 'Dansk Supermarked'}
        ]
        },
        ],
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
                { icon: 'wrench', classes: 'table-edit-element-button' },
                { text: 'Kontokort', classes: 'account-creditor-button' },
                { text: 'Statistik', classes: 'creditor-statistics-button' },
                ] },
        ],
        modalFields: [ { name: 'Nummer', key: 'key'},
        { name: 'Navn', key: 'name'},
        { name: 'Emails bogholderi', key: 'primary_emails'},
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
            { header: 'Beholdning', key: 'in_stock' },
            { header: '', key: '', buttons: [
                { icon: 'wrench', classes: 'table-edit-element-button' },
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
        { name: 'GLN nummer', key: 'gln_number'},
        { name: 'Beholdning', key: 'quantity'},
        { name: 'Billede:', key: 'key', src: 'http://ettienne.webfactional.com/media/billeder/small/', image: true},
        ]
    },
    financeEntries: {
        collection: 'FinanceEntries',
        table: [
            { header: 'Type', key: 'type' },
            { header: 'Beløb', key: 'amount', formatter: 'GetPrice' },
            { header: 'Løbenummer', key: 'key' },
            { header: 'Kontonummer', key: 'account_number' },
            { header: 'Modkonto', key: 'offsetting_account' },
            { header: 'BilagsNr', key: 'record_number' },
            { header: 'Dato', key: 'date', formatter: 'GetDate' },
            { header: '', key: '', buttons: [
                { icon: 'wrench', classes: 'show-item-button' },
           ] },
        ],
    },
    //creditorEntries: {
        //collection: 'CreditorEntries',
        ////class: 'modal-edit',
        //views: {
            //'Faktura': {
                //path: 'postedPurchaseinvoice',
                //method: 'getInvoiceKeyByRecordNumber'
            //},
            //'Kreditnota': {
                //path: 'postedPurchasecreditnota',
                //method: 'getCreditnotaKeyByRecordNumber'
            //}
        //},
        //table: [
            //{ header: 'Type', key: 'type' },
            //{ header: 'Beløb', key: 'amount', formatter: 'GetPrice' },
            //{ header: 'Løbenummer', key: 'key' },
            //{ header: 'Kreditor', key: 'creditor_number' },
            //{ header: 'BilagsNr', key: 'record_number', isLink: true },
            //{ header: 'Bogf.gr', key: 'posting_group' },
            //{ header: 'Dato', key: 'date', formatter: 'GetDate' },
            //{ header: '', key: '', buttons: [
                //{ icon: 'wrench', classes: 'show-item-button' },
           //] },
        //],
    //},
    itemEntries: {
        collection: 'ItemEntries',
        //class: 'modal-edit',
        table: [
            { header: 'Løbenummer', key: 'key' },
            { header: 'Varenummer', key: 'item_number' },
            { header: 'Antal', key: 'quantity' },
            { header: 'Type', key: 'type' },
            { header: 'Pris', key: 'item_price', formatter: 'GetPrice' },
            { header: 'Pris total', key: 'total_price', formatter: 'GetPrice' },
            { header: 'Dato', key: 'date', formatter: 'GetDate' },
            { header: 'BilagsNr', key: 'record_number', link: { method: 'BuildLink', props: {
                                                                                      root: 'show/',
                                                                                      key: 'type',
                                                                                      map: {
                                                                                          Salg: 'postedSalesinvoice/',
                                                                                          //TODO: find the other types in here
                                                                                          creditnota:' postedSalescreditnota/'
                                                                                      }
                                                                                  },
                                                    }
            },
        ],
    },
    deptorEntries: {
        collection: 'Sale',
        filter: { sort: { entry_number: -1 } },
        views: {
            'invoice': {
                path: 'postedSalesinvoice'
            },
            'creditnota': {
                path: 'postedSalescreditnota'
            }
        },
        table: [
            { header: 'Beløb', key: 'amount', formatter: 'GetPrice' },
            { header: 'Løbenummer', key: 'entry_number' },
            { header: 'Debitor', key: 'deptor_number', link: { method: 'BuildLink', props: { root: 'edit2/deptors/' } } },
            { header: 'Kunde', key: 'customer_number', link: { method: 'BuildLink', props: { root: 'edit2/deptors/'} } },
            { header: 'BilagsNr', key: 'key', link: { method: 'BuildLink', props: {
                                                                                      root: 'show/',
                                                                                      key: 'type',
                                                                                      map: {
                                                                                          invoice: 'postedSalesinvoice/',
                                                                                          creditnota:' postedSalescreditnota/'
                                                                                      }
                                                                                  },
                                                    }
            },
            { header: 'Bogf.Gr.', key: 'posting_group' },
            { header: 'Dato', key: 'posting_date', formatter: 'GetDate' },
        ],
    },
    accounts: {
        collection: 'TradeAccounts',
        //class: 'modal-edit',
        table: [
            { header: 'Nummer', key: 'key' },
            { header: 'Navn', key: 'name' },
            { header: 'Type', key: 'type' },
            { header: 'Art', key: 'art' },
            { header: 'Moms kode', key: 'tax_code' },
            //{ header: 'Debitor', key: 'deptor_number' },
            //{ header: 'BilagsNr', key: 'record_number', link: true },
            //{ header: 'Dato', key: 'date', formatter: 'GetDate' },
            //{ header: '', key: '', buttons: [
                //{ icon: 'wrench', classes: 'show-item-button' },
           //] },
        ],
    },
    newSalesinvoice: {
        modalText: 'Salgsfakturanummer',
        collection: 'Sale',
        headerFields: [
            { header: 'Fakturanummer', key: 'key', fixed: true }, // fixed means non-editable
            { header: 'Kundenummer', key: 'customer_number', from: 'key' },
            { header: 'Navn', key: 'name', from: 'name' },
        ],
    },
};
