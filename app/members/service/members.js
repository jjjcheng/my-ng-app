angular.module('app.members').factory('membersService', ['$q', function($q) {
    function getBasicData(fields) {
        var _data = {}
        fields.length && fields.forEach(function(field) {
            if (field.defaultValue != null) {
                _data[field.name] = field.defaultValue;
            } else if (field.type == 'select' || field.type == 'radio') {
                if (field.items && field.items.length > 0) {
                    _data[field.name] = field.items[0].id;
                }
            } else if (field.type == 'checkbox') {
                if (field.defaultChb[0]) {
                    _data[field.name] = field.defaultChb;
                }
            }
        })
        return _data;
    }

    function checkbox(data, name, ischecked, value) {
        if (!data[name]) data[name] = [];
        var field = data[name];
        var value = value.toString();
        if (ischecked) {
            if (field.indexOf(value) == -1) field.push(value);
        } else {
            if (field.indexOf(value) > -1) field.splice(field.lastIndexOf(value), 1);

        }
    }
    var service = {
        getBasicData: getBasicData,
        checkbox: checkbox
    };
    return service;
}])