angular.module('app.members').controller('membersController', ['$scope', 'i18nService', 'ui.http', 'ui.api', 'ui.dialog', 'membersService', function($scope, i18nService, http, api, dialog, service) {
    var q = $scope.q = {};

    var loadlData = $scope.loadlData = function(params) {
        api.loadGrid({
            postName: '/api/goldTime.json',
            params: params,
            timeout: 300,
            scope: $scope,
            success: function(data) {
                if (data.columns) {
                    $scope.gridOptions.columnDefs = data.columns;
                    // $scope.gridOptions.data = data.data;
                }
            }
        })
    };
    var query = $scope.query = function(isRest) {
        if (isRest === false || $scope.gridOptions.paginationCurrentPage == 1) {
            console.log(q)
            loadlData(q)
        } else {
            api.gridReset(null, $scope);
        }
    }

    //grid配置
    i18nService.setCurrentLang('zh-cn');
    $scope.gridOptions = {
        enableSorting: false, //禁用排序
        enableGridMenu: false, //禁用菜单
        enableFullRowSelection: true, //禁用单击选择
        enableColumnMenus: false, //禁用网格菜单
        enableHorizontalScrollbar: 0, //表格的水平滚动条  
        enableVerticalScrollbar: 1, //表格的垂直滚动条 (两个都是 1-显示,0-不显
        paginationPageSizes: [10],
        useExternalPagination: true, //使用分页按钮
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        columnDefs: [{
            "name": "序号",
            "width": 50,
            "field": "id"
        }, {
            "name": "企业名称",
            "align": "left",
            "field": "title",
            "width": 600
        }, {
            "name": "录入时间",
            "width": 200,
            "field": "date"
        }, {
            "name": "操作",
            "field": "id",
            cellTemplate: '<div class="x-grid-inner"><span class="btn-text" ng-click="grid.appScope.preview(grid.getCellValue(row, col))">查看</span></div>'

        }],
        onRegisterApi: function(api) {
            $scope.api = api; //注册事件
            //分页按钮事件
            api.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                query(false)
            });
        }
    };
    loadlData();
    $scope.preview = function(id) {
        console.log(id);
        api.form({
            title: "用户详情",
            templateUrl: "app/members/views/form_notice_preview.tpl.html",
            resolveWait: http.post({
                name: "api/user.json",
                params: {
                    id: id
                }
            }),
            beforeSettings: function() {
                var _scope = this; //弹出框的scope
            }
        })
    }

    $scope.hasSelected = function() {
        return api.hasGridSelected($scope, 'api');
    }

    $scope.hasSelectedRecords = function() {
        return api.hasGridSelectedRecords($scope, 'api');
    }
    $scope.removeRows = function() {
        console.log(api.getSelectedIds($scope, 'api'));
        dialog.showMessageDialog({
            title: "提示信息",
            message: "确定删除吗?"
        });
    }
    $scope.add = function() {

        api.form({
            title: "新建信息",
            templateUrl: "app/members/views/add.tpl.html",
            data: { //expend to $scope.data
                channelID: "node.id"
            },
            scope: {
                checkbox: service.checkbox
            },
            resolveWait: {
                fields: function() {
                    return http.post({
                        name: 'api/doc-fields.json'
                    })
                }
            },
            resolveApplyScope: ['fields'],
            resolveAfter: function(data) {
                var _scope = this;
                var _data = _scope.data;
                angular.extend(_data, service.getBasicData(_scope.fields));
            }
        })
    }
    $scope.edit = function() {
        api.form({
            title: '新建模型',
            templateUrl: 'app/members/views/form_model.tpl.html',
            // name: 'meta_model_add',
            config: {
                windowClass: 'x-window',
                size: 480
            }
        })
    }

    $scope.reset = function() {
        var id = api.getSelectedIds($scope, 'api');
        api.form({
            title: "密码重置",
            templateUrl: 'app/members/views/form_reset.tpl.html',
            name: 'org_user_reset',
            data: {
                id: id
            },
            config: {
                windowClass: 'x-window',
                width: 480
            }
        })
    }

    // $scope.grant = function() {
    //     api.form({
    //         title: "角色授权",
    //         templateUrl: "app/members/views/form_select.tpl.html",
    //         beforeSettings: function() {
    //             var _scope = this;
    //         },
    //         scope: {
    //             gridOptions: {
    //                 enableSorting: false, //禁用排序
    //                 enableGridMenu: false, //禁用菜单
    //                 enableFullRowSelection: true, //禁用单击选择
    //                 enableColumnMenus: false, //禁用网格菜单
    //                 enableHorizontalScrollbar: 0, //表格的水平滚动条  
    //                 enableVerticalScrollbar: 1, //表格的垂直滚动条 (两个都是 1-显示,0-不显
    //                 paginationPageSizes: [10],
    //                 useExternalPagination: true, //使用分页按钮
    //                 selectionRowHeaderWidth: 35,
    //                 rowHeight: 35,
    //                 columnDefs: [{
    //                     "name": "序号",
    //                     "width": 50,
    //                     "field": "id"
    //                 }, {
    //                     "name": "企业名称",
    //                     "align": "left",
    //                     "field": "title",
    //                     "width": 500
    //                 }, {
    //                     "name": "录入时间",
    //                     "width": 200,
    //                     "field": "date"
    //                 }, {
    //                     "name": "操作",
    //                     // "width": 100,
    //                     "field": "id",
    //                     "cellTemplate": "<div class=\"x-grid-inner\"><span class=\"btn-text\" ng-click=\"grid.appScope.preview(grid.getCellValue(row, col))\">详情</span></div>"
    //                 }]
    //             }
    //         },
    //         config: {
    //             windowClass: 'x-window x-window-selection',
    //             width: '60%'
    //         }
    //     })
    // }
    $scope.grant=function(){
        service.select();
    }
}])