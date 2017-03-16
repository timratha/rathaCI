define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/_base/array",
    "../viewWrappers/AppViewWrapper",
    "dijit/layout/_LayoutWidget",
    "dojo/hash",
    "dojo/topic",
    '../store/PortalStore',
    '../viewWrappers/DashboardWrapper'
],function(
    declare,
    _WidgetBase,
    _TemplatedMixin,
    array,
    AppViewWrapper,
    _LayoutWidget,
    hash,
    topic,
    PortalStore,
    DashboardWrapper
){

    //TODO select view according to hashString

    return declare([_LayoutWidget,_WidgetBase,_TemplatedMixin],{
        templateString:'<div class="app-body"></div>',
        viewInstances:{},
        currentView:null,
        isLayoutContainer:true,
        started:false,
        constructor:function(){
            this.inherited(arguments);
        },
        postCreate:function(){
            var _t=this;

            //build in views
            array.forEach(_t.buildInViewIDs,function(item){
                _t.addView(item);
            });

            //application views
            array.forEach(_t.viewOptions,function(item){
                _t.addView(item);
            });

            //user dashboard views
            array.forEach(_t.dashboards,function(item){
                _t.addDashboard(item);
            });
            PortalStore.dashboards.on('delete, add, update', function(resp){
                if(resp.type=="add" ) {
                    _t.addDashboard(resp.target)
                }else if(resp.type=="update" ) {
                    _t.removeDashBoard(resp.target);
                    _t.addDashboard(resp.target);
                }else if(resp.type=="delete"){
                    _t.removeDashBoard(resp.target);
                }
            });

            _t.addHashListener();
        },
        startup:function(){
            this.inherited(arguments);
            for(var key in this.viewInstances){
                this.viewInstances[key].startup(); // TODO consider about this, startup after view add ? or when view required first time.
            }
            this.started=true;
            this.resize();
        },
        // just for inner use, outer need change url hash to navigate views.
        _select:function(key){
            var view = (key && this.viewInstances[key]) || this.viewInstances['404'] // TODO 404 set as not found view
            if(view != this.currentView){
                if(this.currentView){
                    this.currentView.hide()
                }
                view.show();
                this.currentView=view;
            }
        },
        addDashboard:function(model){
            var _t=this;
            var view=new DashboardWrapper({
                viewId:model.id,
                key:'dashboard-'+model.key,
                viewTransition:this.viewTransition,
                defaultModel:model.defaultModel
            });
            _t.addChild(view);
        },
        addView:function(model){
            var _t=this;
            var view=new AppViewWrapper({
                // need to use new object prevent modify the origin object
                viewId:model.id,//TODO
                key:model.key,
                viewTransition:this.viewTransition,
                defaultModel:model.defaultModel
            });
            _t.addChild(view);
        },
        removeView:function(viewModel){
            //TODO;
        },
        removeDashBoard:function(model){
            //TODO;
        },
        addChild:function(view){
            this.inherited(arguments);
            this.viewInstances[view.key]=view;
            if(this.started){
                view.startup();
            }
        },
        addHashListener:function(){
            var _t=this;
            var viewKey=hash()||this.defaultView;
            _t._select(viewKey);
            topic.subscribe("/dojo/hashchange", function(changedHash){
                _t._select(changedHash);
            });
        },
        resize:function(){
            this.inherited(arguments);
            //console.log("appbody resize")
            if(this.currentView && typeof this.currentView.resize ==="function") {
                this.currentView.resize();
            }

        }
    });


});