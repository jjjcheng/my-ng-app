"use strict";

angular.module('app.login').factory('User', ['ui.http', function(http){
	var _user;
	var service={
		get:function(){
			return _user;
		},
		request:function(params){
			http.post({
				name:'/api/user.json',
				params:params,
				success:function(data){
					_user = angular.extend({}, data);
				}
			})
		}
	}
	return service;
}])