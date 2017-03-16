//this file just use for mock,
define([],function(){
    return {
        gridDash1:	{
            "key": "gridDash1",
            "editTime": "2015-07-07T16:50:18.834+08:00",
            "creationTime": "2015-07-07T16:50:18.834+08:00",
            "label": "test grid1",
            "version": "1",
            "iconClass": "fa fa-angle-double-down", // TODO fa?
            "userID": "5295B972-53C1-44EF-82B4-0324DE6B114F", //TODO check the user ?
            "layout": {
                "config": {
                    "doLayout": false,
                    "isAutoOrganized": false,
                    "nbZones": "2"
                },
                "type": "portal/layouts/GridLayout"
            },
            "widgets": [
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 1, //start with 0
                        "index":1 // the order add to layout
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_001"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 1,
                        "index":3
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_003"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 1,
                        "index":2
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_002"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 1,
                        "index":4
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_004"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 1,
                        "index":5
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_005"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 1,
                        "index":6
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_006"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 1,
                        "index":7
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_007"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 1,
                        "index":8
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_008"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 1,
                        "index":9
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_009"
                    }
                }
            ],
            "config": {}
        },
        gridDash2:	{
            "key": "gridDash2",
            "editTime": "2015-07-07T16:50:18.834+08:00",
            "creationTime": "2015-07-07T16:50:18.834+08:00",
            "label": "test  grid2",
            "version": "1",
            "iconClass": "fa fa-angle-double-down", // TODO fa?
            "userID": "5295B972-53C1-44EF-82B4-0324DE6B114F", //TODO check the user ?
            "layout": {
                "config": {
                    "doLayout": false,
                    "isAutoOrganized": false,
                    "nbZones": "2"
                },
                "type": "portal/layouts/GridLayout"
            },
            "widgets": [
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 0, //start with 0
                        "index":1 // the order add to layout
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_001"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "column": 1,
                        "index":3
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "content of widget_003"
                    }
                }
            ],
            "config": {}
        },
        rasterDash1:	{
            "key": "rasterDash1",
            "editTime": "2015-07-07T16:50:18.834+08:00",
            "creationTime": "2015-07-07T16:50:18.834+08:00",
            "label": "test raster",
            "version": "1",
            "iconClass": "fa fa-angle-double-down", // TODO fa?
            "userID": "5295B972-53C1-44EF-82B4-0324DE6B114F", //TODO check the user ?
            "layout": {
                "config": {
                    cols:3,
                    rows:3
                },
                "type": "portal/layouts/RasterLayout"
            },
            "widgets": [
                {
                    "key": "cw",
                    "layoutChildConfig": {
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "widget2 inside raster"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "widget1 inside raster "
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "widget1 inside raster "
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "widget1 inside raster "
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "widget1 inside raster "
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "widget1 inside raster "
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "widget1 inside raster "
                    }
                }
            ],
            "config": {}
        },
        freeDash1:	{
            "key": "freeDash1",
            "editTime": "2015-07-07T16:50:18.834+08:00",
            "creationTime": "2015-07-07T16:50:18.834+08:00",
            "label": "test free Dash",
            "version": "1",
            "iconClass": "fa fa-angle-double-down",
            "userID": "5295B972-53C1-44EF-82B4-0324DE6B114F",
            "layout": {
                "config": {
                },
                "type": "portal/layouts/FreeLayout"
            },
            "widgets": [
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "pos": {
                            "w": 440,
                            "h": 160,
                            "l": 100,
                            "t": 300
                        },
                        "zIndex": 1
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "widget2 inside free,should on the top"
                    }
                },
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "zIndex": 0
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "widget1 inside free "
                    }
                }
            ],
            "config": {}
        },
        freeDash2:	{
            "key": "freeDash2",
            "editTime": "2015-07-07T16:50:18.834+08:00",
            "creationTime": "2015-07-07T16:50:18.834+08:00",
            "label": "test free Dash2",
            "version": "1",
            "iconClass": "fa fa-angle-double-down",
            "userID": "5295B972-53C1-44EF-82B4-0324DE6B114F",
            "layout": {
                "config": {
                },
                "type": "portal/layouts/FreeLayout"
            },
            "widgets": [
                {
                    "key": "cw",
                    "layoutChildConfig": {
                        "zIndex": 0
                    },
                    "widgetType": "test/widgets/ContentWidget",
                    "label": "test widget",
                    "iconClass": "fa fa-users",
                    "config":{
                        "content": "widget1 inside free "
                    }
                }
            ],
            "config": {}
        }
    }
})