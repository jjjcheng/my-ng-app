"use strict";

angular.module('app.login').directive('loginInfo', ['User', function(User){
	return {
		strict:'AE',
		templateUrl: 'app/login/views/login-info.tpl.html',
		link: function(scope, iElm, iAttrs, controller) {
			
			scope.user=User.get();
		}
	};
}]);