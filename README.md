## ng-app ui文档

* Scripts:
	* npm install -g gulp
	* npm install gulp
	* npm install
	* gulp
--------------------
#### 表格插件
> HTML
> > ` <div id="grid1" ui-grid="gridOptions" class="grid" ui-grid-selection ui-grid-pagination></div> `
> > * ui-grid 传入与scope绑定的配置项
> > * ui-grid-selection 开启选择功能 
> > * ui-grid-pagination 开启分页功能

> JS
> > ```js
> > var q = $scope.q = {};
> > var loadlData = $scope.loadlData = function(params) {
> >        api.loadGrid({
> >            postName: '/api/goldTime.json',
> >            params: params,
> >            timeout: 300,
> >            scope: $scope,
> >            success: function(data) {
> >                if (data.columns) {
> >                    $scope.gridOptions.columnDefs = data.columns;
> >                    // $scope.gridOptions.data = data.data;
> >                }
> >            }
> >        })
> >    };
> >    var query = $scope.query = function(isRest) {
> >        if (isRest === false || $scope.gridOptions.paginationCurrentPage == 1) {
> >            console.log(q)
> >            loadlData(q)
> >        } else {
> >            api.gridReset(null, $scope);
> >        }
> >    }
> >    //grid配置
> >    i18nService.setCurrentLang('zh-cn');
> >    $scope.gridOptions = {
> >        enableSorting: false, //禁用排序
> >        enableGridMenu: false, //禁用菜单
> >        enableFullRowSelection: true, //禁用单击选择
> >        enableColumnMenus: false, //禁用网格菜单
> >        enableHorizontalScrollbar: 0, //表格的水平滚动条  
> >        enableVerticalScrollbar: 1, //表格的垂直滚动条 (两个都是 1-显示,0-不显
> >        paginationPageSizes: [10],
> >        useExternalPagination: true, //使用分页按钮
> >        selectionRowHeaderWidth: 35,
> >        rowHeight: 35,
> >        columnDefs: [{
> >            "name": "序号",
> >            "width": 50,
> >            "field": "id"
> >        }, {
> >            "name": "企业名称",
> >            "align": "left",
> >            "field": "title",
> >            "width": 500
> >        }, {
> >            "name": "录入时间",
> >            "width": 200,
> >            "field": "date"
> >        }, {
> >            "name": "操作",
> >            "field": "id",
> >            cellTemplate: '<div class="x-grid-inner"><span class="btn-text" ng-click="grid.appScope.preview(grid.getCellValue(row, > >col))">查看</span></div>'
> >        }],
> >        onRegisterApi: function(api) {
> >            $scope.api = api; //注册事件
> >            //分页按钮事件
> >            api.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
> >                q.pageSize = pageSize;
> >                q.pageIndex = newPage;
> >                query(false)
> >            });
> >        }
> >    };
> >    loadlData();
> > ```