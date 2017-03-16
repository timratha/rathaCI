define([
    'dojo/hash',
    'dojo/request/notify',
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./templates/TimeoutDialog.template.html",
    "dijit/Dialog",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dijit/form/Form",
    "dojo/_base/array",
    '../store/PortalStore',
    "dojo/dom-form",
    "dijit/registry",
    "../common/MessageBar",
    "dojo/on",
    "dojo/i18n!./nls/login",
    'xstyle/css!./css/TimeoutDialog.css'
],function(hash, notify, declare,
           _WidgetBase,
           _TemplatedMixin,
           _WidgetsInTemplateMixin,
           Container,
           template,
           Dialog,
           TextBox,
           Button,
           Form,
           array,
           PortalStore,
           domForm,
           registry,
           MessageBar,
           on,
           nls
){
    var TimeoutDialog=declare( [_WidgetBase,_TemplatedMixin ,_WidgetsInTemplateMixin,Container],{
        declaredClass:'TimeoutDialog',
        templateString:template,
        timeout:30*60*1000,//default 30 mins
        timer:null,
        counterTimer:null,
        _timeBefore:60*1000,// to avoid time different with server side
        constructor:function(args){
            declare.safeMixin(this,args);
            this.nls = nls;
        },
        show:function(){
            this.dialog.show();
        },
        hide:function(){
            this.dialog.hide();
        },
        continueSession:function(){
            var _t=this;
            PortalStore.users.auth().then(function(user){
                console.debug('continue session');
                _t._continueTimer();
                _t.hide();
            },function(err){
                console.error(err);
            });
        },
        _continueTimer:function(){
            var _t=this;
            if(this.timer){
                clearTimeout(this.timer);
            }
            if(this.counterTimer){
                clearInterval(this.counterTimer);
            }
            this.timer = setTimeout(function(){
                _t._openCounter();
            },this.timeout -this._timeBefore - 10*1000);// 1min before
        },
        startTimer:function(){
            var _t=this;
            _t.hide();
            _t._continueTimer();
            notify("load", function(response){
                _t._continueTimer();
            });
        },
        _openCounter:function(){
            var _t=this;
            console.debug('session going to timeout');
            _t.show();
            _t._startCounter(10,function(){
                PortalStore.users.logout().always(function(){
                    location.href=location.href.substr(0,location.href.indexOf('#'));
                });
            });
        },
        _startCounter: function (seconds,cb) {
            this.restTime = seconds;
            var _t=this;
            _t.set('restTime',_t.restTime);
            this.counterTimer = setInterval(function () {
                _t.set('restTime',_t.restTime);
                if(_t.restTime-- <= 0){
                    clearInterval(_t.counterTimer);
                    cb();
                }
            },1000);
        },
        _setRestTimeAttr:function(seconds){
            this.restTimeNode.innerHTML=seconds;
        }
    });

    return TimeoutDialog;

});