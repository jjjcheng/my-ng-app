"use strict";

angular.module('app.login')
    .controller('LoginCtrl', ['$scope', '$state', 'ui.dialog', 'ui.http', function($scope, $state, dialog, http) {
        var user = $scope.user = {};

        $scope.submitted = $scope.formDisabled = false;
        $scope.submit = function(valid) {
            $scope.submitted = true;
            if (valid) {
                $scope.formDisabled = true;
                dialog.mask();
                http.post({
                    name: 'api/grid.json',
                    params: user
                }).success(function(data) {
                    $state.go('members');
                }).error(function() {
                    $scope.submitted = $scope.formDisabled = false;
                }).finally(function() {
                    dialog.unmask();
                });
            }
        }

        $scope.interacted = function(field) {
            return $scope.submitted || field.$dirty || field.$touched;
        };
    }])