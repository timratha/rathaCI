/*
*   support pass store directly to series.
 *   store data item must be key-value object
 *   and set pointXField,pointValKey for the field use for x, y if without key x,y inside item object.
 *   pass columns object for get values form point save back to store. and format values.
*
* */
define(['dojo/Evented',
    'dojo/on',
    'dojo/promise/all',
    'dojo/_base/lang',
    'dojo/_base/array',
    'highcharts/highstock',
    'highcharts/draggable-points'
],function(Evented, on, all, lang, array){

    var hub = new Evented;

    Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed, userOptions, callback) {
        var chart = this;
        if (userOptions ){
            all(array.map(userOptions.series,function(serie,index){
                var store = serie.store;
                if(store){
                    serie.idProperty =store.idProperty;
                    var pointXField= serie.pointXField;

                    store.on('update',function(e){
                        var dataItem= e.target;
                        var point = chart.series[index].points.filter(function(item){
                            return item[store.idProperty]== dataItem[store.idProperty]
                        })[0];
                        point ? point.update(dataItem):0;
                    });
                    store.on('refresh',function(){
                        store.sort(pointXField).fetch().then(function(data){
                            chart.series[index].setData(lang.clone(data),false);
                            chart.redraw()
                        })
                    });
                    hub.on('drop',function(e){
                        var point = e.target;
                        if( serie.name == point.series.name){
                            var data={};
                            array.forEach(serie.columns,function(k){
                                data[k]=point[k];
                            })
                            data[store.idProperty]=point[store.idProperty];
                            store.put(data);
                        }
                    })
                    return store.sort(pointXField).fetch().then(function(data){
                        serie.data=lang.clone(data);
                    })
                }


            })).then(function(){
                proceed.call(chart, userOptions, callback);
            })
        } else {
            proceed.call(chart, userOptions, callback);
        }
    });

    Highcharts.wrap(Highcharts.Point.prototype, 'firePointEvent', function (proceed,eventType, eventArgs, defaultFunction){
        var point=this;
        hub.emit(eventType,{
            target:point,
            args:eventArgs
        });
        if( eventArgs ){
            //fix bug for draggable points when have pointValKey,
            var pointXField= point.series.options.pointXField;
            var pointValKey= point.series.options.pointValKey;
            if(pointValKey && eventArgs.y !== undefined){
                eventArgs[pointValKey]= eventArgs.y
            }
            if(pointXField && eventArgs.x !== undefined){
                eventArgs[pointXField]= eventArgs.x
            }
        }
        proceed.call(point,eventType, eventArgs, defaultFunction);
    });

    Highcharts.wrap(Highcharts.Point.prototype,'optionsToObject',function(proceed,options){
        var ret= proceed.call(this,options);
        var idProperty = this.series.options.idProperty;
        var pointXField= this.series.options.pointXField;
        var pointValKey= this.series.options.pointValKey;

        if(options[idProperty]){
            ret[idProperty]=options[idProperty] //store item identify
        }
        if(pointXField && ret.x == undefined){
            ret.x=options[pointXField];
        }
        return ret;
    })
})
