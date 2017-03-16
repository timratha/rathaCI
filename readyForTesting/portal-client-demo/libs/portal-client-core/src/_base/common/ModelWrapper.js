// summary:
//      set model, or fetch model.
// instance requirement:
//     configSchema or configForm:
//          summary:
//              [optional] provide information for instance setting
//          returns:
//              list of action options or action (TitleAction)
//TODO support store , listen the change of model
define([
    'dojo/_base/lang',
    'dojo/Deferred',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    './Wrapper',
    '../common/RequirePromise',
    '../wrapperMixins/ConfigureAbleMixin'
],function(lang, Deferred, TemplatedMixin, WidgetBase, declare,Wrapper,RequirePromise,ConfigureAbleMixin
){

    // summary:
    //
    return declare([Wrapper,ConfigureAbleMixin],{
        declaredClass:'ModelWrapper',

        model:null,

        //field name to get instance type from model? if set null, will not get from model
        instanceTypeFieldName:'instanceType',

        _setModelAttr:function(model){
            console.debug('set model',model);
            var _t=this;
            _t.model=model;
            _t.model && _t.update().otherwise(function(err){
                _t.error(err);
            });
        },
        // update the instance and title.
        update:function(){//TODO check if have model
            var _t=this;
            this._updateTitle();
            return this._updatePromise = this._updatePromise && !this._updatePromise.isFulfilled() ? this._updatePromise : this._updateInstance();
        },
        _updateTitle:function(){
            var title= (this.model.config && this.model.config.label) || this.model.label;
            title?this.set('title',title):0;
            this.model.iconClass ? this.set('titleIcon',this.model.iconClass):0;
        },
        _updateInstance:function(){
            var _t=this;
            return this.prepareInstanceParams()
                .then(function(args){
                    return _t.createInstance(args);
                }).then(function(inst){
                    _t.set('instance',inst);
                })
        },
        prepareInstanceParams:function(){
            // common point for customize.
            var ready = new Deferred();
            ready.resolve(lang.clone(this.model.config));
            return ready.promise;
        },
        createInstance:function(args){
            var _t=this;
            var instanceType=_t.instanceType ? _t.instanceType : _t.model[_t.instanceTypeFieldName];
            return RequirePromise.require(instanceType).then(function(Type){
                return new Type(args);
            })
        },
        destroy:function(){
            if(this._updatePromise){
                this._updatePromise.cancel('destroy');
            }
            this.inherited(arguments);
        },
        setConfig:function(config,notUpdate){
            this.model.config = config;
            notUpdate?0:this.update();
            // TODO consider compare first , reduce request. or compare in saveModel?
        },
        getConfig:function(){
            return this.model.config;
        }
    });
});