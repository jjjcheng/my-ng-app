'use strict';

angular.module('app.plugins')
    .factory('ui.api', ['$log', '$timeout', '$q', '$resolve', 'ui.http', 'ui.dialog', function($log, $timeout, $q, $resolve, http, dialog) {
        var service = {
            form: function(obj) {
                var scopeName = 'data',
                    scope, title, resolve, config, postParams, resolveWait, resolveApplyScope, resolveApplyData, resolveApply = true,
                    resolveAfter, deep = true;

                if (typeof obj == 'object') {
                    title = obj.title;
                    templateUrl = obj.templateUrl;
                    scope = obj.scope;
                    postParams = obj.data;
                    deep = typeof obj.deep == "undefined" ? deep : obj.deep;

                    config = obj.config;
                    resolve = obj.resolve;
                    resolveWait = obj.resolveWait;
                    resolveApplyScope = obj.resolveApplyScope;
                    resolveApplyData = obj.resolveApplyData;
                    resolveAfter = obj.resolveAfter;
                }

                // if(resolve){
                //     dialog.mask();
                // }
                var _d = dialog.showDialogByUrl(templateUrl, function($scope, resolveDate) {
                    $scope.title = title;
                    var data = {},
                        params = {};

                    function removeLoading() {
                        _d.rendered.then(function() {
                            angular.element('.x-dialog-loading').remove();
                        });
                    }

                    function isResolve(value) {
                        // return angular.isObject(value) && value.then && value.$$promises;
                        return angular.isObject(value) && value.then;
                    }

                    function applyData(obj, o) {
                        o = o || {};
                        var _data;
                        if (typeof o.code == 'undefined' || !(o.data && !angular.isArray(o.data))) {
                            _data = o;
                        } else {
                            _data = o.data;
                        }
                        return angular.extend(obj, _data);
                    }

                    function parseData(r) {
                        if (angular.isArray(r)) {
                            r.forEach(function(d) {
                                applyData(data, d);
                            });
                        } else if (angular.isObject(r)) {
                            applyData(data, r);
                        }
                    }

                    function applyParamsToScope() {
                        if (deep) {
                            angular.copy(postParams, params);
                        } else {
                            angular.extend(params, postParams);
                        }
                        $scope[scopeName] = params;
                    }

                    function applyDataToScope() {
                        if (resolveApplyScope) {
                            if (resolveApplyScope === true) {
                                angular.extend($scope, data);
                                return;
                            } else {
                                [].concat(resolveApplyScope).forEach(function(name) {
                                    var o = data[name];
                                    if (o) {
                                        if (angular.isArray(o)) {
                                            $scope[name] = [].concat(o);
                                        } else if (angular.isObject(o)) {
                                            var _o = angular.extend({}, o);
                                            $scope[name] = applyData({}, _o);
                                        }

                                        delete data[name];
                                    }
                                });
                            }
                        }
                        if (resolveApplyData) {
                            var _data = {};
                            [].concat(resolveApplyData).forEach(function(name) {
                                var o = data[name];
                                if (o && angular.isObject(o)) {
                                    // id合并无意义，直接从结果集里面删除
                                    if (_data.id && o.id) {
                                        delete _data.id;
                                        delete o.id;
                                    }
                                    angular.extend(_data, o);
                                    delete data[name];
                                }
                            });
                            angular.extend(data, _data);
                        }
                        if (Object.keys(data).length > 0) {
                            angular.extend(params, data);
                            $scope[scopeName] = params;
                        }
                    }
                    if (scope) {
                        angular.extend($scope, scope);
                    }
                    applyParamsToScope();
                    $scope.submitted = $scope.formDisabled = false;

                    if (resolveWait) {
                        $scope.submitted = $scope.formDisabled = true;

                        $scope.isViewLoading = true;

                        if (angular.isFunction(resolveWait)) {
                            resolveWait = resolveWait.call($scope);
                        }
                        var objs;
                        var done = function(result) {
                            if (objs) {
                                var _result = [];
                                objs.forEach(function(key) {
                                    var o = result[key] || {};
                                    var _o = {};
                                    var _data = typeof o.code == 'undefined' ? o : o.data;
                                    if (Object.keys(_data)) {
                                        _o[key] = _data;
                                        _result.push(_o);
                                    }
                                });
                                result = _result;
                            }
                            resolveApply && parseData(result);
                            applyDataToScope();
                            resolveAfter && resolveAfter.call($scope, $scope[scopeName], result);
                            $scope.submitted = $scope.formDisabled = false;

                            $scope.isViewLoading = false;
                            removeLoading();

                        }
                        var fail = function() {
                            dialog.alert("异常");
                        }
                        if (isResolve(resolveWait)) {
                            console.log(resolveWait)
                            resolveWait.then(done, fail);
                        } else {
                            objs = Object.keys(resolveWait);
                            $resolve.resolve(resolveWait).then(done, fail);
                        }
                    } else {
                        removeLoading();
                    }
                    $scope.submit = function(valid) {
                        $scope.submitted = true;

                        console.log($scope.data)
                        if (valid) {
                            // console.log('valid')
                        }
                    }
                    $scope.interacted = function(field) {

                        return $scope.submitted || field.$dirty || field.$touched;
                    };

                }, config, resolve)
            },
            // gridService
            page: {
                pageNumber: 1,
                pageSize: 15
            },
            loadGrid: function(postName, params, optionsName, $scope) {
                var cfg;
                var reset = true;
                var timeout = 0;
                var apiName;

                $scope = $scope || this;
                optionsName = optionsName || 'gridOptions';
                if (typeof postName == 'object') {
                    cfg = postName;
                    postName = cfg.postName;
                    $scope = cfg.scope || $scope;
                    success = cfg.success;


                    reset = typeof cfg.reset == 'undefined' ? reset : cfg.reset;
                    timeout = typeof cfg.timeout == 'undefined' ? timeout : cfg.timeout;
                    apiName = cfg.apiName;

                }
                var options = $scope[optionsName];

                if (reset && options.data && options.data.length) {
                    options.data = [];
                    options.total = 0;
                }
                if (reset) {
                    service.clearGridSelection($scope, apiName);
                }
                var _success = function(r) {
                    r = r || {};
                    if (success && success.call($scope, r, options) === false) {
                        return false;
                    }
                    $scope[optionsName].data = r.data;
                    $scope[optionsName].totalItems = r.totalItems;

                }
                return http.post({
                    name: postName,
                    params: params,
                    success: timeout > 0 ? function(r) {
                        $timeout(function() {
                            _success(r)
                        }, timeout)
                    } : _success
                })
            },
            clearGridSelection: function($scope, apiName) {
                $scope = $scope || this;
                var api = $scope[apiName || 'api'];
                if (api && api.selection) {
                    api.selection.clearSelectedRows();
                }
            },
            getGridSelectedCount: function($scope, apiName) {
                $scope = $scope || this;
                var api = $scope[apiName || 'api'];
                return api && api.selection ? api.selection.getSelectedCount() : 0;
            },
            getGridSelectedRecords: function($scope, apiName) {
                $scope = $scope || this;
                var api = $scope[apiName || 'api'];
                return api.selection.getSelectedRows();
            },
            hasGridSelected: function($scope, apiName) {
                return service.getGridSelectedCount($scope, apiName) === 1;
            },
            hasGridSelectedRecords: function($scope, apiName) {
                return service.getGridSelectedCount($scope, apiName) > 0;
            },
            getSelectedIds: function($scope, apiName) {
                return service.getGridSelectedProps('id', $scope, apiName);
            },
            getGridSelectedProps: function(atrr, $scope, apiName) {
                return service.getGridSelectedRecords($scope, apiName).map(function(r) {
                    return r[atrr];
                });
            },
        }
        return service
    }])