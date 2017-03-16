define([
    '../common/PortalHashHelper',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/on',
    'dojo/_base/declare',
    '../title-bar/SendToAction',
    '../store/PortalStore',
    '../common/Util'
],function(PortalHashHelper, lang, array, on, declare,SendToAction,PortalStore,Util
){
    return declare([],{
        _oldQueryString:'',
        // extend prepareInstanceParams to mixin viewQuery to params. when view be selected.
        prepareInstanceParams:function(){
            var _t=this;
            return this.inherited(arguments).then(function(params){
                _t._oldQueryString = PortalHashHelper.getViewQueryString();// queryString is easier to compare. maybe not correct 100%,but is ok.
                // not pass by inside params like _queryParams,
                // for view don't need to know it's query params.
                // TODO need consider agian for it, about security problem like constructor as params.
                return _t.selected?lang.mixin(PortalHashHelper.getViewQuery(),params):params; //TODO decide the order ?
            });
        },
        //summary: the function to check if the view query is different, if different means must to update the instance.
        compareQuery:function(){
            return this._oldQueryString == PortalHashHelper.getViewQueryString();
        }
    });
});