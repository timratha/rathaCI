define(['dojo/_base/declare',
    'dstore/Rest',
    'dstore/Trackable'],function(declare, Rest, Trackable){
    var basePath ="";
    return  declare([ Rest, Trackable],{
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        constructor:function(args){
            this.inherited(arguments);
            basePath = args.basepath;
            this.target  =   basePath+"/rest/myTimeSeries/"
        },
        setData:function(id,data){
            return request.put(basePath+"/rest/myTimeSeries/"+id+"/data/",{headers:this.headers,data:JSON.stringify(data)})
        },
        getData:function(id,query){
            return request.get(basePath+"/rest/myTimeSeries/"+id+"/data/",{headers:this.headers,query:query})

        }

    });
})