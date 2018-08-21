"use strict";

angular.module('app.login', [])
    .config(function($stateProvider) {

        $stateProvider
            .state('login', {
            	url:'/login',
                templateUrl:'/app/login/views/login.tpl.html',
                controller: 'LoginCtrl',
                data:{
                	name:'login',
                	title:'登陆'
                }
            })
    })