'use strict';

angular.module('app.members', [])
    .config(function($stateProvider, $urlRouterProvider) {
        // $stateProvider
        //     .state('index.members', {
        //         url: '/members',
        //         data: {
        //             title: "会员管理",
        //             name:"members"
        //         },
        //         views: {
        //             'content@index': {
        //                 templateUrl: '/app/members/views/members.tpl.html',
        //                 controller: 'membersController'
        //             }
        //         }
        //     })
        
        $stateProvider
            .state('members', {
                url: '/members',
                data: {
                    title: '会员管理',
                    name: 'members'
                },
                views: {
                    'content': {
                        templateUrl: '/app/members/views/members.tpl.html',
                        controller: 'membersController'
                    }
                },
                parent: 'index'
            })
    })