'use strict';

angular.module('app.plugins')
    .run(['$templateCache', function($templateCache) {
        $templateCache.put('html/dialog', '<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="slide-dialog" uib-modal-animation-class="fade" modal-in-class="in" ng-style="{\'z-index\': 1050 + index*10}"><div class="slide-dialog-wrap{{size && size.lastIndexOf(\'%\') === -1 ? \' slide-dialog-\' + size : \'\'}}" ng-style="{\'width\': size.lastIndexOf(\'%\') === -1 ? ((size | number) + \'px\') : (\'\' + size)}" uib-modal-transclude modal-loading></div></div>');
        $templateCache.put('html/message', '<div class="x-dialog-wrap"><div class="x-dialog-panel"><div class="x-dialog-header"><h2>{{::title}}</h2><div class="x-dialog-toolbar"><ul><li><span class="x-dialog-button" data-dismiss="modal" data-ng-click="close(false)" aria-hidden="true"><i class="fa fa-remove"></i></span></li></ul></div></div><div class="x-dialog-body"><div class="x-dialog-message">{{::message}}</div><div class="x-dialog-tools"><span ng-repeat="btn in buttons track by $index" ng-click="eventHandler(btn.result)" class="btn btn-default" ng-class="::btn.cssClass">{{::btn.label}}</span></div></div></div></div>');
    }])
    .directive('modalLoading', function() {
        return {
            priority: 200,
            link: function(scope, element, attrs, controller, transclude) {
                var $loading = angular.element('<div class="x-dialog-loading"></div>');
                element.append($loading);
            }
        };
    })
    .factory('ui.dialog', ["$rootScope", "$uibModal", function($rootScope, $uibModal) {
        var showDialog = function(args) {
            args = args || {};

            if (args.width) {
                args.size = args.width;

                args.width = null;
                delete args.width;
            }
            var config = {
                backdrop: 'static',
                backdropClass: 'x-dialog-mask',
                // size: 640,
                windowTemplateUrl: 'html/dialog'
            };
            var settings = angular.extend({}, config, args);
            var dialog = $uibModal.open(settings);
            return dialog;
        };
        var showDialogByUrl = function(url, fn, config, passedObject) {
            var dialog, o;
            var args = {
                templateUrl: url,
                resolve: {
                    passedObject: function() {
                        return passedObject;
                    }
                },
                controller: ['$scope', '$uibModalInstance', 'passedObject', function($scope, $uibModalInstance, passedObject) {
                    // o = $scope.$on("$locationChangeSuccess", function() {
                    //     if (dialog && $scope._dialogShow == true) {
                    //         $scope.close(false);
                    //     }
                    // });
                    $scope._dialogShow = true;
                    $scope.close = function(result) {
                        $scope._dialogShow = false;
                        $uibModalInstance.close(result);
                        dialog = null;
                    };
                    if (angular.isFunction(fn)) fn($scope, passedObject);
                }]
            }
            if (config) {
                config.resolve = config.resolve || {};
                angular.extend(config.resolve, args.resolve);
                angular.extend(args, config);
                // args = angular.merge({}, args, config);
            }
            dialog = showDialog(args);

            var afterClose = function(result) {
                if (o) o();
                return result;
            };

            dialog.result.then(function(result) {
                return afterClose(result);
            }, function(result) {
                return afterClose(result);
            });

            return dialog;
        }
        var showMessageDialog = function(settings, callback, config) {
            var templateUrl = "html/message",
                defaultButtons = [{
                    result: false,
                    label: '取消',
                    cssClass: "btn-default"
                }, {
                    result: true,
                    label: '确定',
                    cssClass: "btn-primary"
                }];
            settings = settings || {};
            settings.title = settings.title || '系统提示';
            callback = callback || settings.callback;
            config = config || settings.config || {};

            config.windowClass = config.windowClass || settings.windowClass || 'x-dialog';

            config.backdrop = 'static';
            config.index = 1000;
            config.backdropClass = config.backdropClass || settings.backdropClass;

            var buttons = settings.buttons || defaultButtons,
                injection = function($scope) {
                    $scope.title = settings.title;
                    $scope.message = settings.message;
                    $scope.buttons = buttons;
                    $scope.eventHandler = function(e) {
                        $scope.close(e);
                    };
                    if (angular.isFunction(callback)) {
                        callback(dialog);
                    }
                };

            return showDialogByUrl(templateUrl, injection, config);
        }
        var showMessageDialogSimple = function(title, message, buttons, config) {
            return showMessageDialog({ title: title, message: message, buttons: buttons, config: config });
        }
        var _once = 0,
            _d = {
                result: {
                    then: function() {}
                }
            };
        var confirm = function(message) {
            if (_once > 0) return _d;
            _once++;
            var d = showMessageDialogSimple('确认提示', message, null, {
                width: 420
            });
            d.result.then(function() {
                _once--;
            });
            return d;
        }
        var alert = function(message) {
            if (_once > 0) return _d;
            _once++;
            var d = showMessageDialogSimple(null, message, [{
                result: true,
                label: '确定',
                cssClass: "btn-primary"
            }], {
                width: 420
            });
            d.result.then(function() {
                _once--;
            });
            return d;
        }
        var _temp =
            '<div class="x-loading">\
                <div class="ico-loading"><span class="ico-arrow"></span><span class="ico-arrow"></span><span class="ico-arrow"></span></div>\
                <div class="text-loading"></div>\
            </div>';
        var _w;
        var mask = function(text) {
            text = text || '加载中...请稍后...';
            var $body = $('body'),
                $text;
            if (_w) {
                _w.hide();
                $text = _w.find('.text-loading');
                $text.text(text);
                return _w.show();
            }
            _w = $(_temp).prependTo($body);
            $text = _w.find('.text-loading');
            $text.text(text);
        }
        var unmask = function() {
            if (_w) _w.hide().remove();
        }
        return {
            showDialog: showDialog,
            showDialogByUrl: showDialogByUrl,
            showMessageDialog: showMessageDialog,
            showMessageDialogSimple: showMessageDialogSimple,
            confirm: confirm,
            mask: mask,
            unmask: unmask,
            alert: alert
        }
    }]);