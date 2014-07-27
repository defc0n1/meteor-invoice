'use strict';
Template.newlistitem.rendered = function () {
    $.fn.editable.defaults.mode = 'inline';

    $('.new-edit-field').editable({
        emptytext: 'Indtast værdi',
        success: function(response, newValue) {
            var field = $(this).attr('id');
            var elem = Sale.findOne({ key: parseInt(Router.current().params.key ) });
            var parts = field.split('-');
            var key = parts[0];
            var index = parts[1];

            var newLine = elem.lines[index];
            newLine[key] = newValue;
            elem.lines.splice(index, 1, newLine);

            var update = {lines: elem.lines};
            console.log(update);

            UpdateCollection(Sale, elem._id, update);
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
Template.new.created = function () {
    //Hack to ensure that we do not re
    Template.new.attached = false;
};

Template.new.newitem = function () {
    return Sale.findOne({ key: parseInt(Router.current().params.key ) });
};
Template.new.helpers({
    total: function () {
        var elem = Sale.findOne({ key: parseInt(Router.current().params.key ) });
        var total = 0;
        if(elem) {
            elem.lines.forEach(function (line) {
                total += line.price * line.quantity;
            });
        }
        return total;
    },
    headers: function () {
        var element = Sale.findOne({ key: parseInt(Router.current().params.key ) });
        if(!element) return [];
        var type = Session.get('type');
        var list =  type.headerFields;
        list = _.map(list, function(elem) {
            elem['value'] = element[elem.key];
            return elem;
        })
        return list;
    }
});
Template.newitemheader.rendered = function () {
    $.fn.editable.defaults.mode = 'inline';

    $('.header-edit-field').editable({
        emptytext: 'Indtast værdi',
        success: function(response, newValue) {
            var key = $(this).attr('id');
            var elem = Sale.findOne({ key: parseInt(Router.current().params.key ) });
            var update = {};
            update[key] = newValue;
            console.log(update);
            UpdateCollection(Sale, elem._id, update);
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
}
Template.new.rendered = function () {
    //Session.set('type', Mapping['newSalesinvoice']);
    var elem = Sale.findOne({ key: parseInt(Router.current().params.key) });
    Session.set('element', elem);

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
            props = val.added.data;

            var update = {};
            _.each(type.headerFields, function (map) {
                if (!map.fixed) {
                    update[map.key] = props[map.from];
                }
            });
            var elem = Sale.findOne({ key: parseInt(Router.current().params.key ) });
            var res = Sale.update({ _id: elem._id }, { $set: update });
            $("#deptor-select").select2('val', undefined);
        });

        $("#item-select").on('change', function (val) {
            props = val.added.data;
            var elem = Sale.findOne({ key: parseInt(Router.current().params.key ) });
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

};
Template.new.events({
    'click .remove-list-item': function(event) {
        var selected = Sale.findOne({ key: parseInt(Router.current().params.key ) });
        var list = selected.lines;
        list.splice(this.index, 1);
        var update = {lines: list};
        UpdateCollection(Sale, selected._id, update);
    },
});
