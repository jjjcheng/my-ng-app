'use strict';

angular.module('app.analysis', [])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('analysis', {
                url: '/analysis',
                data: {
                    title: '统计分析',
                    name: 'analysis'
                },
                views: {
                    'content': {
                        templateUrl: '/app/analysis/views/analysis.tpl.html',
                        controller: 'analysisController'
                    }
                },
                parent: 'index',
                resolve: {
                    scripts: ['lazyScript', function(lazyScript) {
                        return lazyScript.register('build/highcharts/highcharts.js');
                    }]
                }
            })
    })