"use strict";

angular.module('app.layout').directive('navigation', ['$rootScope', '$state', 'ui.dialog', function($rootScope, $state, dialog) {
	return {
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		templateUrl: 'app/layout/views/navigation.tpl.html',
		link: function($scope, iElm, iAttrs, controller) {
			console.log("123")
		}
	};
}]);