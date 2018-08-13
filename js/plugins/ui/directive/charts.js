'use strict';
angular.module('app.plugins').directive('charts', function() {
    return {
        restrict: "AE",
        scope: {
            view: "=",
            charts: "="
        },
        link: function(e, l, r, i) {
            var t = l[0],
                o = e.charts || {},
                n = angular.merge({
                    legend: {
                        align: "right",
                        verticalAlign: "top",
                        y: 0
                    },
                    xAxis: {
                        gridLineColor: "#E2E2E0",
                        gridLineWidth: 1,
                        labels: {
                            style: {
                                color: "#C0BDC4"
                            }
                        },
                        lineColor: "#E2E2E0"
                    },
                    yAxis: {
                        title: null,
                        gridLineColor: "#E2E2E0",
                        labels: {
                            style: {
                                color: "#C0BDC4"
                            }
                        },
                        lineColor: "#E2E2E0"
                    }
                }, o, {
                    chart: {
                        backgroundColor: "none"
                    },
                    colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
                    title: {
                        text: null
                    },
                    credits: {
                        enabled: !1
                    },
                    tooltip: {
                        headerFormat: null
                    }
                }),
                c = Highcharts.chart(t, n);
            r.view && (e.view = c)
        }
    }
});