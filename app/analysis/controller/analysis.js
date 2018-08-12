'use strict';

angular.module('app.analysis')
    .controller('analysisController', ['$scope','ui.http', function($scope,http) {
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
    }])