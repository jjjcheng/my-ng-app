'use strict';

angular.module('app.project').controller('projectController', ['$scope', 'Upload', function($scope, Upload) {
    console.log($scope);
    $scope.uploadFiles = function(file, errFiles) {

        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'upload/url',
                data: { file: file, 'username': $scope.username }
            });

            file.upload.then(function(res) {
                console.log(res)
            }, function(response) {
                console.log(response)
            }, function(evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                console.log(file.progress)
            });
        }
    };
}])