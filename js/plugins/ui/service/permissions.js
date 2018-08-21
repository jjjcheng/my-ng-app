'use strict';

angular.module('app.plugins')
    .factory('permissions', function($rootScope) {
        return {
            hasPermission: function(permission) {
                if (permission) {
                    if (typeof(permission) == "string") {
                        if (permissionList.indexOf(permission) > -1) {
                            return true;
                        }
                    }
                }
                return false;
            }
        };
    });