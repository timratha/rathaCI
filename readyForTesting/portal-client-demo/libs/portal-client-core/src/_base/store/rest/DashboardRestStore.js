define(['dojo/json',
    'dojo/request',
    'dojo/_base/array',
    'dojo/_base/declare',
    './_ModelRest',
    'dstore/Memory',
    'dstore/Trackable',
    '../common/DashboardStore'],function(json, request, array, declare, _ModelRest,Memory, Trackable,DashboardStore){

    var basepath='';

    return declare([ _ModelRest, Trackable,DashboardStore],{
        constructor:function(args){
            this.inherited(arguments);
            this.target = args.basepath+"/rest/configs/dashboards/";
            basepath=args.basepath;
        }
    })
})