Template.new.created = function () {
    //Hack to ensure that we do not re
    Template.new.attached = false;
};

Template.new.newitem = function () {
    return Sale.findOne({ key: parseInt(Router.current().params.key ) });
};
Template.new.total = function () {
    var elem = Sale.findOne({ key: parseInt(Router.current().params.key ) });
    var total = 0;
    elem.lines.forEach(function (line) {
        total += line.price * line.quantity;
    });
    return total;
};
Template.new.rendered = function () {
    //Session.set('type', Mapping['newSalesinvoice']);
    var elem = Sale.findOne({ key: parseInt(Router.current().params.key) });
    Session.set('element', elem);
    // attach an observed handler and update the
    // editable value on change
    var query = Sale.find({ key: parseInt(Router.current().params.key) });
    var handle = query.observeChanges({changed: function(id, fields) {
        _.each(fields, function (v, k) {
            // go through every item line in case that property has changed
            if (k === 'lines') {
                _.each(fields.lines, function (line, index) {
                    // update each property of the line
                    _.each(line, function (value, key) {
                        $('#' + key + '-' + index).editable('setValue', value);
                    });
                });
            }
            else {
                $('#' + k).editable('setValue', v);
            }
        });

    }});

    $("#deptor-select").select2({
        placeholder: 'Kundenummer eller navn',
        minimumInputLength: 3,
        containerCss: { width: '600px' },
        query: function (query) {
            Meteor.call('DeptorsSearch', query.term, function (err, res) {
                var vals = [];
                res.forEach(function (v) {
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
            Meteor.call('ItemsSearch', query.term, function (err, res) {
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
            var type = Session.get('type');
            var elem = Session.get('element');
            props = val.added.data;

            var update = {};
            _.each(type.headerFields, function (map) {
                if (!map.fixed) {
                    update[map.key] = props[map.from];
                }
            });
            var res = Sale.update({ _id: elem._id }, { $set: update });
            $("#deptor-select").select2('val', undefined);
        });

        $("#item-select").on('change', function (val) {
            props = val.added.data;
            var elem = Session.get('element');
            var duplicate = _.any(elem.lines, function(line){
                return line.item_number == props.key;
            });
            if(duplicate){
                bootbox.alert('Dette varenummer er allerede tilføjet');
            }
            else{
                var update = {
                    quantity: 1,
                    info: props.name,
                    item_number: props.key,
                    price: props.price
                };
                var res = Sale.update({ _id: elem._id }, { $push: { lines: update } }, function (err, msg) {
                    console.log(err, msg);
                });
            }
            $("#item-select").select2('val', undefined);
        });
    }

    $.fn.editable.defaults.mode = 'inline';

    $('.new-edit-field').editable({
        emptytext: 'Indtast værdi',
        success: function(response, newValue) {
            var elem = Session.get('element');
            var field = $(this).attr('id');

            var parts = field.split('-');
            var key = parts[0];
            var index = parts[1];

            var newLine = elem.lines[index];
            newLine[key] = newValue;
            elem.lines.splice(index, 1, newLine);

            var update = {lines: elem.lines};
            console.log(update);


            var res = Sale.update({ _id: elem._id }, { $set: update }, function (err, msg) {
                console.log(err, msg);
                if (err) {
                    console.log(err);
                    //var selector = '#' + field;
                    //$(selector).editable('setValue', selected[field] , true);
                    //Messages.insert({ message: 'Nøgle eksisterer allerede' });
                }
                //if (forceReload){$('#main-content').html(Meteor.render(Template.editelement));}

            });
        },
        display: function (value) {
            var formatter = $(this).attr('data-formatter');
            // call the formatter function if defined
            if (formatter) {
                var func = window[formatter];
                $(this).html(func(value));
            }
            //ootherwise, just insert the new value
            else{
                $(this).html(value);
            }
        },
    });

};
Template.new.events({
    'click .remove-list-item': function(event) {
        console.log(this)
        var selected = Session.get('element');
        var list = selected.lines;
        list.splice(this.index, 1);
        var update = {lines: list};
        Sale.update({ _id: selected._id }, { $set: update }, function (err, msg) {
            console.log(err, msg);
            if (err) {
                console.log(err);
                //var selector = '#' + field;
                //$(selector).editable('setValue', selected[field] , true);
                //Messages.insert({ message: 'Nøgle eksisterer allerede' });
            }
        });
        //$('#main-content').html(Meteor.render(Template.editelement));
    },
})
