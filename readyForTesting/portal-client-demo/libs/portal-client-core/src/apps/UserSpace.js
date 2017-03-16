//summary:  builtin UserSpace app.
define([
    'dojo/_base/declare',
    '../views/DashboardManagement',
    '../views/UserManagementView',
    '../views/DashboardFactoryView',
    '../views/UserInfoView',
    '../views/messagingSystem/MessagingSystem',
    'dojo/_base/array',
    '../_base/store/PortalStore',
    '../_base/common/PortalHashHelper',
    '../_base/viewWrappers/DashboardWrapper',
    '../_base/common/Application'],function(declare, DashboardManagement, UserManagementView, DashboardFactoryView, UserInfoView, MessagingSystem, array, PortalStore, PortalHashHelper, DashboardWrapper, Application){
    return declare([Application],{
        declaredClass:'UserSpace',

        postCreate:function(){
            this.inherited(arguments);
                this._initDashboards();
        },
        _initDashboards:function(){

            var _t=this;
            PortalStore.dashboards.fetch().then(function(dashboards){
                //user dashboard views

                array.forEach(dashboards,function(item){
                    _t.addDashboard(item);
                });
                PortalStore.dashboards.on('delete, add, update', function(resp){
                    //TODO bug , server side need return 201 for add.
                    if(resp.type=="add" ) {
                        _t.addDashboard(resp.target)
                    }else if(resp.type=="update" ) {
                        //TODO patch for 201 in dstore/Rest
                        var model = resp.target;
                        if(!_t.viewStack.getView(model.key)){
                            _t.addDashboard(resp.target);
                        }
                    }else if(resp.type=="delete"){
                        //_t.removeDashBoard(resp.target);
                    }
                },function(err){
                    console.error(err);//TODO alert
                });
            });
        },
        addDashboard:function(dash){

            var _t=this;
            var view=new DashboardWrapper({
                autoLoad:false,
                viewId:dash.id,
                key:dash.key,
                style:"width: 50%;height:100%;"
            });
            _t.addView(view);
            console.debug('add dashboard',dash);
            var viewKey=PortalHashHelper.getViewKey();
            if(viewKey == dash.key){ //TODO check , may have bug ?
                _t.switchView(viewKey);
            }
        },
        removeDashBoard:function(model){

        }
    })
})