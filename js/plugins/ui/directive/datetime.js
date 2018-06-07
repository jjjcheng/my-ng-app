'use strict';

angular.module('app.plugins')
    .directive('datetime', function() {
        return {
            require: '?ngModel',
            　　　　restrict: 'A',
            　　　　scope: { ngModel: '=' },
            link: function(scope, element, attr, ngModel) {　　　　　　
                var _date = null,
                    _config = {};

                _config = {　　　　　　　　
                    lang: 'zh',
                    elem: element[0],
                    btns: ['confirm'],
                    format: !!attr.format ? attr.format : 'yyyy-MM-dd',
                    range: attr.range,
                    done: function(value, date, endDate) {　　　　　　　　　　
                        ngModel.$setViewValue(value);　　　　　　　　
                    }　　　　　　
                };　　　　　　
                !!attr.typeDate && (_config.type = attr.typeDate);
                _date = laydate.render(_config);
                ngModel.$render = function() {　　　　　　　　
                    element.val(ngModel.$viewValue || '');　　　　　　
                };　　　　
            }　　
        }
    });