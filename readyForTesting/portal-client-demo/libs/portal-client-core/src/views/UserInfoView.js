define([
    'dojo/topic',
    '../_base/dialogs/ResetPasswordDialog',
    'dijit/form/Select',
    '../_base/store/PortalStore',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'dojo/text!./templates/UserInfoView.template.html',
    'dijit/form/Form',
    'dijit/form/ValidationTextBox',
    'dojo/dom-class',
    '../controllers/EditField',
    'dojo/on',
    'dojo/dom-style',
    'dojo/_base/array',
    'dojo/date/locale',
    '../controllers/TimezoneSelector',
    "dojo/i18n!./nls/UserInfoView",
    'xstyle/css!./css/UserInfoView.css'
], function (topic, ResetPasswordDialog, Select, PortalStore,
                    WidgetsInTemplateMixin
    , TemplatedMixin
    , WidgetBase
    , declare
    , template
    , Form
    , ValidationTextBox,
                    domClass,
                    EditField,
                    on,
                    domStyle,
                    array,
                    dateLocale,
                    TimezoneSelector,
                    nls
) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,
        fields:null,
        baseClass:"userInfoView",
        declaredClass:'UserInfoView',

        postMixInProperties: function () {
            this.inherited(arguments);
            this.fields=[];
        },

        buildRendering: function () {
            this.inherited(arguments);
        },


        postCreate: function () {
            this.inherited(arguments);
            this.imageUploadEvents()


            this._createField({
                editor:ValidationTextBox,
                label:nls.userName,
                editorParams:{
                    name:'userName'
                }
            });
            this._createField({
                editor:ValidationTextBox,
                label:nls.email,
                editorParams:{
                    name:'email'
                }
            });
            this._createField({
                editor:ValidationTextBox,
                label:nls.Address,
                editorParams:{
                    name:'address'
                }
            });
            this._createField({
                editor:ValidationTextBox,
                label:nls.Message,
                editorParams:{
                    name:'message'
                }
            });
            var dataFormat={
                datePattern:'yyyy-dd-MM'
            };
            this._createField({
                editor:ValidationTextBox,
                label:nls.creationTime,
                editable:false,
                editorParams:{
                    readOnly : true,
                    name:'creationTime',
                    format:function(value){
                        return dateLocale.format(new Date(value),dataFormat);
                    },
                    parse:function(value){
                        return dateLocale.parse(value,dataFormat);
                    }
                }
            });
            this._createField({
                editor:TimezoneSelector,
                label:nls.Timezone,
                editorParams:{
                    readOnly:!PortalStore.users.checkPermission('portal-client-core.changeTimezone'),
                    name:'timeZone'
                }
            });
            this._createField({
                editor:Select,
                label:nls.Language,
                editorParams:{
                    readOnly:!PortalStore.users.checkPermission('portal-client-core.changeLanguage'),
                    name:'settings.language',
                    style:'width:210px;',
                    options:[
                        {label:'English', "value": 'en'},
                        {label:'German',  "value": 'de'}
                    ]
                }
            });
            if(PortalStore.users.checkPermission('portal-client-core.userTheme')) {
                this._createField({
                    editor: Select,
                    label: nls.Theme,
                    editorParams: {
                        name: 'settings.theme',
                        style: 'width:210px;',
                        options:PortalStore.themes.fetchSync() //TODO
                    }
                });
            }
            this.resetPwBtn.set('disabled',!PortalStore.users.checkPermission('portal-client-core.resetPassword'));
        },
        _createField:function(options){
            var _t=this;
            var field=new EditField(options);
            this.fields.push(field);
            this.fields_container.addChild(field);
            _t._enableSave();
       /*     on(field,'enable_edit',function(){
                _t._enableSave();
            })*/
        },
        startup: function () {
            this.inherited(arguments);
            this._initValues();
        },
        _initValues:function(){
            var _t= this;
            _t._loading(true);
            PortalStore.users.getCurrentUser().then(
                function(info){
                    _t.userInfoForm.setValues(info); //TODO not test
                    _t._loading(false);
                    if(info.image && info.image.indexOf("data:image")>-1){

                        domStyle.set(_t.placeholderImage,"display","none");
                        domStyle.set(_t.userImage,"display","block");
                        _t.userImage.src = info.image;
                    }else{
                        domStyle.set(_t.userImage,"display","none");
                    }
                },
                function(err){
                    //console.log('load user info failed');
                    _t._loading(false);
                }
            );
        },
        _loading:function(flag){
            var _t= this;
            if(flag){
                domClass.add(_t.userInfoForm.domNode,'field-loading');
            }else{
                domClass.remove(_t.userInfoForm.domNode,'field-loading');
            }
            //TODO create some global loader
        },
        _saving:function(flag){
            var _t= this;
           if(flag){
                domClass.add(_t.userInfoForm.domNode,'saving');
            }else{
                domClass.remove(_t.userInfoForm.domNode,'saving');
            }
        },
        save:function(){
            var userInfo=this.userInfoForm.getValues();
            userInfo.status= "active"; // TODO temporary solution until status is optional again
            if(this.userImg){
                userInfo.image = this.userImg
            }
            var _t=this;
            _t._saving(true);
            PortalStore.users.put(userInfo).then(function(){
                _t.reset();
                _t._initValues();
                topic.publish('portal/systemMessage',{
                    type:'success',
                    content:'save user success'
                })
            }).always(function(){
                _t._saving(false);
            });
        },
        cancel:function(){
            this.reset();
            this._initValues();
        },
        imageUploadEvents:function(){
            var _t = this;

            var readfiles=function (files) {
                var FR= new FileReader();
                FR.onload = function(e) {
                    _t.userImage.src = e.target.result;
                    _t.userImg = e.target.result;
                    domStyle.set(_t.placeholderImage,"display","none");
                    domStyle.set(_t.userImage,"display","block");
                };
                FR.readAsDataURL( files[0] );
            }

            on(this.userPhoto,"dragover",function (e) {
                domClass.add(this,' filehover');
                e.preventDefault();
                return false;
            })

            on(this.userPhoto,"dragleave",function () {
                domClass.remove(this,' filehover'); return false;
            })


            on(this.userPhoto,"dragend",function (e) {
                e.preventDefault();
                return false;
            })

            on(this.userPhoto,"drop",function (e) {
                domClass.remove(this,' filehover')
                e.preventDefault();
                readfiles(e.dataTransfer.files);
            })

            on(this.imageUpload,"change",function(){
                readfiles(this.files);
            })





/*            if ( ele.srcElement.files && ele.srcElement.files[0] ) {
                var FR= new FileReader();
                FR.onload = function(e) {
                    _t.userImage.src = e.target.result;
                    _t.userImg = e.target.result
                };
                FR.readAsDataURL( ele.srcElement.files[0] );
            }*/
        },
        reset:function(){
            array.forEach(this.fields,function(f){
                f.reset();
            })
          //  domStyle.set(this.btn_bar,{display:'none'});
        },
        _enableSave:function(){
            domStyle.set(this.btn_bar,{display:'block'});
        },
        resetPassword:function(){
            ResetPasswordDialog.show();
        }
    });
});
