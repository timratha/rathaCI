// summary:
//
// instance requirement:
//     getActions:
//          tags:
//              optional
//          returns:
//              list of action options or action (TitleAction)
//     resize:
//          summary:
//              [optional] adjust size according to params
//          size:
//              the target size
define([
    'dojo/dom-class',
    'dojo/topic',
    'dojo/dom-style',
    'dojo/_base/lang',
    'dojo/dom-geometry',
    'xstyle/css!./css/Wrapper.css',
    'dojo/_base/array',
    'dojo/text!./templates/Wrapper.template.html',
    'dijit/layout/_LayoutWidget',
    '../common/Util',
    'dijit/_WidgetBase',
    'dijit/_Container',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/declare',
    '../title-bar/TitleBar'
],function(domClass, topic, domStyle, lang, domGeometry, css, array, template,LayoutWidget, Util,WidgetBase, Container, TemplatedMixin, WidgetsInTemplateMixin, declare,TitleBar
){

    var ErrorMessage = declare([WidgetBase,TemplatedMixin],{
        templateString:"<div class='instance-error-message'>${msg}</div>"
    });

    // summary:
    //		maintain the instance inside and provide function to replace instance.

    return declare([LayoutWidget,TemplatedMixin],{
        // summary:
        //		the instance inside wrapper
        // tags:
        //		private
        instance:null,
        templateString:template,
        baseClass:'wrapper',
        titleBarVisible:true,
        declaredClass:'Wrapper',

        buildRendering:function(){
            this.inherited(arguments);
            this.wrapperTitleBar = new TitleBar(null,this.wrapperTitleBarNode);
            if(this.srcNodeRef) {
                //take the style from srcNodeRef
                domStyle.set(this.domNode, this.srcNodeRef ? this.srcNodeRef.style : {});
            }
        },
        postCreate:function(){
            if(this.srcNodeRef){
                //take the class from srcNodeRef
                if(this.srcNodeRef.classList.length>0){
                    domClass.add(this.domNode,this.srcNodeRef.className)
                }
            }
            this.inherited(arguments);
        },
        // summary:
        //		override addChild function of dijit/_Container to keep just one child.
        //      not suggest to use this function.
        // tags:
        //		private
        addChild:function(instance){
            if(this.getChildren().length){
                console.error('already have one child,do not use this function directly',this.instance,instance);
                throw 'already have one child,do not use this function directly'
            }else{
                this.inherited(arguments);
            }
        },
        // summary:
        //		set the instance inside and replace the instance if there already have one.
        // tags:
        //		public
        _setInstanceAttr:function(instance){
            console.debug('set instance:',this,this.instance,instance);
            if(this.instance == instance){
                if (this.getIndexOfChild(instance) == -1){
                    //set by _applyAttributes when pass by constructor
                    this.addChild(instance);
                }
            }else{
                // replace the instance
                this.removeInstance();
                this.instance=instance;
                this.addChild(instance);
            }


            this._reloadActions();
            if(this._started && !this.instance._started){
                this.instance.startup();
                this.resize();
            }else{
                this.resize();
            }
        },
        // summary:
        //		destroy instance.
        // tags:
        //		public
        removeInstance:function(){
            if(this.instance){
                //TODO need check, comment for : remove first will make dgrid.cleanup not work. some always-on editor widget will not be destroyed.
                //this.removeChild(this.instance);
                this.instance.destroyRecursive();
                this.instance=null;
            }
        },

        // summary:
        //      function for get buildIn actions for titleBar
        // tags:
        //      protected
        _buildInActions:function(){
            return [];
        },

        // summary:
        //      reload actions after change instance.
        // tags:
        //      private
        _reloadActions:function(){
            var _t=this;
            _t.wrapperTitleBar.clearActions();
            //TODO consider titleBar support store
            var actions=Util.concatArray([_t._buildInActions(),this.instance.getActions?this.instance.getActions():[]]);

            actions.sort(function(ac1,ac2){
                ac1.index = ac1.index == undefined ? 100: ac1.index;
                ac2.index = ac2.index == undefined ? 100: ac2.index;
                return ac1.index-ac2.index;
            });
            array.forEach(actions,function(action){
                _t.wrapperTitleBar.addAction(action);
            });
        },
        // summary:
        //      resize titleBar and instance according param
        layout:function(){
            // first need to check element is visible. or will give the wrong size.
            // this solution to check visible not work if parent set visibilty: hidden or opacity: 0 , but it doesn't matter

            // layout process key point:
            //   never set size for containerNode.
            //   may set size for wrapper
            //   pass calculated size for instance , if not wrapper sized by outside , will pass just call instance.resize() , let instance to decide how to size.

            if(this.domNode.offsetHeight !=0 ){
                var inner = domGeometry.getContentBox(this.domNode);
                var titleH = domGeometry.getMarginBox(this.wrapperTitleBar.domNode).h;
                domStyle.set(this.outerNode,'paddingTop',titleH+'px');

                // try to hide every thing inside and get the dim , compare to origin, so check if the size have been set by someway(by style or class)
                var wrapperSize0 = domGeometry.getContentBox(this.domNode);
                this.containerNode.style.display = 'none';
                this.titleBarContainerNode.style.display = 'none';
                var op = this.domNode.style.position;
                this.domNode.style.position = 'absolute';//get out flow.
                var wrapperSize1 = domGeometry.getContentBox(this.domNode);
                this.domNode.style.position = op;
                this.containerNode.style.display = '';
                this.titleBarContainerNode.style.display = '';

                // check if sized
                var wIsSized = wrapperSize0.w == wrapperSize1.w;
                var hIsSized = wrapperSize0.h == wrapperSize1.h ; //means size has been set by outside.

                if (this.instance && this.instance.resize) {
                        domStyle.set(this.containerNode,'overflow','hidden');//get nature size
                        var dim = domGeometry.getContentBox(this.containerNode);
                        var size = wIsSized || hIsSized ? {} : null;
                        wIsSized ? size.w=dim.w:0;
                        hIsSized ? size.h=dim.h:0;
                        //console.debug('resize instance',size);
                        //set overflow = auto before child resize, make sure children will get right nature size.
                        // see test file test_bug_resize.html
                        domStyle.set(this.containerNode,'overflow','auto');
                        this.instance.resize(size);

                        var dim2 = domGeometry.getContentBox(this.containerNode);
                        //console.debug('containerNode size after resize:',dim2);

                }
            }
        },

        _setTitleAttr:function(title){
           this.wrapperTitleBar.set('title',title);
           this.title= title;
        },
        _setTitleIconAttr:function(icon){
            this.wrapperTitleBar.set('titleIcon',icon);
            this.titleIcon= icon; //TODO rename iconClass
        },
        //tag protected
        error:function(err){
            console.error(err,err.stack);
            this.set('instance',new ErrorMessage({
                msg:'create failed'
            }))
            //TODO consider
            //topic.publish('portal/systemMessage',{
            //    type:'error',
            //    content:msg
            //})
        },
        hide:function(){
            this.inherited(arguments);
            domClass.add(this.domNode,'hide');
        },
        show:function(){
            this.inherited(arguments);
            domClass.remove(this.domNode,'hide');
        },
        startup:function(){
            this.wrapperTitleBar.startup();
            if(!this.titleBarVisible){
                this.wrapperTitleBar.hide();
            }
            this.inherited(arguments);
        }
});
});