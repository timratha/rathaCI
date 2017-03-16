define([
    'dojo/Evented',
    'dojo/topic',
    "dojo/_base/declare",
    "./settingDialog"
],function(Evented, topic, declare,
    SettingDialog
){
    /*
    * provide events:
    *  'wrapper/afterCreate'
    *
    * */
    return declare( [Evented],{
        openSetting:function(){
            var _t=this;
            if(!this.settingDialog){
                this.settingDialog=new SettingDialog({
                    title:this.name,
                    dataSchema:this.getConfigSchema()||this._generateSchema(),
                    dataForm:this.getConfigForm(),
                    onSubmit:function(data){
                        _t.setConfig(data);
                    }
                });
            };
            this.settingDialog.set('data',this.getConfig());
            this.settingDialog.show();
        },
        getConfigSchema:function(){
            return this.instance.getConfigSchema(); //TODO it need to be a static field of type, for now get from instance (easier).
        },
        getConfigForm:function(){
            return this.instance.configForm; //TODO it need to be a static field of type, for now get from instance (easier).
        },
        getConfig:function(){
            // instance need to implement it to provide config data for setting
        },
        setConfig:function(data){
            // instance need to implement it to provide config data for setting to set config
        },
        newInstance:function(cb){
            // to create new instance; cb(instance);
        },
        createInstance:function(){
            var _t=this;
            return this.newInstance().then(function(instance){
                _t.instance=instance;
                _t.instance.placeAt(_t.instancePoint); // TODO change to containerNode ,use placeAt to reuse this dom node.
                _t.instance.startup();
                _t.onReload(instance);//TODO delete , whats for  , commit :added declaredClass to various classes, changed applicationSelector .
                _t.emit('wrapper/afterCreate');
            },function(err){
                topic.publish('portal/systemMessage',{
                    type:'error',
                    content:err
                })
            });
        },
        destroyInstance:function(){
            //destroy the old one
            if(this.instance){
                this.removeChild(this.instance);
                this.instance.destroyRecursive();
                this.instance=undefined;
            }
        },
        reCreateInstance:function(){
            this.destroyInstance();
            this.createInstance();
        },
        _generateSchema:function(){ //TODO consider remove
            // default implement just read the config structure ;
            var config= this.getConfig();
            var schema=[];
            for(var key in config){
                if(typeof config[key] != 'object'){
                    // TODO not support object now
                    schema.push({
                        'name':key,
                        // TODO
                        // for now not support type , just an idea
                        'type':'string'
                    })
                }
            }
            return schema;
        },
        onReload:function(instance){
            return instance;
        }
    });

});