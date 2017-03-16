define([
    'dojo/promise/all',
    'dojo/_base/array',
    'dstore/Memory',
    './customStores/preFetchStore',
    'dojo/request',
    'dojo/_base/declare',
    'dstore/Rest',
    'dstore/Cache',
    'dstore/Trackable',
    'dojo/Deferred'
], function(all, array, Memory, preFetchStore,  request, declare, Rest, Cache,Trackable,Deferred) {
    return declare([], {
        DCAJobs:null,
        DCATopics:null,
        DCAResults:null,
        DCAOperations:null, //Todo change to operations
        constructor: function (args) {
            this.inherited(arguments);
            this.basePath = args.basepath;
            //TODO temp code
            this.stations=new declare([Memory, Trackable])({
                target:args.basepath+"/rest/wiski7",
                getList:function(dsID,params){
                    var _t=this;
                    return request(args.basepath+"/rest/wiski7/dataSources/"+dsID+"/stations",{
                        handleAs: "json",
                        headers:{
                            'Content-Type':'application/json',
                            'Accept':'application/json'
                        },
                        query:params
                    });
                }
            });

            this.sites=new declare([Memory, Trackable])({
                target:args.basepath+"/rest/wiski7/",
                getList:function(dsID,params){
                    var _t=this;
                    return request(args.basepath+"/rest/wiski7/dataSources/"+dsID+"/sites",{
                        handleAs: "json",
                        headers:{
                            'Content-Type':'application/json',
                            'Accept':'application/json'
                        },
                        query:params
                    });
                }
            });

            //TODO temp code
            this.valuelayer=new declare([Memory, Trackable])({
                target:args.basepath+"/rest/wiski7/",
                getValueLayer:function(dsID,params,format){
                    var _t=this;
                    params.subformat =format;
                    return request(args.basepath+"/rest/wiski7/dataSources/"+dsID+"/timeSeries/layers",{
                        handleAs: "json",
                        headers:{
                            'Content-Type':'application/json',
                            'Accept':'application/json'
                        },
                        query:params
                    });
                }
            });

            //TODO temp code
            this.graph=new declare([Memory, Trackable])({
                target:args.basepath+"/rest/wiski7/",
                getGraph:function(dsID,params){
                    var _t=this;
                    return request(args.basepath+"/rest/wiski7/dataSources/"+dsID+"/timeSeries/graphs",{
                        handleAs: "json",
                        headers:{
                            'Content-Type':'application/json',
                            'Accept':'application/json'
                        },
                        query:params
                    });
                },
                getTemplates:function(dsID,params){
                    var _t=this;
                    return request(args.basepath+"/rest/wiski7/dataSources/"+dsID+"/graphTemplates",{
                        handleAs: "json",
                        headers:{
                            'Content-Type':'application/json',
                            'Accept':'application/json'
                        }
                    });
                }
            });

            //TODO temp code
            this.tsdata=new declare([Memory, Trackable])({
                target:args.basepath+"/rest/wiski7/",
                getList:function(dsID,params){
                    var _t=this;
                    return request(args.basepath+"/rest/wiski7/dataSources/"+dsID+"/timeSeries/data",{
                        handleAs: "json",
                        headers:{
                            'Content-Type':'application/json',
                            'Accept':'application/json'
                        },
                        query:params
                    });
                }
            });

            //TODO temp code
            this.timeseries=new declare([Memory, Trackable])({
                target:args.basepath+"/rest/wiski7/",
                getList:function(dsID,params){
                    var _t=this;
                    return request(args.basepath+"/rest/wiski7/dataSources/"+dsID+"/timeSeries",{
                        handleAs: "json",
                        headers:{
                            'Content-Type':'application/json',
                            'Accept':'application/json'
                        },
                        query:params
                    });
                }
            });

            //TODO temp code
            this.groups=new declare([Memory, Trackable])({
                target:args.basepath+"/rest/wiski7/",
                getList:function(dsID,params){
                    var _t=this;
                    return request(args.basepath+"/rest/wiski7/dataSources/"+dsID+"/groups",{
                        handleAs: "json",
                        headers:{
                            'Content-Type':'application/json',
                            'Accept':'application/json'
                        },
                        query:params
                    });
                }
            });

            //TODO temp code
            this.parameter=new declare([Memory, Trackable])({
                target:args.basepath+"/rest/wiski7/",
                getList:function(dsID,params){
                    var _t=this;
                    return request(args.basepath+"/rest/wiski7/dataSources/"+dsID+"/parameters",{
                        handleAs: "json",
                        headers:{
                            'Content-Type':'application/json',
                            'Accept':'application/json'
                        },
                        query:params
                    });
                }
            });

            this.DCAJobs=new declare([Rest, Trackable,Cache])({
                target:args.basepath+"/rest/wiski7/dca/jobs",
                idProperty:'ID',
                labelProperty:'name',
                start:function(id){
                    var _t=this;
                    return request(args.basepath+"/rest/wiski7/dca/jobs/start/"+id,{
                        handleAs: "json",
                        headers:{
                            'Content-Type':'application/json'
                        }
                    });
                }
            });
            this.DCATopics=new declare([Rest, Trackable,Cache])({
                target:args.basepath+"/rest/wiski7/dca/topics",
                idProperty:'ID',
                labelProperty:'name'
            });
            this.DCAResults=new declare([Rest, Trackable,Cache])({
                target:args.basepath+"/rest/wiski7/dca/results",
                idProperty:'ID'
            });

            var pruef = window.groupNameFilter || "Prueftyp*";   // TODO temp solution for filter, needs to go to application config
/*            this.TSIGroups = new declare([preFetchStore, Trackable])({
                idProperty: 'group_id',
                labelProperty: 'group_name',
                target: args.basepath+"/rest/wiski7/dataSources/0/groups?group_name="+pruef+"&group_type=timeseries"
            });*/


            this.DCAOperations = new declare([preFetchStore, Trackable])({
                idProperty: 'id',
                labelProperty: 'name',
                target: args.basepath+"/rest/wiski7/dca/operations",
                dataCallback:function(data){
                    var items= [];
                    array.forEach(data,function(item){
                        array.forEach(item.configuredOperations,function(op){
                            //TODO temp solution
                            op.name = op.name.replace("DBUE.","")
                            op.name = op.name.replace(".", " ")
                            items.push(op);
                        })
                    });
                    this.itemStore = new declare([Memory, Trackable])({
                        idProperty:'id',
                        labelProperty:'name',
                        data:items
                    })
                }
            });

        }
    });
});