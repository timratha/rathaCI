// let instance can save some useful data. need implemented ModelWrapper

define([
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/_base/declare',
    '../title-bar/SendToAction',
    '../store/PortalStore'
],function(array, lang, on, declare,SendToAction,PortalStore
){
    // summary:
    //
    return declare([],{
        localDataSaveAble:true,
        _localData:null,
        _setInstanceAttr:function(){
            this.inherited(arguments);
            var _t=this;

            this.own(on(this.instance,'update_local_data',function(e){
                //e : data, override
                var inst=_t.instance;
                if(_t.localDataSaveAble && _t.getDataId()){
                    _t._localData = e.override? e.data:lang.mixin(_t._localData, e.data);
                    PortalStore.instanceCache.put({
                        id:_t.getDataId(),
                        data:_t._localData
                    });
                }
            }))
        },
        prepareInstanceParams:function(){
            var _t=this;
            return this.inherited(arguments).then(function(params) {
                if(_t.getDataId()){
                    // just if have data id can use it.
                    return PortalStore.instanceCache.get(_t.getDataId()).then(function(data){
                        _t._localData= data && data.data ;
                        return lang.mixin(params,_t._localData);
                    })
                }else{
                    return params;
                }
            })
        },
        getDataId:function(){
            //localDataId is not some not create with sever side model.
            return this.localDataId || this[this._idProperty];
        }

    });
});