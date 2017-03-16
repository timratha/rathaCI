define([
    'dojo/dom-construct',
    'dojo/dom-style',
    'dijit/_Container',
    'dijit/MenuBarItem',
    './LogoMenu',
    './MessageShortCut',
    'dojo/Deferred',
    'dojo/_base/fx',
    '../store/PortalStore',
    './ApplicationSelector',
    './UserPopupMenuItem',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/Menu',
    'dijit/MenuBar',
    'dijit/MenuItem',
    'dijit/MenuSeparator',
    'dijit/PopupMenuBarItem',
    'dijit/RadioMenuItem',
    'dojo/_base/declare',
    'dojo/dom-class',
    'dojo/text!./templates/PortalHeader.template.html',
    'dojo/topic',
    './DashboardSelector',
    'xstyle/css!./css/PortalHeader.css'
],function (domConstruct, domStyle, Container, MenuBarItem, LogoMenu, MessageShortCut, Deferred, baseFx, PortalStore, ApplicationSelector, UserPopupMenuItem, TemplatedMixin, WidgetBase, WidgetsInTemplateMixin,
                          Menu, MenuBar, MenuItem, MenuSeparator, PopupMenuBarItem, RadioMenuItem, declare, domClass, template, topic, DashboardSelector, css){

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin],{
        templateString:template,
        declaredClass:'PortalHeader',

        buildRendering:function(){
            this.inherited(arguments);
            new LogoMenu({},this.logo)
/*            this.toggle=new MenuBarItem({
                label:'<i class="fa fa-bars"></i>',
                onClick:function(){
                    topic.publish('portal/nav/toggleVisible');
                }
            });
            this.leftMenuBar.addChild(this.toggle);*/

            this.applicationSelector=new ApplicationSelector({ singlePageMode:this.singlePageMode});
            this.leftMenuBar.addChild( this.applicationSelector);
            if(PortalStore.users.checkPermission('portal-client-core.messages')) {
                this.rightMenuBar.addChild(new MessageShortCut(),0);
            }
            if(PortalStore.users.checkPermission('core.config.dashboard')) {
                this.rightMenuBar.addChild(this.dashboardSelector=new DashboardSelector());
            }
            this.rightMenuBar.addChild(new UserPopupMenuItem());
                    },
        hide:function(){
            var _t=this;
            var ready= new  Deferred();
            baseFx.fadeOut({
                node:_t.domNode,
                onEnd:function(){
                    _t.domNode.opacity = '';
                    domClass.add(_t.domNode,'hide');
                    ready.resolve();
                }
            }).play();
            return ready.promise;
        },
        show:function(){

            var _t=this;
            var ready= new  Deferred();
            baseFx.fadeIn({
                node:_t.domNode,
                beforeBegin:function(){
                    domClass.remove(_t.domNode,'hide');
                },
                onEnd:function(){
                    _t.domNode.opacity = '';
                    ready.resolve();
                }
            }).play();
            return ready.promise;

        }
    })
});