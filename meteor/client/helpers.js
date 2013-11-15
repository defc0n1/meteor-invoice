Handlebars.registerHelper('countText', function () {
    var count = Session.get('itemCount');
    if (count < incrementSize) {
        return 'Viser alle';
    }
    else {
        var start = Session.get('skip') + 1;
        return 'Viser ' + start + ' til ' +
        Math.min((start + incrementSize - 1), count)  +
        ' af ' + count;
    }
});

Handlebars.registerHelper('showPrevious', function() {
    var disable = Session.equals('skip', 0);
    return disable ? 'disabled' : '';
});
Handlebars.registerHelper('showNext', function() {
    var disable = Session.get('skip') + incrementSize >= Session.get('itemCount');
    return disable ? 'disabled' : '';
});
