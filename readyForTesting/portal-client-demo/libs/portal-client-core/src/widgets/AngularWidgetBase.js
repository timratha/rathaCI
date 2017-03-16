define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    'angular/angular'
], function (
    WidgetsInTemplateMixin,
    TemplatedMixin,
    WidgetBase,
    declare
) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        modules:[],//angular modules name
        constructor:function(args){
            var _t=this;
            this._configFn=['$provide', function($provide) {
                $provide.decorator('$rootScope', function ($delegate) {
                    angular.merge($delegate,args);
                    angular.merge($delegate,{
                        $saveInstanceData:function(data){
                            _t.emit('update_instance_data',{data:data});
                        }
                        //TODO add other api
                    });
                    return $delegate;
                })
            }]
        },
        startup:function(){
            if(!this._started){
                var mds =  [].concat(this.modules);
                mds.push(this._configFn);
                angular.bootstrap(this.domNode,mds);
            }
            this.inherited(arguments);
        },
        destroy:function(){
            angular.element(this.domNode).scope().$root.$destroy();
            this.inherited(arguments);
        }

    });
});
