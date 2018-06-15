"use strict";

angular.module('app.layout').directive('navigation', ['$rootScope', '$state', 'ui.dialog', function($rootScope, $state, dialog) {
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'app/layout/views/navigation.tpl.html',
		link: function($scope, iElm, iAttrs, controller) {
			var settings = {
					backdrop: true,
					windowClass: 'slide-panel'
				}
			$scope.expand=function(name){
				var d=dialog.showDialogByUrl('app/layout/views/navigation-' + name + '.tpl.html',function(){
					
				},settings)
			}
		}
	};
}]);