angular.module('app.notice').controller('noticeController', ['$scope', 'i18nService', 'ui.http', 'ui.api', 'ui.dialog', function($scope, i18nService, http, api, dialog) {
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


    // tree
    $scope.treeOptions = {
        nodeChildren: "children",
        dirSelectable: true,
        injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
        }
    }
    $scope.dataForTheTree = [{
            "name": "Joe",
            "age": "21",
            "children": [
                { "name": "Smith", "age": "42", "children": [] },
                {
                    "name": "Gary",
                    "age": "21",
                    "children": [{
                        "name": "Jenifer",
                        "age": "23",
                        "children": [
                            { "name": "Dani", "age": "32", "children": [] },
                            { "name": "Max", "age": "34", "children": [] }
                        ]
                    }]
                }
            ]
        },
        { "name": "Albert", "age": "33", "children": [] },
        { "name": "Ron", "age": "29", "children": [] }
    ];

}])