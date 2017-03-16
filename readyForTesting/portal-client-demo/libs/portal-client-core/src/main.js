// summary:
//      the main file of portal-core
//

define([
    'dojo/string',
    './_base/common/ViewCacheQueue',
    './_base/common/AppStack',
    './_base/common/AppWrapper',
    './apps/UserSpace',
    './_base/common/Loader',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dojo/dom',
    'dojo/io-query',
    'dijit/layout/BorderContainer',
    'dijit/layout/StackContainer',
    './_base/common/Util',
    'dojo/dom-geometry',
    'dojo/_base/config',
    'dojo/has',
    'dojo/when',
    './_base/dialogs/TimeoutDialog',
    'dojo/promise/all',
    './_base/dialogs/LoginDialog',
    './_base/dialogs/ResetPasswdByTokenDialog',
    './_base/common/PortalHashHelper',
    './_base/store/PortalStore',
    './_base/common/Application',
    'dojo/hash',
    'dojo/topic',
    'dojo/_base/array',
    'dijit/_Container',
    './_base/nav/PortalHeader',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    './_base/common/RequirePromise',
    './_base/common/NotificationCenter',
    'xstyle/css!./css/portal.css',
    'xstyle/css!dgrid/css/dgrid.css' //for dgrid v1.0.0
],function(string, ViewCacheQueue, AppStack, AppWrapper, UserSpace, Loader, domConstruct, domClass, dom, ioQuery, BorderContainer, StackContainer, Util, domGeometry, config, has, when, TimeoutDialog, all, LoginDialog, ResetPasswdByTokenDialog, PortalHashHelper, PortalStore, Application, hash, topic, array, Container, PortalHeader, WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare, RequirePromise){

    return declare([BorderContainer],{
                defaultTheme:'yeti',
        _userTheme:'',
        'class':'portal',
        singlePageMode:true,//experimental
        viewCacheSize:5,
        startup:function(){

            var _t=this;
            this.inherited(arguments);
            _t.setTheme(_t.defaultTheme).then(function(){
                domConstruct.empty(_t.domNode);
                return _t._checkLogin().then(function(user){
                    if(user){
                        _t._userTheme=user.settings.theme;
                        return _t.setTheme(_t._userTheme).then(function(){
                            new TimeoutDialog({
                                timeout:(user.sessionTimeout || 1800)*1000
                            }).startTimer();
                            return _t.startupPortal();
                        });
                    }
                });
            }).otherwise(function(err){
                topic.publish('portal/systemMessage',{
                    type:'error',
                    content:"can't start portal",
                    err:err
                })
            })
        },

        _checkLogin:function(){
            var _t=this;
            return PortalStore.users.auth().otherwise(function(data){
                if(hash()=='resetPassword') { //with ! means special
                    //console.log('reseting password');
                    ResetPasswdByTokenDialog.show();
                }else{
                    if(_t.defaultUser){
                        var queryString=location.search;
                        if(!!queryString ){
                            //temp solution for guest login.
                            var obj=ioQuery.queryToObject(queryString.substr(1));
                            if(obj['publicuser'] && obj['publicuser'].toLowerCase() == _t.defaultUser.userName.toLowerCase()){
                                new LoginDialog().loginWithUser(_t.defaultUser);
                                console.debug('auto login with ',_t.defaultUser);
                                return;
                            }
                        }
                    }
                    new LoginDialog().show();
                }
            })
        },
        setTheme:function(theme){
            var themes = [
                "rubyred",
                "sandybrown",
                "seagreen",
                "skyblue",
                "orangered",
                "oceanblue",
                "grassgreen",
                "steelblue",
                "flat"
            ];//TODO consider app.theme just for application part.
            theme = theme || this.defaultTheme;
            return RequirePromise.require(theme).then(function(){
                domClass.replace(document.body,theme,themes)
            },function(err){
                topic.publish('portal/systemMessage',{
                    type:'error',
                    content:string.substitute("can't load theme : ${theme}",{theme:theme}),
                    err:err
                })
            });
        },
        startupPortal:function(){

            ViewCacheQueue.cacheSize = this.viewCacheSize;
            var _t=this;
            return all({
                storeStartup:PortalStore.startup(),
                packages:PortalStore.packages.fetch()
            }).then(function(){
                return all([
                    _t._initPortalHeader(),
                    _t._initApps(),
                    _t._initListeners()
                ])
            }).then(function(){
                //load packages settings
                //TODO no use now? need check.
                var ps= array.map(_t.packages,function(p){
                    return {
                        name: p.name,
                        location: p.path
                    }
                });
                require({
                    packages:ps
                });
                _t._switchAppToHash();
            })
        },
        _initListeners:function(){
            var _t=this;

            topic.subscribe('/dojo/hashchange',function(key){
                console.debug('switch to app',key);
                _t._switchAppToHash();
            });

            topic.subscribe('portal/theme',function(e){
                // e: theme,callback
                // change userTheme need to reload //TODO improve.
                _t.setTheme(_t._userTheme || e.theme).then(e.callback);
                // after setting,
            });

            topic.subscribe('portal/view/fullScreen',function(flag){
                var app = _t.appStack._getSelectedApplication();
                if(flag){
                    all([
                        _t.portalHeader.hide(),
                        app.navBar.hide(),
                        app.footer.hide()
                    ]).then(function(){
                        _t.resize();
                    });
                }else{
                    all([
                        _t.portalHeader.show(),
                        app.navBar.show(),
                        app.footer.show()
                    ]).then(function(){
                        _t.resize();
                    });
                }
            });

        },
        _initPortalHeader:function(){
            this.portalHeader=new PortalHeader({
                'class':"portal-header",
                singlePageMode:this.singlePageMode,
                region:'top'
            });

            this.addChild(this.portalHeader);
        },
        _initApps:function(){
            this.appStack= new AppStack({ region:'center'});
            this.addChild(this.appStack);
        },
        _switchAppToHash:function(){
            var appKey=PortalHashHelper.getAppKey();
            appKey?this.appStack.select(appKey) : this._getDefaultAppKey().then(function(appModel){
                appModel && PortalHashHelper.switchApp(appModel.key);
            })
        },
        _getDefaultAppKey:function(){
            //TODO maybe in future set default app to a app everyone can see (like userspace) will be better.
            var _t=this;
            return PortalStore.appStore.getApps().then(function(apps){
                return array.filter(apps,function(app){
                        return _t.defaultApp == app.key;
                    })[0] || apps[0] || {key:'userspace'};//TODO load as others.
            })
        }
    })

});