"use strict"
Template.index.rendered = function() {
    $('.table-tooltip').tooltip();
};
Template.index.helpers({
    history: function () {
        return History.find({}, {sort: {created: -1}});
    },
    obj_to_str: function (obj) {
        var str = JSON.stringify(obj.data);
        if(obj.error){
            str += ' ' + JSON.stringify(obj.error);
        }
        str = str.replace(/"/g, "'");
        return handlebarHelpers.TooltipShorten(str, 50);
    },
});
