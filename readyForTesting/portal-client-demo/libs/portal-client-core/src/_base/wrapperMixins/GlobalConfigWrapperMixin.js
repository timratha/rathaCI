// summary:
//
// instance requirement:
//     configSchema or configForm:
//          summary:
//              [optional] provide information for instance setting
//          returns:
//              list of action options or action (TitleAction)
define([
    './StoreModelWrapperMixin',
    'dojo/Evented',
    'dojo/Deferred',
    'dojo/_base/lang',
    'dojo/_base/declare',
    '../common/Wrapper',
    '../common/SettingDialog',
    '../common/RequirePromise'
],function(StoreModelWrapperMixin, Evented, Deferred, lang, declare,Wrapper,SettingDialog,RequirePromise
){
    // must already inherited StoreModelWrapperMixin ,ConfigureAbleMixin
    return declare([Evented],{

        globalConfigureAble:false,

        setGlobalConfig:function(config){
            var parentID = this.model && this.model.parentID;
            var _t=this;
            this.setConfig(config);//TODO consider again, now just because server side can not get new user config immediately
            this.getStore().get(parentID,'global').then(function(model){
                model.config=config;
                _t.getStore().put(model);//TODO msg
            });
            // set values from dialog
            //throw 'need to be implement';
        },
        getGlobalConfig:function(){ //TODO consider reduce request time in future.
            var parentID = this.model && this.model.parentID;
            //TODO 'global' is temp code.
            return this.getStore().get(parentID,'global').then(function(model){
                return model.config
            })
            //// get current values
            //throw 'need to be implement';
        },

        _getGlobalConfigSchema:function(){
            return this.instance.getConfigSchema && this.instance.getConfigSchema();//TODO in future maybe need some filter process.
        },
        _getGlobalConfigForm:function(){
            return this.instance.getConfigForm && this.instance.getConfigForm();//TODO
        },


        openGlobalSetting:function(){
            var _t=this;
            if(!this.globalSettingDialog){
                this.globalSettingDialog=new SettingDialog({
                title:this.name,
                dataSchema:this._getGlobalConfigSchema(),
                dataForm:this._getGlobalConfigForm(),
                onSubmit:function(data){
                    _t.getGlobalConfig().then(function(config){
                        _t.setGlobalConfig(lang.mixin({},config,data));
                    })
                }
            });
            }
            _t.getGlobalConfig().then(function(config) {
                _t.globalSettingDialog.set('data',config);
                _t.globalSettingDialog.show();
            });
        },

        _buildInActions:function(){
            var actions=this.inherited(arguments);
            var _t=this;
            if(this.model && this.model.parentID && this.globalConfigureAble && (this._getGlobalConfigForm() || this._getGlobalConfigSchema()) ){
                actions.push({
                    icon:'fa fa-gears',
                    index:14,
                    help:'Global Settings', // TODO nls
                    onClick:function(){
                        _t.openGlobalSetting();
                    }
                });
            }
            return actions;
        }
    });
});