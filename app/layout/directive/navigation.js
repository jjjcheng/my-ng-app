"use strict";

angular.module('app.layout').directive('navigation', ['$rootScope', '$state', 'ui.dialog', function($rootScope, $state, dialog) {
    return {
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: 'app/layout/views/navigation.tpl.html',
        link: function($scope, element) {
			var _global = $rootScope.global;
			var _menu = {};
			var settings = {
					backdrop: true,
					windowClass: 'slide-panel'
				}
			if (element.parent().length) {
				settings.appendTo = element.parent();
			}
			var closeDialog = function() {
				var ns = _menu[_menu.name], dlg;
				if (ns && (dlg = ns.dialog)) {
					dlg.close(false);
				}
			}
			var _name = $state.current.data.name;
			$scope.$state=$state;
			$scope.expand = function(name) {
				closeDialog();
				if (name == _menu.name && _menu[name].opened) return;

				var d = dialog.showDialogByUrl('app/layout/views/navigation-' + name + '.tpl.html', function(scope) {
					scope.$state=$state;
				}, settings);
				// 每次打开窗口时，激活状态转移到当前触发按钮
				_global.menu = name;
				// $state.current.data.name = null;

				d.closed.then(function() {
					// 上一次窗口关闭后状态设为false
					_menu[name].opened = false;
					// 仅当前最新的窗口关闭后，进行按钮激活状态复原
					if (_menu[_menu.name].opened === false) {
						// _global.menu = null;
						// $state.current.data.name = _name;

						_global.menu = $state.current.data.name || _name;
					}
				});
				// 记录当前窗口名
				_menu.name = name;

				// 按传参的窗口名来存储过往窗口对象以及是否打开状态
				_menu[name] = {};
				_menu[name].dialog = d;
				_menu[name].opened = true;
			}

			var destroyForStart = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                closeDialog();
                _global.menu = null;
            });

            element.on('$destroy', function() {
                destroyForStart();
            });
		}
    };
}]);