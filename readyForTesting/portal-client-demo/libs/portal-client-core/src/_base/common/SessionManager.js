define([
    'dojo/json',
    'dojo/_base/lang',
    'dojo/_base/declare',
    'dojo/request',
    "dojo/Deferred",
    "dojo/_base/array",
    "dojo/Evented"
], function(
    JSON,
    lang,
    declare,
    request,
    Deferred,
    array,
    Evented
) {

    return declare([Evented],{
        _active:false, // flag use to check session is active
        _requestCacheQueue:[],
        _sessionTimerID:null,
        sessionTimeout:null,// ms, use to setup timeout to check if session going to close . need be set , null means not set
        _startSessionTimer:function(){
            var _t=this;
            if(_t.sessionTimeout){
                _t._sessionTimerID=setTimeout(function(){
                    _t.emit('sessionTimeout',{});
                },_t.sessionTimeout);
            }
        },
        continueSessionTimer:function(){
            // use to continue active this session by user behavior.
            if(this._sessionTimerID){
                clearTimeout(this._sessionTimerID);
            }
            this._startSessionTimer();
        }
    });

});

