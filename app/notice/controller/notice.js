angular.module('app.notice').controller('noticeController', ['$scope', 'i18nService', 'ui.http', 'ui.api', 'ui.dialog', function($scope, i18nService, http, api, dialog) {
    $scope.remove = function(scope) {
        scope.remove();
    };

    $scope.toggle = function(scope) {
        scope.toggle();
    };

    $scope.moveLastToTheBeginning = function() {
        var a = $scope.data.pop();
        $scope.data.splice(0, 0, a);
    };

    $scope.newSubItem = function(scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
            nodes: []
        });
    };

    $scope.collapseAll = function() {
        $scope.$broadcast('angular-ui-tree:collapse-all');
    };

    $scope.expandAll = function() {
        $scope.$broadcast('angular-ui-tree:expand-all');
    };

    $scope.data = [{
        'id': 1,
        'title': 'node1',
        'nodes': [{
                'id': 11,
                'title': 'node1.1',
                'nodes': [{
                    'id': 111,
                    'title': 'node1.1.1',
                    'nodes': []
                }]
            },
            {
                'id': 12,
                'title': 'node1.2',
                'nodes': []
            }
        ]
    }, {
        'id': 2,
        'title': 'node2',
        'nodrop': true, // An arbitrary property to check in custom template for nodrop-enabled
        'nodes': [{
                'id': 21,
                'title': 'node2.1',
                'nodes': []
            },
            {
                'id': 22,
                'title': 'node2.2',
                'nodes': []
            }
        ]
    }, {
        'id': 3,
        'title': 'node3',
        'nodes': [{
            'id': 31,
            'title': 'node3.1',
            'nodes': []
        }]
    }];
    // grid
    var loadlData = $scope.loadlData = function() {
        api.loadGrid({
            postName: '/api/goldTime.json',
            params: "",
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
    var query = function(isRest) {
        if (isRest === false || $scope.gridOptions.paginationCurrentPage == 1) {
            loadlData()
        } else {
            api.gridReset(null, $scope);
        }
    }

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
            "width": 500
        }, {
            "name": "录入时间",
            "width": 200,
            "field": "date"
        }, {
            "name": "操作",
            // "width": 100,
            "field": "id",
            "cellTemplate": "<div class=\"x-grid-inner\"><span class=\"btn-text\" ng-click=\"grid.appScope.preview(grid.getCellValue(row, col))\">详情</span></div>"
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
}])