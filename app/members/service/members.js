angular.module('app.members').factory('membersService', ['$q', 'ui.api', 'ui.dialog', function($q, api, dialog) {
    function getBasicData(fields) {
        var _data = {}
        fields.length && fields.forEach(function(field) {
            if (field.defaultValue != null) {
                _data[field.name] = field.defaultValue;
            } else if (field.type == 'select' || field.type == 'radio') {
                if (field.items && field.items.length > 0) {
                    _data[field.name] = field.items[0].id;
                }
            } else if (field.type == 'checkbox') {
                if (field.defaultChb[0]) {
                    _data[field.name] = field.defaultChb;
                }
            }
        })
        return _data;
    }

    function checkbox(data, name, ischecked, value) {
        if (!data[name]) data[name] = [];
        var field = data[name];
        var value = value.toString();
        if (ischecked) {
            if (field.indexOf(value) == -1) field.push(value);
        } else {
            if (field.indexOf(value) > -1) field.splice(field.lastIndexOf(value), 1);

        }
    }

    function select(data) {
        var me = this;
        var loadData = function(scope, params) {
            return api.loadGrid({
                postName: '/api/goldTime.json',
                params: params,
                timeout: 300,
                scope: scope,
                success: function(data) {
                    if (data.columns) {
                        scope.gridOptions.columnDefs = data.columns;
                        // $scope.gridOptions.data = data.data;
                    }
                }
            })
        };
        var loadTreeData = function(scope) {
            api.loadTree({
                name: 'api/tree.php',
                scope: scope
            }).then(function(r) {
                scope.dataForTheTree = r
            })
        }
        var loadNodes = function(node) {
            var _scope = this;
            api.loadTree({
                name: 'api/tree.php',
                params: {
                    id: node.id
                },
                scope: _scope
            }).then(function(result) {
                node.links = result;
            })

        }
        var showSelected = function(node) {
            var _scope = this;
            _scope.q['keyword'] = node.id;
            loadData(_scope, _scope.q);
        }
        var columnDefs = [{
            "name": "序号",
            "width": 50,
            "field": "id"
        }, {
            "name": "名称",
            "align": "left",
            "field": "title",
            "width": 200
        }, {
            "name": "录入时间",
            "field": "date"
        }];
        return api.form({
            title: '角色授权',
            templateUrl: "app/members/views/form_select.tpl.html",
            name: 'api/user.json',
            beforeSettings: function() {
                var _scope = this;
                loadTreeData(_scope);
                // loadData(_scope);
            },
            beforeSubmit: function(params) {
                var scope = this;
                var data = scope.gridBufferOptions.data;
                var ids = data.map(function(_r) {
                    return _r.id;
                });
                if (ids.length == 0) {
                    dialog.alert('请选择至少选择一个角色!');
                    return false;
                }
                params.ids = ids;
            },
            scope: {
                q: {},
                treeOptions: {
                    nodeChildren: "links",
                    isLeaf: function(node) {
                        return !node.allowChildren;
                    },
                    dirSelectable: true
                },
                gridOptions: {
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
                    columnDefs: columnDefs,
                    onRegisterApi: function(api) {
                        var scope = api.grid.appScope;
                        scope.api = api;
                        api.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
                            scope.query(false)
                        });
                    }
                },
                gridBufferOptions: {
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
                    columnDefs: columnDefs,
                    onRegisterApi: function(api) {
                        var scope = api.grid.appScope;
                        scope.bufferApi = api;
                    }
                },
                hasSelectedRecords: function(apiName) {
                    return api.hasGridSelectedRecords(this, apiName)
                },
                add: function() {
                    var scope = this;
                    var readySelect = api.getGridSelectedRecords(scope);
                    var _data = scope.gridBufferOptions.data || [];
                    var data = [];
                    var ids = _data.map(function(_r) {
                        return _r.id;
                    });
                    readySelect.forEach(function(r) {
                        var id = r.id;
                        if (ids.indexOf(id) == -1) {
                            if (r.$$hashKey) {
                                delete r.$$hashKey;
                            }
                            data.push(r);
                        }
                    });
                    scope.gridBufferOptions.data = [].concat(_data, data);
                },
                remove: function() {
                    var scope = this;
                    var data = scope.gridBufferOptions.data || [];
                    var readySelect = api.getGridSelectedRecords(scope, 'bufferApi');
                    readySelect.forEach(function(r) {
                        var ids = data.map(function(_r) { //下面的id集合
                            return _r.id;
                        })
                        var id = r.id,
                            i = ids.indexOf(id);
                        if (i !== -1) {
                            data.splice(i, 1);
                            scope.bufferApi.grid.selection.selectedCount--;
                        }
                    })
                },
                loadNodes: loadNodes,
                showSelected: showSelected,
            },
            config: {
                windowClass: 'x-window x-window-selection',
                width: '60%'
            }
        })
    }

    function selectNode() {
        var me = this;
        var deferred = $q.defer();

        var loadTreeData = function(scope) {
            api.loadTree({
                name: 'api/tree.php',
                scope: scope
            }).then(function(r) {
                scope.dataForTheTree = r
            })
        }
        var loadNodes = function(node) {
            var _scope = this;
            api.loadTree({
                name: 'api/tree.php',
                params: {
                    id: node.id
                },
                scope: _scope
            }).then(function(result) {
                node.links = result;
            })

        }

        var showSelected = function(node,selected) {
            var _scope = this;
            _scope.data.nodesList=_scope.selectedNodes.map(function(i){
                return i.id
            });
            console.log(_scope.data)
        }

        return api.form({
            title: "选择节点",
            templateUrl: "app/misc/views/selectNode.tpl.html",
            beforeSettings: function() {
                var _scope = this;
                loadTreeData(_scope);
            },
            scope: {
                q: {},
                treeOptions: {
                    nodeChildren: "links",
                    isLeaf: function(node) {
                        return !node.allowChildren;
                    },
                    dirSelectable: true,
                    multiSelection: true
                },
                loadNodes: loadNodes,
                showSelected: showSelected
            },
            config: {
                width: 420,
                windowClass: 'x-window',
            }
        })
    }

    var service = {
        getBasicData: getBasicData,
        checkbox: checkbox,
        select: select,
        selectNode: selectNode
    };
    return service;
}])