'use strict';

angular.module('app', [
        'ngMessages',
        'ngAnimate',
        'ui.router',
        'ui.grid',
        'ui.bootstrap',
        'ui.grid.selection',
        'ui.grid.pagination',
        'treeControl',

        'app.login',
        'app.layout',
        'app.members',
        'app.notice',
        'app.project',
        'app.analysis',
        'app.misc',

        'app.plugins'
    ])
    .config(function($provide, $httpProvider) {
        $provide.factory('ErrorHttpInterceptor', function($rootScope, $q) {
            return {
                response: function(response) {
                    return response.config.headers.uuid == 'terry-app' ? ((response.data && 200 == response.data.code) ? response.data : $q.reject(response)) : response

                },
                responseError: function(response) {
                    if (response.status === 403) {
                        $rootScope.$emit("error403", "403", response);
                        return response;
                    } else if (response.status === 404) {
                        $rootScope.$emit("error404", "404", response);
                        return response;
                    }
                    return $q.reject(response);
                }
            };
        })
        $httpProvider.interceptors.push('ErrorHttpInterceptor');
    })
    .run(['$rootScope', '$state', 'ui.dialog', 'ui.http', 'User', 'ui.api', 'permissions', function($rootScope, $state, dialog, http, User, api, permissions) {
        $rootScope.global = {};
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            var permission = toState.name;
            if (toState.name != "login" && !permissions.hasPermission(permission)) {
                $state.go("403", { }, { "reload": true });
                event.preventDefault();
            }


        });
        $rootScope.$on('error403', function(errorType) {
            $state.go('403');
        });
        $rootScope.$on('error404', function(errorType) {
            $state.go('404');
        });

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