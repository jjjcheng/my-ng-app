'use strict';

angular.module('app.plugins').directive('passwordMatcher', function() {
	return {
		require: 'ngModel',
		link: function(scope, el, attr, t) {
			scope.$watch(attr.ngModel, function() {
				t.$validate();
			}), t.$validators.passwordmatcher = function(a) {
				var t = scope.$eval(attr.passwordMatcher);
				return !a || !t || a == t;
			}
		}
	}
});