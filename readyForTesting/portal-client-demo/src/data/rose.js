define([], function () {
   return {

       title: {
           text: 'Wind rose for site Aachen-Burtscheid, March 2014'
       },

       subtitle: {
           text: 'Source: lanuv.nrw.de'
       },

       pane: {
           size: '85%'
       },

       legend: {
           align: 'right',
           verticalAlign: 'top',
           y: 100,
           layout: 'vertical'
       },

       xAxis: {
           tickmarkPlacement: 'on',
           categories: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
       },

       yAxis: {
           min: 0,
           endOnTick: false,
           showLastLabel: true,
           title: {
               text: 'Frequency (%)'
           },
           labels: {
               formatter: function () {
                   return this.value + '%';
               }
           },
           reversedStacks: false
       },

       tooltip: {
           valueSuffix: '%'
       },

       plotOptions: {
           series: {
               stacking: 'normal',
               shadow: false,
               groupPadding: 0,
               pointPlacement: 'on'
           }
       },
       series:[{"name":"&lt; 0.5 m/s","data":[0.13,0.27,0.4,0.67,0.27,0.4,1.08,1.08,1.21,0.54,0.13,0.4,0,0.13,0.4,0.13]},{"name":"0.5-2 m/s","data":[1.21,2.55,2.69,1.48,1.34,2.15,2.28,8.74,10.89,3.76,2.82,1.34,1.08,0.27,0.4,0.81]},{"name":"2-4 m/s","data":[0.4,1.08,1.21,1.08,1.08,1.48,0.81,1.88,3.9,4.57,8.6,4.44,1.88,0.67,0.67,0.27]},{"name":"4-6 m/s","data":[0,0,0,0,0,0,0.13,0.13,1.34,2.28,2.96,5.24,0.54,1.08,0,0]},{"name":"6-8 m/s","data":[0,0,0,0,0,0,0,0,0,0,0.13,0.81,0,0,0,0]},{"name":"8-10 m/s","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"&gt; 10 m/s","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}]

   }

});