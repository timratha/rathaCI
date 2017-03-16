define([
    'dojo/store/Memory',
    'dojo/json',
    'dojo/text!../../../portal-client-core/test/data/users.json',
    './LocalDB/LocalDBs',
    './rest/ViewRestStore',
    './memory/SimpleDocsMemoryStore',
    './rest/SimpleDocsRestStore',
    'dojo/_base/array',
    'dojo/promise/all',
    'dojo/when',
    './memory/Wiski7MemoryStore',
    './rest/Wiski7RestStore',
    'dstore/Memory',
    'dojo/_base/lang',
    'dojo/Deferred',
    './memory/AppMemoryStore',
    './rest/AppRestStore',
    './memory/UserMemoryStore',
    './rest/UserRestStore',
    './rest/MessagesRestStore',
    './memory/MessagesMemoryStore',
    './rest/DashboardRestStore',
    './memory/DashboardMemoryStore',
    './memory/LayoutMemoryStore',
    './rest/WidgetTypeRestStore',
    './rest/DataSourcesRestStore',
    './rest/PermissionGroupsRestStore',
    './rest/PermissionsRestStore',
    './rest/MyTimeSeriesRestStore',
    './rest/ProcosRestStore',
    './rest/BelVisRestStore',
    './rest/PackagesRestStore',
    './memory/WidgetMemoryStore',
    './rest/WidgetRestStore',
    './rest/SystemRestStore',
    './memory/SystemMemoryStore',
    './rest/WHSRestStore',
    './memory/WHSMemoryStore'
], function(storeMemory, json, userJSON, LocalDBs,  ViewRestStore, SimpleDocsMemoryStore, SimpleDocsRestStore, array, all, when, Wiski7MemoryStore, Wiski7RestStore, Memory, lang, Deferred, AppMemoryStore, AppRestStore, UserMemoryStore,
                         UserRestStore, MessagesRestStore, MessagesMemoryStore, DashboardRestStore,
                         DashboardMemoryStore, LayoutMemoryStore, WidgetTypeRestStore,
                         DataSourcesRestStore, PermissionGroupsRestStore, PermissionsRestStore,
                         MyTimeSeriesRestStore,
                         ProcosRestStore,
                         BelVisRestStore,
                         PackagesRestStore,
                         WidgetMemoryStore,
                         WidgetRestStore,
                         SystemRestStore,
                         SystemMemoryStore,
                         WHSRestStore,
                         WHSMemoryStore

){
    //TODO
    return {
        _started:false,
        widgets:null,
        appStore:null,
        users:null,
        messages:null,
        dashboards:null,
        layouts:null,
        widgetTypeStore:null,
        myTimeSeries:null,
        ProcosRestStore:null,
        BelVisRestStore:null,
        packages:null,
        dataSources:null,
        permissionGroups:null,
        permissions:null,
        WHSRestStore:null,//TODO rename to whsStore.
        wiski7:null,
        simpleDocs:null,
        themes:null,

        setStore:function(type,options){
            this.options=options;
            var _t = this;
            var _param = {basepath:(options && options.basePath) || "//" + window.location.host + "/KiWebPortal"};
            this.userList = [];

            //console.debug('store params:',_param);
            if(type=="rest") {
                this.widgets=new WidgetRestStore(_param);

                this.views=new ViewRestStore(_param);

                this.layouts=new LayoutMemoryStore();//TODO
                this.appStore = new AppRestStore(lang.mixin({
                    permissionGroups:this.permissionGroups,
                    permissions:this.permissions,
                    _widgetStore:this.widgets,
                    _viewStore:this.views
                },_param));
                this.dashboards=new DashboardRestStore(lang.mixin({
                    _widgetStore:this.widgets
                },_param));



                this.messages=new MessagesRestStore(_param);

                this.widgetTypeStore=new WidgetTypeRestStore(_param);
                this.dataSources=new DataSourcesRestStore(_param);
                this.permissionGroups=new PermissionGroupsRestStore(_param);
                this.permissions=new PermissionsRestStore(_param);
                //this.users=new UserRestStore(lang.mixin({
                //    permissionGroups:this.permissionGroups,
                //    permissions:this.permissions
                //},_param));

                //console.log("Hello world!!")
                //json.par
                //mockUsers = json.parse(userJSON)
                //console.log(mockUsers)
                //console.log("Hello world!!")

                this.myTimeSeries= new MyTimeSeriesRestStore(_param);
                this.ProcosRestStore= new ProcosRestStore(_param);
                this.BelVisRestStore= new BelVisRestStore(_param);
                this.packages= new PackagesRestStore(_param);
                this.system = new SystemRestStore(_param);
                this.WHSRestStore = new WHSRestStore(_param);
                this.wiski7=new Wiski7RestStore(_param);
                this.simpleDocs = new SimpleDocsRestStore(_param);

            }else if(type=="memory"){
                this.widgets=new WidgetMemoryStore();
                this.layouts=new LayoutMemoryStore();
                this.appStore=new AppMemoryStore({
                    _widgetStore:this.widgets
                });
                this.dashboards=new DashboardMemoryStore({
                    _widgetStore:this.widgets
                });

                this.users=new UserMemoryStore();
                this.WHSRestStore = new WHSMemoryStore();
                //TODO
                this.messages=new MessagesMemoryStore();
                this.packages= new Memory({data:[]});
                this.system = new SystemMemoryStore();
                this.wiski7=new Wiski7MemoryStore();
                this.simpleDocs = new SimpleDocsMemoryStore()
                //array.forEach( users = json.parse(userJSON), function(user){
                //    user.add
                //});
                this.userList = new Memory({data: json.parse(userJSON)})

                //this.userList = json.parse(userJSON)
                //
                //array.forEach(users= json.parse(userJSON), function(user,i){
                //
                //    console.log(user)
                //
                //    _t.userList.firstname = user.firstName;
                //    _t.userList.lastname = user.lastName;
                //    _t.userList.username = user.username;
                //    _t.userList.email = user.email;
                //    _t.userList.Language = "";
                //    _t.userList.createdtime = user.createdTime;
                //});

            }
            this.instanceCache=LocalDBs.instanceCache;
            this.themes=new Memory({
                data:[
                    {label: 'default', "value": ''},
                    {label: 'yeti', "value": 'yeti'},
                    {label:"flat",value:"flat"},
                    {label:"ki-rubyred",value:"rubyred"},
                    {label:"ki-sandybrown",value:"sandybrown"},
                    {label:"ki-seagreen",value:"seagreen"},
                    {label:"ki-skyblue",value:"skyblue"},
                    {label:"ki-orangered",value:"orangered"},
                    {label:"ki-oceanblue",value:"oceanblue"},
                    {label:"ki-grassgreen",value:"grassgreen"},
                    {label:"ki-steelblue",value:"steelblue"}
                ]
            })
        },
        startup:function(){
            var _t=this;
            return when(!_t._started).then(function(){
                _t._started=true;
                // put some store logic here to make store work after user login
                return all([_t.users.startup()]).then(function(){
                    _t.users.checkPermission('portal-client-core.messages') &&  _t.messages.startup();


                });
            })
        }
    }
})