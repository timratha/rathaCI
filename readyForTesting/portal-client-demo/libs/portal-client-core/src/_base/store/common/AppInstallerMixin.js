/*
 * mixin for appStore to have feature to install applications,views,widgets
 * */

define([
    '../../common/RequirePromise',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    "dojo/promise/all"
], function (RequirePromise,declare, lang,
    array,
    all
) {
    //todo do some default installation

    //TODO check the keys.

    return declare([],{
        installApplication:function(app,reportN){
            this.reportN=reportN;
            var _t=this;
            if(!this._checkModules(app)){
                throw 'check modules failed';
            }
            //avoid change the origin app model.
            app=lang.clone(app);
            return this._checkAppKey(app.key).then(function(){
                 return all(
                    // install views
                    array.map(app.views, function (view) {
                        return _t.installView(view).then(
                            function(view){
                                _t.out("View installation complete for <b>" + view.key + "</b> (" + view.viewType + ") <br><pre><code>" + JSON.stringify(view, null, 4) + "</pre></code>")
                                return {id: view.id, key: view.key};
                            }
                            , function (error) {
                                _t.out("View installation <font color='red'>ERROR</font> for <b>" + view.key + "</b> (" + view.viewType + ") <br><pre><code>" + JSON.stringify(error, null, 4) + "</pre></code>")
                                return false
                            }
                        );
                    })
                ).then(
                    function(views){
                        app.views=views;
                        return _t.postApp(app);
                    }
                ).then(
                    function(app){
                        _t.out("Application installation complete for <b>" + app.key + "</b> (" + app.applicationType + ") <br><pre><code>" + JSON.stringify(app, null, 4) + "</pre></code>")
                        return app
                    }
                    , function (error) {
                        _t.out("Application installation <font color='red'>ERROR</font> for <b>" + app.key + "</b> (" + app.applicationType + ") <br><pre><code>" + JSON.stringify(error, null, 4) + "</pre></code>")
                         return false
                    }
                );
            });
        },
        installView:function(view){
            var _t=this;
            view= lang.clone(view);
            return this._checkViewKey(view.key).then(function() {
                    return all(
                        array.map(view.widgets, function (widget) {
                            return _t.installWidget(widget).then(
                                function (widget) {
                                    _t.out("Installing <b>" + widget.key + "</b> (" + widget.widgetType + ")" + " for " + view.key + "(" + view.viewType + ") <br><pre><code>" + JSON.stringify(widget, null, 4) + "</pre></code>")
                                    return {id: widget.id, key: widget.key};
                                },
                                function (error) {
                                    _t.out("Widget installation <font color='red'>ERROR</font> for <b>" + widget.key + "</b> (" + widget.viewType + ") <br><pre><code>" + JSON.stringify(error, null, 4) + "</pre></code>")
                                }
                            );
                        })
                    ).then(
                        function (widgets) {
                            view.widgets = widgets;
                            return _t.postView(view);
                        }
                    )
                });
        },
        installWidget:function(widget){
            var _t=this;
            return _t.postWidget(widget);
        },
        out: function (msg) {
            //console.log(msg);
            // to be customize;
            if (this.reportN) {
                this.reportN.innerHTML += "-----<br>" + new Date().toLocaleString() + ":" + msg + "<br>-------";
            }
        },
        _checkModules: function (app) {
            var _viewTypes = [];
            var _widgetTypes = [];
            var _t = this;
            var valid = true;

            array.forEach(app.views,function(view){
                if(view.viewType){
                    valid = valid && _t._checkType(view.viewType,'view');
                }
                array.forEach(view.widgets, function (widget) {
                    if (widget.widgetType) {
                        valid = valid && _t._checkType(widget.widgetType,'widget');
                    }
                });
            });
            return valid;
        },
        _checkType:function(type,viewOrWidget){
            var _t=this;
            var msg = "Checking "+viewOrWidget+" " + type + ": ";
            var status ;
            return RequirePromise.require(type).then(function(){
                status = "OK";
                _t.out(msg + status);
            },function(){
                status = "<font color='red'><b>ERROR</b></font>" + " missing dependency " + type + ". Check registerScript.js";
                _t.out(msg + status);
            })
        },
        _checkAppKey:function(key){
            return this._applicationStore.fetch().then(function(apps){
                var has= array.some(apps,function(app){
                    return app.key==key;
                });
                if(has){
                    throw 'app already exist - key:'+key;
                }
            })
        },
        _checkViewKey:function(key){
            return this._viewStore.filter({key:key}).fetch().then(function(items){
                //TODO another way?
                //if(items.length >0){
                //    throw 'view already exist - key:'+key;
                //}
                return true;
            })
        }
    });
});
