SalesInvoices = new Meteor.Collection('salesinvoices');
SalesCreditnotas = new Meteor.Collection('salescreditnotas');
PurchaseInvoices = new Meteor.Collection('purchaseinvoices');
PurchaseCreditnotas = new Meteor.Collection('purchasecreditnotas');
Deptors = new Meteor.Collection('deptors');
Creditors = new Meteor.Collection('creditors');
Alerts = new Meteor.Collection('alerts');
Items = new Meteor.Collection('items');
ItemEntries = new Meteor.Collection('itementries');
CreditorEntries = new Meteor.Collection('creditorentries');
DeptorEntries = new Meteor.Collection('deptorentries');

GetDate = function (date) {
    if (date) {
        return moment(date).format('DD MMM YYYY');
    }
    else{
        return '';
    }
};
GetPrice = function (amount) {
        if(isNaN(amount)){
            var a = 0;
            return a.toFixed(2) ;
        }
        amount = amount/100;
        amount = amount.toFixed(2);
        //if(amount.length === 2){
        //return '00.' + amount;
        //}
    //var money = amount.substring(0, amount.length-2) + '.' + amount.substring(amount.length-2, amount.length);
    //return money;
        amount = amount + '';
        amount = amount.replace('.', ',');
        var val = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
        return val;
};


Mappeing = {}
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
            { header: 'Fakturanummer', key: 'key' },
            { header: 'Kundenummer', key: 'customer_number' },
            { header: 'Navn', key: 'name' },
            { header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            { header: 'Send', key: '', buttons: [
                { text: 'Edi', key: 'amqp' , classes:'edi-button' },
                { text: 'Mail', key: 'mail' , classes:'email-button'  },
                { text: 'Vis', classes: 'show-button' },

           ] },
            { header: '', key: '' },
        ],
    },
    postedSalesinvoices: {
        collection: 'SalesInvoices',
        singleView: 'postedSalesinvoice',
        table: [
            { header: 'Fakturanummer', key: 'key' },
            { header: 'Kundenummer', key: 'customer_number' },
            { header: 'Navn', key: 'name' },
            { header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            { header: 'Send', key: '', buttons: [
                { text: 'Edi', key: 'amqp' , classes:'edi-button' },
                { text: 'Mail', key: 'mail' , classes:'email-button'  },
                { text: 'Vis', classes: ['show-button'] },

           ] },
            { header: '', key: '' },
        ],
    },
    postedPurchasecreditnotas: {
        collection: 'PurchaseCreditnotas',
        singleView: 'postedPurchasecreditnota',
        table: [
            { header: 'Fakturanummer', key: 'key' },
            { header: 'Leverendørnummer', key: 'supplier_number' },
            { header: 'Navn', key: 'name' },
            { header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            { header: 'Send', key: '', buttons: [
                { text: 'Vis', classes: 'show-button' },

           ] },
            { header: '', key: '' },
        ],
    },
    postedPurchaseinvoices: {
        collection: 'PurchaseInvoices',
        singleView: 'postedPurchaseinvoice',
        table: [
            { header: 'Fakturanummer', key: 'key' },
            { header: 'Leverendørnummer', key: 'supplier_number' },
            { header: 'Navn', key: 'name' },
            { header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            { header: 'Send', key: '', buttons: [
                { text: 'Vis', classes: ['show-button'] },

           ] },
            { header: '', key: '' },
        ],
    },
    deptors: {
        collection: 'Deptors',
        class: 'modal-edit',
        table: [
            { header: 'Debitornummer', key: 'key' },
            { header: 'Navn', key: 'name' },
            { header: 'Adresse', key: 'address' },
            { header: 'By', key: 'zip' },
            { header: 'Saldo', key: '' },
            { header: '', key: '', buttons: [
                { text: 'Rediger', classes: 'show-deptor-button' },
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
            { header: 'Kreditornummer', key: 'key' },
            { header: 'Navn', key: 'name' },
            { header: 'Adresse', key: 'address' },
            { header: 'By', key: 'zip' },
            { header: 'Saldo', key: '' },
            { header: '', key: '', buttons: [
                { text: 'Rediger', classes: 'show-creditor-button' },
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
            { header: 'Varenummer', key: 'key' },
            { header: 'Navn', key: 'name' },
            { header: 'Gruppe', key: 'group' },
            { header: 'Kostpris', key: 'cost_price', formatter: 'GetPrice' },
            { header: 'Salgspris', key: 'price', formatter: 'GetPrice' },
            { header: 'Beholdning', key: 'quantity' },
            { header: '', key: '', buttons: [
                { text: 'Rediger', classes: 'show-item-button' },
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
        headerFields: [
            { header: 'Fakturanummer', key: 'key' },
            { header: 'Kundenummer', key: 'customer_number', from: 'key' },
            { header: 'Navn', key: 'name', from: 'name' },
            { header: 'Bogf. dato', key: 'posting_date', formatter: 'GetDate' },
            ]

    },
    get newItem () {
        return {
            new: true,
            collection: 'Items',
            background: this.items,
            modalFields: this.items.modalFields,
        }
    }
};
// these settings makes the stuff fit on the pdf conversion
lpp = 30;
lfirst = 18;
llast = 23;

Print = {
    totalPages: function (nLines) {
        var pages = 1;
        for(var i = 1; i <= nLines; i++) {
            if (i > lfirst +  lpp * (pages -  1)) {
                pages += 1;
            }
        };
        return pages;
    },
};

log = {
    log: function (level, args) {
            var now = moment().format('DD-MM-YY HH:mm:ss');
            var message = '';
            _.each(args, function (m, i) {
                message += JSON.stringify(m) + ' ';
            });
            console.log(level, ':', now, message);
        }
}
log.info = function () {
    log.log('INFO   ', arguments);
}
log.debug = function () {
    log.log('DEBUG  ', arguments);
}
log.error = function () {
    log.log('ERROR  ', arguments);
}
log.warning = function () {
    log.log('WARNING', arguments);
}

