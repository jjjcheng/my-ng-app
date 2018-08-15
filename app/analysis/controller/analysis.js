'use strict';

angular.module('app.analysis')
    .controller('analysisController', ['$scope', 'ui.http', function($scope, http) {
        console.log('analysis');
        $scope.options1 = {
            xAxis: {
                categories: []
            },
            series: [{
                name: '注册机构数量',
                data: []
            }]
        };

        // 最近15天注册机构数量
        http.post({
            name: '/api/goldTime.json',
            params: {

            },
            success: function(data) {
                var view = $scope.view1;
                console.log(view);
                view.xAxis[0].setCategories(['09-17', '09-18', '09-19', '09-20', '09-21', '09-22', '09-23', '09-24']);
                view.series[0].setData([43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]);
            }
        });

        $scope.options2 = {
            xAxis: {
                categories: []
            },
            series: [{
                name: '注册机构数量',
                data: []
            }]
        };

        // 最近15个月注册机构数量
        http.post({
            name: '/api/goldTime.json',
            params: {

            },
            success: function(data) {
                var view = $scope.view2;
                view.xAxis[0].setCategories(['09-17', '09-18', '09-19', '09-20', '09-21', '09-22', '09-23', '09-24']);
                view.series[0].setData([43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]);
            }
        });
        $scope.options3 = {
            legend: {
                align: 'center',
                verticalAlign: 'bottom'
            },
            tooltip: {
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                data: []
            }]
        };

        // 按机构类型
        http.post({
            name: '/api/goldTime.json',
            params: {

            },
            success: function(data) {
                var view = $scope.view3;
                view.series[0].setData([
                    ['新闻出版', 45.0],
                    ['设计服务', 26.8],
                    ['艺术品交易', 8.5],
                    ['广西产业', 6.2],
                    ['动漫网游', 0.7]
                ]);
            }
        });

        $scope.options4 = {
            legend: {
                align: 'center',
                verticalAlign: 'bottom'
            },
            tooltip: {
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                data: []
            }]
        };

        // 按机构注册资本
        http.post({
            name: '/api/goldTime.json',
            params: {

            },
            success: function(data) {
                var view = $scope.view4;
                view.series[0].setData([
                    ['300万以下', 40.0],
                    ['300-1000万', 26.8],
                    ['1000-3000万', 8.5],
                    ['3000-5000万', 6.2],
                    ['5000-10000万', 5],
                    ['大于10000万', 0.7]
                ]);
            }
        });

        $scope.options5 = {
            legend: {
                align: 'center',
                verticalAlign: 'bottom'
            },
            tooltip: {
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                data: []
            }]
        };

        // 按机构员工人数
        http.post({
            name: '/api/goldTime.json',
            params: {

            },
            success: function(data) {
                var view = $scope.view5;
                view.series[0].setData([
                    ['50以下', 45.0],
                    ['50-100', 26.8],
                    ['100-200', 8.5],
                    ['200-300', 6.2],
                    ['大于3000', 0.7]
                ]);
            }
        });
    }])