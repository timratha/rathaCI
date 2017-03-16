define([
    'dojo/_base/lang',
    'dojo/_base/Deferred',
    'dojo/Evented',
    'dojo/_base/declare',
    "../common/_ConfigurableMixin",
    "../common/Register",
    "dojo/json",
    "../store/PortalStore",
    "dojo/on",
    "../common/Util"
], function (lang, Deferred, Evented, declare,
    _ConfigurableMixin,
    Register,
    json,
    PortalStore,
    on,
    Util
) {
    /*
    * TODO:
    * consider move set,get,load config  to _ConfigurableMixin.js
    * when widget and view both load config by restful (maybe it not good load widget config separate.need to start up after load.)
    * */
    return declare([_ConfigurableMixin], {
        postCreate:function(){
            this.inherited(arguments);
            this.load(this.model);// if already have model,will use it. or load from server
        },
        load:function(model){
            var _t=this;

            var resultHandler=function(model){
                _t.model=model;
            };
            var errHandler=function(err){
                //console.log('can not load config for',_t.widgetId);
                _t.model=null;
            };
            var deferred = new Deferred();
            if(model){
                _t.widgetId=_t.model.id;
                deferred.then(resultHandler,errHandler);
                deferred.resolve(model)
            }else{
                deferred=PortalStore.appStore.getWidget(_t.widgetId).then(resultHandler,errHandler)
            }
            return deferred.then(function(){
                if(_t.checkModel()){
                    _t.reCreateInstance();
                }
            });
        },
        save:function(){
            PortalStore.appStore.putWidget(this.model);

        },
        getConfig:function(){
            return this.model.config;
        },
        setConfig:function(config){
            //console.log("setConfig")
            lang.mixin(this.model.config,config); //TODO?need test.?when remove some fields?
            this.reCreateInstance();
            this.save();
        },
        newInstance:function(){
            var _t=this;
            return Register.widget(_t.model.widgetType).then(function(widgetType){
                if(widgetType){
                    return new widgetType(_t.model.config);
                }else{
                    throw 'widget type not found'+_t.model.widgetType
                }
            })
        },
        checkModel:function(){
            if(!this.model){
                //TODO consider to set _key, we can just show can not load for user.
                console.error("No widget with key "+this._key);
                this.instancePoint.innerHTML = "<b>ERROR:</b> No widget with key "+this._key;
                return false;
            }else if(!Register.widget(this.model.widgetType)){
                console.error(this.model.widgetType+" is not defined, check Registry");
                this.instancePoint.innerHTML = "<b>ERROR</b>:"+this.model.widgetType+" is not defined, check Registry";
                return false;
            }
            return true;
        }
    });
});
