Template.new.created = function () {

};

Template.new.rendered = function () {
    Session.set('type', Mapping['newSalesinvoice']);
    // SalesInvoices.upsert( {_id: 99999}, {$set: { lines: [] } } );
    SalesInvoices.upsert( {_id: 99999}, { $set: { lines: [] } }, function(err, res) {
        if(err){throw err};
        console.log(res);
    });    
    var elem = SalesInvoices.findOne( {_id: 99999} );
    Session.set('element', elem);

    var query = SalesInvoices.find( {_id: 99999} );
    var handle = query.observeChanges({changed: function(id, fields) {
        console.log(id, fields);
    }});

    // Deps.autorun(function() {
    //     var elem = Session.get('element');
    //     console.log(elem);

    //     if (elem.lines) {
    //         console.log('something');
    //         elem.lines.forEach(function(item, index) {
    //             $('#info-' + index).editable('setValue', item.info);
    //             $('#info-' + index).editable('setValue', item.info);
    //         });
    //     }
    // });

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

    $("#item-select").select2({
        placeholder: 'Varenummer eller navn',
        minimumInputLength: 3,
        containerCss: { width: '600px' },
        query: function (query) {
            console.log('something');
            Meteor.call('ItemsSearch', query.term, function (err, res) {
                console.log(res);
                var vals = [];
                res.forEach( function (v) {
                    var text = v.key + ', ' + v.name + ', ' + v.cost_price + ', ' + v.group + ', ' + v.ean;
                    vals.push({text: text, id: v.key, data: v});
                });
                query.callback({ results: vals });
            });
        },
    });

    if (!Template.new.attached) {
        Template.new.attached = true;


        $("#deptor-select").on('change', function (val) {
            props = val.added.data;
            var elem = Session.get('element');
            elem.address = props.address;
            elem.customer_number = props.key;
            $('#customer_number').editable('setValue', props.key, true);
        });
        
        $("#item-select").on('change', function (val) {
            props = val.added.data;
            var elem = Session.get('element');

            if (!elem.lines) {
                elem.lines = [];
            }

            var update = {
                quantity: 1,
                info: props.name,
                item_number: props.key,
                price: props.price
            };

            Session.set('element', elem);

            var res = SalesInvoices.update({ _id: 99999 }, { $push: { lines: update } }, function (err, msg) {
                console.log(err, msg);
            });
        });
    }

    $.fn.editable.defaults.mode = 'inline';

    $('.new-edit-field').editable({
        emptytext: 'Indtast værdi',
        success: function(response, newValue) {
            var elem = Session.get('element');
            var update = {};
            var field = $(this).attr('id');

            var parts = field.split('-');
            var key = parts[0];
            var id = parts[1];

            if (field === 'key') {
                Messages.insert({ message: 'Nøglen kan ikke ændres på nuværende tidspunkt.' });
                return;
            }
            elem.lines[id][key] = newValue;
            update[field] = newValue;

            console.log(elem.lines[id][key]);

            Session.set('element', elem);

            var res = SalesInvoices.update({ _id: 99999 }, { $set: update }, function (err, msg) {
                console.log(err, msg);
                if (err) {
                    var selector = '#' + field;
                    $(selector).editable('setValue', selected[field] , true);
                    Messages.insert({ message: 'Nøgle eksisterer allerede' });
                }
            });
        },
    });

};