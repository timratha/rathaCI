define([
    'dstore/Cache',
    'dojo/promise/all',
    'dojo/_base/array',
    'dojo/when',
    'dstore/Tree',
    'dojo/store/util/QueryResults',
    'dojo/store/util/SimpleQueryEngine',
    'dstore/Memory',
    'dstore/Trackable',
    'dojo/_base/declare',
], function(Cache, all, array, when, Tree, QueryResults, SimpleQueryEngine,Memory, Trackable,declare) {
    return declare([],{
        DCAJobs:null,
        DCATopics:null,
        DCAResults:null,
        DCAGroups:null,
        DCAOperations:null, //Todo change to operations
        constructor:function() {
            this.DCAJobs = new declare([Memory, Trackable,Cache])({
                idProperty:'ID',
                labelProperty:'name',
                start:function(id){
                    var _t=this;
                    return this.get(id).then(function(item){
                        item.state='RUNNING';
                        return _t.put(item);
                    })
                }
            });
            this.DCATopics = new declare([Memory, Trackable,Cache],{
            })({
                idProperty:'ID',
                labelProperty:'name'
            });
            this.DCAResults = new declare([Memory,Trackable,Cache],{
            })({
                idProperty:'ID'
            });
            this.DCAGroups = new declare([Memory, Trackable,Cache])({
                idProperty:'group_id',
                labelProperty:'group_name'
            });
            this.DCAOperations=new declare([Memory, Trackable,Cache])({
                idProperty:'id',
                labelProperty:'name',
                _started:false,
                // contains all operation items from DCAOperations
                itemStore:new declare([Memory, Trackable])({
                    idProperty:'id',
                    labelProperty:'name'
                }),
                startup:function(){
                    var _t=this;
                    return this._started || this.fetch().then(function(data){
                            _t._started=true;
                            // get all items
                            array.forEach(data,function(item){
                                return array.forEach(item.configuredOperations,function(op){
                                    _t.itemStore.addSync(op);
                                })
                            })
                    });
                }
            });
        }

    })
});

