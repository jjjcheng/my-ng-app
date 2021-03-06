'use strict';

angular.module('app.plugins')
	.factory('ui.http', ['$q', '$http', '$httpParamSerializer','ui.dialog', function($q, $http, $httpParamSerializer,dialog) {
		return {
			post: function(name, params, success) {
				var me = this;
				var cfg, error;
				if (typeof name == 'object') {
					cfg = name;
					name = cfg.name;
					params = cfg.params;
					success = success || cfg.success;
					error = cfg.error;
				}
				var data = params || {};
				return $http({
					method: 'POST',
					url: name,
					headers: {
						"uuid": "terry-app",
						"Content-Type": "application/x-www-form-urlencoded"
					},
					data: $httpParamSerializer(params)
				}).success(function(r) {
					me._success(r, success);
				}).error(function(data, code, headers, request) {
					if (!error || error.apply(null, arguments) !== false) {
						me._error.apply(null, arguments);
					}
				})
			},
			_success: function(response, callback) {
				callback && callback.apply(null, arguments);
			},
			_error: function(response, code, headers, request) {
				if (response != null) {
					if (code == 404) {
						dialog.alert('404错误,请重试');
					} else if (code == 403) {
						dialog.alert('重新登录');
					} else {
						var message='请求错误';
						var msg = response.errMsg || response.errorMsg || response.error || response.errorMessage || response.errmsg || message;
						dialog.alert(msg);
					}
				}
			}
		}
	}])