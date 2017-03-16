/*
 * mixin for dashboardStore to have feature to install some dashboard for developer.
 *
 * */

define([
    'dojo/promise/all',
    'dojo/_base/array',
    'dojo/_base/declare'
], function (all, array, declare
) {
    return declare([],{
        installDashboard:function(dashboard){
            var _t=this;
            return all(
                    array.map(dashboard.widgets,function(w){
                        return _t._widgetStore.add(w).then(function(widget){
                            return {id: widget.id, key: widget.key ,layoutChildConfig: w.layoutChildConfig};
                        })
                    })
                ).then(function (widgets) {
                        dashboard.widgets = widgets;
                        return _t.add(dashboard)
                }).then(function(dashboard){
                    console.debug('dashboards install completed',dashboard);
                    return dashboard;
                }).otherwise(function(err){
                    console.error('install dashboard failed',err);
                })
        }
    });
});
