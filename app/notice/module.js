'use strict';
angular.module('app.notice', [])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index.notice', {
                url: '/notice',
                data: {
                    title: "通知公告",
                    name:"notice"
                },
                views:{
                    'content@index':{
                        templateUrl: '/app/notice/views/notice.tpl.html'
                    }
                }
            })
    })