'use strict';

angular.module('app.layout', [])
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('login');
		$stateProvider.state('index', {
			// url:"/index",
			abstract: true,
			templateUrl: '/app/layout/views/layout.tpl.html',
			resolve:{
				user:function($q,User){
					return User.request();
				}
			}
		})
	})