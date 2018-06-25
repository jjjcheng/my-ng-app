'use strict';

angular.module('app.project', [])
	.config(function($stateProvider,$urlRouterProvider){
		$stateProvider
			.state('project',{
				abstract:true
			})
			.state('project.stock',{
				url:'/project/stock',
				data:{
					name:"project.stock"
				},
				views:{
					'content':{
						templateUrl: '/app/project/views/project.stock.tpl.html',
                        controller: 'projectController'
					}
				},
				parent:'index'
			})
	})