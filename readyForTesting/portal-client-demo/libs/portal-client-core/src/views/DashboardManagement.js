define([
    'dojo/_base/lang',
    'dijit/ConfirmDialog',
    'dijit/Tooltip',
    '../_base/store/PortalStore',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/DashboardManagement.template.html',
    'dijit/form/Form',
    'dijit/form/ValidationTextBox',
    'dojo/dom-class',
    'dojo/on',
    'dojo/dom-style',
    'dojo/_base/array',
    'dojo/dom-construct',
    "dgrid/OnDemandGrid",
    "dgrid/extensions/DijitRegistry",
    "dgrid/Editor",
    "dojo/i18n!./nls/DashboardManagement",
    "../_base/common/IconPicker",
    "dgrid/Tree",
    'xstyle/css!./css/DashboardManagement.css'
], function (lang, ConfirmDialog, Tooltip, PortalStore,
    WidgetsInTemplateMixin
    ,TemplatedMixin
    ,WidgetBase
    ,declare
    ,template
    ,Form
    ,ValidationTextBox,
    domClass,
    on,
    domStyle,
    array,
    domConstruct,
    onDemandGrid,
    DijitRegistry,
    Editor,
    nls,
    IconPicker,
    Tree
) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        baseClass:"DashboardManagement",
        declaredClass:'DashboardManagement',
        fields:[],
        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },


        postCreate: function () {
            this.inherited(arguments);
            var _t= this;
            var columns = [
                {
                    renderExpando: true,
                    label: 'Name',
                    field: 'label',
                    autoSave:true,
                    editor:ValidationTextBox,
                    editOn: "dblclick"
                },
                {label: 'Icon',editor:IconPicker, field: 'iconClass',autoSave:true},
                {label: 'Type', formatter:function(item){return (!!item.layout ) ? nls[item.layout.type] : item.widgetType}},
                {label: 'Created', field: 'creationTime'},
                {label: 'Actions', renderCell:this._renderActionCell}
            ];

            var grid = declare([onDemandGrid,DijitRegistry,Tree,Editor]);
            this.grid= new grid({
                columns:columns,
                collection:PortalStore.dashboards,
                noDataMessage: 'No dashboards defined.',
                loadingMessage:"Loading data..."
            },this.list)
        },
        _createField:function(options){

        },
        _renderActionCell:function(object, value, node, options){
            var cont = domConstruct.create("div",{className:"actionsCont"});
            var _t = this;
            var _delete =function(object){
                var del = domConstruct.toDom("<i class='fa fa-trash-o'></i>");
                on(del,"click",function(e){
                    var  deleteDialog = new ConfirmDialog({
                        title: "Remove dashboard: " +object.label,
                        content: "Are you sure you want to remove this dashboard?"
                    });
                    deleteDialog.on("execute",function(){
                        PortalStore.dashboards.remove(object.id);
                        _t.grid.refresh();
                    })
                    deleteDialog.on("hide",function(){
                        deleteDialog.destroyRecursive();
                    })
                    deleteDialog.show();
                })
                on(del,"mouseover",function(e){
                    Tooltip.show("Delete "+(!!object.widgetType) ? "widget" : "dashboard",this)
                })
                on(del,"mouseleave",function(e){
                    Tooltip.hide(this)
                })
                return del;
            }

             var _moveUp = function(object){
                var moveup = domConstruct.toDom("<i class='fa fa-arrow-up'></i>")
                on(moveup,"click",function(e){
                    //console.log("moveup",object)
                })
                on(moveup,"mouseover",function(e){
                    Tooltip.show("Move up",this)
                })
                on(moveup,"mouseleave",function(e){
                    Tooltip.hide(this)
                })
                return moveup;
            }

            var _moveDown = function(object){
                var movedown = domConstruct.toDom("<i class='fa fa-arrow-down'></i>")
                on(movedown,"click",function(e){
                    //console.log("movedown",object)
                })
                on(movedown,"mouseover",function(e){
                    Tooltip.show("Move down",this)
                })
                on(movedown,"mouseleave",function(e){
                    Tooltip.hide(this)
                })
                return movedown;
            }

            var _clone = function(object){
                var clone = domConstruct.toDom("<i class='fa fa-files-o'></i>")
                on(clone,"click",function(e){
                    var copy = lang.clone(object)
                    delete copy.id
                    copy.label = object.label+'copy';
                    copy.key  = 'dash'+Date.now();
                    PortalStore.dashboards.add(copy);
                    _t.grid.refresh();
                })
                on(clone,"mouseover",function(e){
                    Tooltip.show("Clone this dashboard",this)
                })
                on(clone,"mouseleave",function(e){
                    Tooltip.hide(this)
                })
                return clone;
            }

            domConstruct.place(_delete(object),cont)
            if(!object.widgetType) {
                domConstruct.place(_moveUp(object), cont)
                domConstruct.place(_moveDown(object), cont),
                domConstruct.place(_clone(object), cont)
            }

            return cont;
        },


        resize:function(){
            this.grid.resize();
        },
        startup: function () {
            this.grid.startup();
            this.inherited(arguments);
        }

    });
});
