"use strict";

angular.module('app.misc', [])
	.config(function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('404',{
				url: '/404',
                data: {
                    title: '404错误'
                },
                views: {
                    'content': {
                        templateUrl: '/app/misc/views/404.tpl.html',
                    }
                },
                parent: 'index'
			})
            .state('403',{
                url: '/403',
                data: {
                    title: '403错误'
                },
                views: {
                    'content': {
                        templateUrl: '/app/misc/views/403.tpl.html',
                    }
                },
                parent: 'index'
            })
	})