'use strict';

angular.module('app.plugins').directive('ckeditor', ['$window', 'ui.api', function(win, api) {
    // Runs during compile
    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
            uploadConfig: '='
        },
        link: function(scope, el, attr, ngModel) {
            var config = {
                height: attr.height || '320px'
            };
            var editor = CKEDITOR.replace(el[0]);
            function updateModel() {
                // if (!scope.$$phase) {
                //     scope.$apply(function() {
                //         ngModel.$setViewValue(editor.getData());
                //     });
                // }
                ngModel.$setViewValue(editor.getData() || '');
            }
            // editor.on('pasteState', updateModel);
            editor.on('dataReady', updateModel);
            editor.on('change', updateModel);
            editor.on('blur', updateModel);
            editor.on('saveSnapshot', updateModel);
        }
    };
}]);