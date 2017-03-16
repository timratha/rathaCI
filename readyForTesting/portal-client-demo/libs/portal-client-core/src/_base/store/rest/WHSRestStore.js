define([
    'dojo/request/iframe',
    'dojo/request',
    'dojo/json',
    'dojo/_base/declare',
    'dstore/RequestMemory',
    'dstore/Rest',
    'dstore/Trackable',
    'dstore/Memory'
],function(iframe, request, json, declare, RequestMemory, Rest,Trackable){
    var basePath ="";
    return declare(null,{
        constructor:function(args){
            this.inherited(arguments);
            var _t = this;
            basePath =  args.basepath
            this.timeseries = new declare([ Rest, Trackable])({
                headers: {'Content-Type': 'application/json;charset=utf-8'},
                target: basePath  +"/rest/whs/kiwis/timeseries?params=%7B%22ts_path%22%3A%22%2F*%2F*%2FCmd.O%22%2C%22returnfields%22%3A%22station_id%2Cstation_name%2Cstation_no%2Cstationparameter_longname%2Cstation_latitude%2Cstation_longitude%2Cts_unitsymbol%2Cts_name%2Cts_shortname%2Cts_id%2Csite_no%2Cstationparameter_name%2Cparametertype_name%2Ccoverage%22%7D",
                getList:function(obj){
                    this.target= basePath  +"/rest/whs/kiwis/timeseries?";
                   obj = obj ||  {"ts_path":"/*/*/Cmd.O","returnfields":"station_id,station_name,station_no,stationparameter_longname,station_latitude,station_longitude,ts_unitsymbol,ts_name,ts_shortname,ts_id,site_no,stationparameter_name,parametertype_name,coverage"};
                    return this.filter({params:json.stringify(obj)}).fetch()
                },
                importTsData:function(form,params){
                    this.target= basePath  +"/rest/whs/kiwis/timeseries?";
                    return iframe(basePath+"/rest/whs/wiski/timeseries/data?request=importTsData",{
                        form: form,
                        query:{params:json.stringify(params)}
                    })
                },
                coverage:function(ts_id){
                    this.target= basePath  +"/rest/whs/kiwis/timeseries?";
                    return this.filter({params: '{"ts_id":'+ts_id+',"returnfields":"coverage"}'}).fetch()

                }
            });
            this.tsDataWAPI = new declare([ Rest, Trackable])({
                headers: {'Content-Type': 'application/json;charset=utf-8'},
                target: basePath  +"/rest/whs/wiski/timeseries/data",
                getData:function(obj){
                    var param = {path:obj.path,params:json.stringify(obj.params)};
                  if(obj.transformation){
                      param.transformation =  obj.transformation;
                  }
                       return this.filter(param).fetch()
                },
                setData:function(obj){
                    return request(basePath  +"/rest/whs/wiski/timeseries/data",{query:{request:"setTsData"},headers:{'Content-Type': 'application/json;charset=utf-8'},data:json.stringify(obj),handleAs:"json",method:"PUT"}).then(function(res){
                        _t.tsDataWAPI.emit('update', obj);
                    });

                }
            });
            this.tsDataKIWIS = new declare([ Rest, Trackable])({
                headers: {'Content-Type': 'application/json;charset=utf-8'},
                target: basePath  +"/rest/whs/kiwis/timeseries/data",
                getData:function(obj){
                    return this.filter({params:json.stringify(obj.params)}).fetch()
                }
            });
            this.stations = new declare([ Rest, Trackable])({
                headers: {'Content-Type': 'application/json;charset=utf-8'},
                target: basePath  +"/rest/whs/kiwis/stations",
                getStation:function(id,returnfields) {
                    return this.filter({params:json.stringify({station_id:id,returnfields:returnfields})}).fetch()
                },
                add:function(obj){
                    return _t.stationsWAPI.add(obj).then(function(res){
                        _t.stations.emit('add', obj);
                    });
                },
                remove:function(obj){
                    return request(basePath  +"/rest/whs/wiski/stations",{headers:{'Content-Type': 'application/json;charset=utf-8'},data:json.stringify(obj),handleAs:"json",method:"DELETE"}).then(function(res){
                        _t.stations.emit('delete', obj);
                    });
                }
            });
            this.stationsWAPI = new declare([ Rest, Trackable])({
                headers: {'Content-Type': 'application/json;charset=utf-8'},
                target: basePath  +"/rest/whs/wiski/stations"
            });
            this.parameters = new declare([ Rest, Trackable])({
                headers: {'Content-Type': 'application/json;charset=utf-8'},
                target: basePath  +"/rest/whs/kiwis/parameters",
                getParameter:function(id,returnfields) {
                    return this.filter({params:json.stringify({station_id:id,returnfields:returnfields})}).fetch();
                }
            })
        },
        timeseries : null,
        stations:null,
        parameters:null

    })
});