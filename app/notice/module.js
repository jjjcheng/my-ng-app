'use strict';
angular.module('app.notice', [])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('notice', {
                url: '/notice',
                data: {
                    title: "通知公告",
                    name:"notice"
                },
                views:{
                    'content':{
                        templateUrl: '/app/notice/views/notice.tpl.html'
                    }
                },
                parent: 'index'
                
            })
    })