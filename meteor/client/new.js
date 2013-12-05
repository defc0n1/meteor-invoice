
//Template.new.created = function () {
//Deps.autorun(function () {
    //var elem = Session.get('element');
    ////console.log(elem, this);
    ////$('#customer_number').editable('setValue', elem.key, true);

//});
//};
Template.new.rendered = function () {
    Session.set('type', Mapping['newSalesinvoice']);
    Session.setDefault('element', {});
    $("#deptor-select").select2({
        placeholder: 'Kundenummer eller navn',
        minimumInputLength: 3,
        containerCss: { width: '600px' },
        query: function (query) {
            Meteor.call('DeptorsSearch', query.term, function (err, res) {
                var vals = [];
                res.forEach( function (v) {
                    var text = v.key + ', ' + v.name + ', ' + v.address + ', ' + v.city + ', ' + v.phone;
                    vals.push({text: text, id: v.key, data: v});
                });
                query.callback({ results: vals });
            });
        },
    });
    $("#deptor-select").on('change', function (val) {
        props = val.added.data;
        var elem = Session.get('element');
        elem.address = props.address;
        elem.customer_number = props.key;
        $('#customer_number').editable('setValue', props.key, true);
        //Session.set('element', elem);
        console.log('test');
    });
    $.fn.editable.defaults.mode = 'inline';
    $('.new-edit-field').editable({
        emptytext: 'Indtast værdi',
        //success: function(response, newValue) {
            //var update = {};
            //var field = $(this).attr('id');

            //if (field === 'key') {
                //Messages.insert({ message: 'Nøglen kan ikke ændres på nuværende tidspunkt.' });
                //return;
            //}
            //update[field] = newValue;
            //var selected = Session.get('selected');
            //var res = Deptors.update({ _id: selected._id }, { $set: update }, function (err, msg) {
                //console.log(err, msg);
                //if (err) {
                    //var selector = '#' + field;
                    //$(selector).editable('setValue', selected[field] , true);
                    //Messages.insert({ message: 'Nøgle eksisterer allerede' });
                //}
            //});
            //return 'test2';
        //},
        //display: function (value) {

            //var formatter = $(this).attr('data-formatter');
            //if (formatter) {
                //var func = window[formatter];
                //$(this).html(func(value));
            //}
        //},
        error: function(msg) {
            console.log(msg);
            return msg;
        }
    });

};

