Counters = new Meteor.Collection('counters');
SalesInvoices = new Meteor.Collection('salesinvoices');
SalesCreditnotas = new Meteor.Collection('salescreditnotas');
PurchaseInvoices = new Meteor.Collection('purchaseinvoices');
PurchaseCreditnotas = new Meteor.Collection('purchasecreditnotas');
Deptors = new Meteor.Collection('deptors');
Creditors = new Meteor.Collection('creditors');
Alerts = new Meteor.Collection('alerts');
TradeAccounts = new Meteor.Collection('accounts');
Items = new Meteor.Collection('items');
ItemEntries = new Meteor.Collection('itementries');
CreditorEntries = new Meteor.Collection('creditorentries');
DeptorEntries = new Meteor.Collection('deptorentries');
FinanceEntries = new Meteor.Collection('financeentries');

GetCurrentCollection = function (capitalize) {
    var typeName = Router.current().params.type;
    var capString = typeName.charAt(0).toUpperCase() + typeName.slice(1);
    return window[capString]; 
};

GetCurrentMapping = function () {
    return Mapping[Router.current().params.type];
};
GetCurrentKey = function () {
    return Router.current().params.key;
};
GetCurrentType = function () {
    return Router.current().params.type;
};

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
            var caller_line = (new Error).stack.split("\n")[4]
            var now = moment().format('DD-MM-YY HH:mm:ss');
            var message = '';
            _.each(args, function (m, i) {
                message += JSON.stringify(m) + ' ';
            });
            console.log(level, ':', now, message, caller_line);
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

