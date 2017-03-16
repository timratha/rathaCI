define([], function () {

    return {
        title: {
            text: 'Concentration rose March 2014 AABU'
        },
        pane: {
            startAngle: 0,
                endAngle: 360
        },
        xAxis: {
            tickInterval: 30,
                min: 0,
                max: 360,
                labels: {
                formatter: function () {
                    return this.value + '°';
                }
            }
        },
        yAxis: {
            min: 0,
                max: 100,
                labels: {
                formatter: function () {
                    return this.value + 'µg/m³';
                }
            }
        },
        plotOptions: {
            series: {
                pointStart: 0,
                    pointInterval: 10,
                    fillOpacity: 0.1
            },
            column: {
                pointPadding: 0,
                    groupPadding: 0
            },
            area: {
                marker: {
                    enabled: false
                }
            }
        },
        series: [{
            type: 'area',
            color: '#FF0000',
            name: 'OZONE [µg/m³]',
            data: [35, 53, 47, 44, 42, 47,69,53,68,67,54,69,47,28,44,37,32,36,40,49,54,63,58,48,51,53,55,53,49,63,64,78,79,61,47,67]
        }, {
            type: 'area',
            color: '#0066FF',
            name: 'PM10 [µg/m³]',
            data: [48, 40, 47, 60, 60, 33,25,26,23,20,24,17,22,32,19,29,28,26,22,17,19,17,20,26,28,25,32,45,46,22,27,60,33,35,52,24]

        }]
    }

});