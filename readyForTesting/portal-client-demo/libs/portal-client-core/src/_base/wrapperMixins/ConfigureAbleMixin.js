// summary:
//
// instance requirement:
//     configSchema or configForm:
//          summary:
//              [optional] provide information for instance setting
//          returns:
//              list of action options or action (TitleAction)
define([
    'dojo/Evented',
    'dojo/Deferred',
    'dojo/_base/lang',
    'dojo/_base/declare',
    '../common/Wrapper',
    '../common/SettingDialog',
    '../common/RequirePromise'
],function(Evented, Deferred, lang, declare,Wrapper,SettingDialog,RequirePromise
){
    return declare([Evented],{

        configureAble:true,

        setConfig:function(config){
            // set values from dialog
            throw 'need to be implement';
        },
        getConfig:function(){
            // get current values
            throw 'need to be implement';
        },

        _getConfigSchema:function(){
            return this.instance.getConfigSchema && this.instance.getConfigSchema();
        },
        _getConfigForm:function(){
            return this.instance.getConfigForm && this.instance.getConfigForm();
        },
        openSetting:function(){
            var _t=this;
            if(!this.settingDialog){
                this.settingDialog=new SettingDialog({
                    title:this.name,
                    dataSchema:this._getConfigSchema(),
                    dataForm:this._getConfigForm(),
                    onSubmit:function(data){
                        _t.setConfig(lang.mixin({},_t.getConfig(),data));
                    }
                });
            }
            this.settingDialog.set('data',this.getConfig());
            this.settingDialog.show();
        },
        _buildInActions:function(){
            var actions=this.inherited(arguments);
            var _t=this;
            if(this.model && this.model.id && this.configureAble && (this._getConfigForm() || this._getConfigSchema()) ){
                actions.push({
                    icon:'fa fa-gear',
                    index:15,
                    onClick:function(){
                        _t.openSetting();
                    }
                });
            }
            return actions;
        }

    });
});