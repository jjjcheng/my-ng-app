'use strict';

var permissionList = [];

$(function() {
    $.get('/api/permissionList.json', function(r) {
        $.each(r.data, function(i, e) {
            permissionList.push(e.name)
        })
        angular.bootstrap(document, ['app']);
    })
})