'use strict';
angular.module('app', [
        'ngMessages',
        'ngAnimate',
        'ui.router',
        'ui.grid',
        'ui.bootstrap',
        'ui.grid.selection',
        'ui.grid.pagination',
        'ui.tree',
        
        'app.login',
        'app.layout',
        'app.members',
        'app.notice',
        'app.project',

        'app.plugins'
    ])
    .config(function($provide, $httpProvider) {
        $provide.factory('ErrorHttpInterceptor', function($rootScope, $q) {
            return {
                response: function(response) {
                    return response.config.headers.uuid == 'terry-app' ? ((response.data && 200 == response.data.code) ? response.data : $q.reject(reason)) : response

                }
            };
        })
        $httpProvider.interceptors.push('ErrorHttpInterceptor');
    })
    .run(['$rootScope', '$state', 'ui.dialog', 'ui.http', 'User', 'ui.api', function($rootScope, $state, dialog, http, User, api) {
        $rootScope.global = {};

        $rootScope.logout = function() {
            dialog.confirm("确定要退出吗？").result.then(function(r) {
                if (r) {
                    http.post({
                        name: '/api/grid.json',
                        success: function(r) {
                            $state.go('login')
                        }
                    })
                }
            })
        }
        $rootScope.modify = function() {
            var user = User.get();
            if (!user) {
                dialog.alert('发生异常!');
                return;
            }
            api.form({
                title: '修改信息',
                templateUrl: '/app/login/views/form_modify.tpl.html'
            })

        }
    }])