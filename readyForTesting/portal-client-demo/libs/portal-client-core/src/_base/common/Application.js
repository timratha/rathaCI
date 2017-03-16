define([
    'dojo/dom-construct',
    'dojo/json',
    'dojo/text!../../package.json',
    'dojo/string',
    'dijit/layout/ContentPane',
    './PortalHashHelper',
    'dojo/dom-class',
    'dojo/dom-geometry',
    '../store/PortalStore',
    '../viewWrappers/ViewWrapper',
    'dojo/_base/array',
    './ViewStack',
    '../nav/NavigationBar',
    'dojo/_base/declare',
    'dijit/layout/BorderContainer',
    'xstyle/css!./css/Application.css'],function(domConstruct, json, packageJSON, string, ContentPane, PortalHashHelper, domClass, domGeometry, PortalStore, ViewWrapper, array, ViewStack, NavigationBar, declare, BorderContainer){
    return declare([BorderContainer],{
        declaredClass:'Application',
        showFooter:true,
        postCreate:function(){
            this.inherited(arguments);
            domClass.add(this.domNode,'app');
            this._initViewStack();
            this._initMenuBar();
            this._initFooter();
            this._initViews();
        },
        _initMenuBar:function(){
            this.navBar=new NavigationBar(this.menu);
            this.addChild(this.navBar);
        },
        _initViewStack:function(){
            this.viewStack=new ViewStack({
                region:'center',
                cacheSize:this.cacheSize
            });
            this.addChild(this.viewStack);
        },
        _initFooter:function(){
            //TODO set content

            this.footer= new declare([ContentPane],{
                hide:function(){
                    domClass.add(this.domNode,'hide');
                },
                show:function(){
                    domClass.remove(this.domNode,'hide');
                }
            })({
                'class':'app-footer',
                region:'bottom'
            });
            if(!this.showFooter){
                this.footer.hide();
            }
            this.addChild(this.footer);
            var _t=this;
            var content = '<div style="float:left;margin-top:10px;">&copy; 2016 KISTERS AG | All rights reserved</div>';
            var info;
                PortalStore.system.about().then(function(system){
                    info =  string.substitute('<div style="float:right;margin-top:10px;">' +
                        'App:${app.version}, ${app.creationTime}, ${app.key} (${app.packageName})' +
                        ' | Core:${core.version}, ${core.versionDate}' +
                        ' | Server:${system.version}, ${system.builddate}' +
                        '</div>'
                        , {
                            app: _t.params,
                            core: json.parse(packageJSON),
                            system: system
                        });
                    if(dojoConfig && dojoConfig.debug) {
                        content += info;

                    }else{
                        info =  string.substitute(
                            'App:${app.version}, ${app.creationTime}, ${app.key} (${app.packageName}) \n' +
                            'Core:${core.version}, ${core.versionDate} \n' +
                            'Server:${system.version}, ${system.builddate} \n'
                            , {
                                app: _t.params,
                                core: json.parse(packageJSON),
                                system: system
                            });
                        content = domConstruct.toDom(content);
                        content.title = info;
                    }
                    _t.footer.set('content', _t.footerContent || content);
                })


        },
        _initViews:function(){
            var _t=this;
            array.forEach(this.views,function(view){
                //console.debug('add view',view);
                    _t.addView(new ViewWrapper({
                        // check permission to decide visible of title bar, in future maybe need consider check it every time updated.
                        configureAble: false,// user settings.
                        titleBarVisible: PortalStore.users.checkPermission('core.config.view.global') >= 2,
                        globalConfigureAble: PortalStore.users.checkPermission('core.config.view.global') >= 2,
                        autoLoad: false,
                        viewId: view.id,
                        key: view.key,
                        model: view.model
                    }));
            });
        },
        addView:function(viewWrapper){
            this.viewStack.addChild(viewWrapper);
        },
        switchView:function(viewKey){
            this.viewStack.select(viewKey);
            this.navBar.selectItem(viewKey);
            this.lastView=viewKey;
            this.emit('update_local_data',{
                data:{
                    lastView:viewKey
                }
            })
        },
        switchViewToHash:function(){
            var viewKey=PortalHashHelper.getViewKey();
            viewKey?this.switchView(viewKey) : PortalHashHelper.switchView(this._getDefaultViewKey());
        },
        _getDefaultViewKey:function(){
            var _t=this;

            if(array.some(this.views,function(view){
                return  view.key == _t.lastView;
            })){
                return _t.lastView
            }
            if(array.some(this.views,function(view){
                    return  view.key == _t.defaultView;
                })){
                return _t.defaultView
            }
            return _t.views[0]&&_t.views[0].key;
        },
        startup:function(){
            this.inherited(arguments);
            this.navBar._autoSize(domGeometry.getContentBox(this.domNode).w);//TODO move inside navBar
        }
    })
});