define([], function () {
    var a = new Date().getTime()
    var appVersion = "";
    return {
        "key": "Demo",
        "packageName": "portal-client-demo",
        "label": "Demo Application",
        "applicationType": "Demo Application",
        "version": "0.0.9",

        "defaultView": "Energy"+appVersion,
        "menu": {
            "position": "left",
            "menuSize": "responsive",
            "items": [
                {
                    "key": "Energy"+appVersion,
                    "iconClass": "fa fa-flash",
                    "label": "Energy"
                },
				{
                    "key": "RasterMapAnimationViewer "+appVersion,
                    "iconClass": "fa fa-laptop",
                    "label": "RasterMapViewer"
                },
                {
                    "key": "Water"+appVersion,
                    "iconClass": "fa fa-tint",
                    "label": "Water"
                },
                {
                    "key": "Weather"+appVersion,
                    "iconClass": "fa fa-sun-o",
                    "label": "Weather"
                },
                {
                    "key": "Generic"+appVersion,
                    "iconClass": "fa fa-star",
                    "label": "Generic"
                },
                {
                    "key": "Layout"+appVersion,
                    "iconClass": "fa fa-paint-brush",
                    "label": "Layout"
                }
            ]
        },
        "header": {},
        "footer": {},
        "views": [
            {
                key:"Energy"+appVersion,
                version:"0.0.1",
                label:"Energy",
                viewType:"portal-client-demo/views/chartView",
                config:{content:""},
                iconClass:"fa fa-line-flash",
                widgets:[{
                    "key":"w020"+appVersion,
                    version:"0.0.1",
                    "label":"Candlestick Chart",
                    "widgetType":"portal-client-demo/widgets/GraphExamples",
                    "iconClass":"fa fa-line-chart",
                    "config":{type:"cs"}
                },
                    {
                        "key":"w021"+appVersion,
                        version:"0.0.1",
                        "label":"Power consumption",
                        "widgetType":"portal-client-demo/widgets/GraphExamples",
                        "iconClass":"fa fa-line-chart",
                        "config":{type:"lg"}
                    },
                    {
                        "key":"w022"+appVersion,
                        version:"0.0.1",
                        "label":"Portfolio management",
                        "widgetType":"portal-client-demo/widgets/GraphExamples",
                        "iconClass":"fa fa-area-chart",
                        "config":{type:"pfm"}
                    },
                    {
                        "key":"w024"+appVersion,
                        version:"0.0.1",
                        "label":"Phelix Day Peak",
                        "widgetType":"portal-client-demo/widgets/Phelix",
                        "iconClass":"fa fa-line-chart",
                        "config":{type:"daypeak"}
                    },
                    {
                        "key":"w025"+appVersion,
                        version:"0.0.1",
                        "label":"Phelix Day Base",
                        "widgetType":"portal-client-demo/widgets/Phelix",
                        "iconClass":"fa fa-line-chart",
                        "config":{type:"daybase"}
                    }]

            },
            {
                key:"Water"+appVersion,
                version:"0.0.1",
                label:"Charts View",
                viewType:"portal-client-demo/views/chartView",
                config:{content:""},
                iconClass:"fa fa-line-chart",
                widgets:[ {
                    "key":"w023"+appVersion,
                    version:"0.0.1",
                    "label":"Rees Waterlevel",
                    "widgetType":"portal-client-demo/widgets/GraphExamples",
                    "iconClass":"fa fa-line-chart",
                    "config":{type:"rees"}
                }]

            },
            {
                key:"Weather"+appVersion,
                version:"0.0.1",
                label:"Weather",
                viewType:"portal-client-demo/views/viewWidgets",
                config:{content:""},
                iconClass:"",
                widgets:[
                    {
                        "key":"w016"+appVersion,
                        version:"0.0.1",
                        "label":"weather",
                        "widgetType":"portal-client-demo/widgets/WeatherWidget",
                        "iconClass":"fa fa-sun-o",
                        "config":{location:"Germany/North_Rhine-Westphalia/Aachen"}
                    },
                    {
                        "key":"w017"+appVersion,
                        version:"0.0.1",
                        "label":"weather",
                        "widgetType":"portal-client-demo/widgets/WeatherWidget",
                        "iconClass":"fa fa-sun-o",
                        "config":{location:"Germany/North_Rhine-Westphalia/Aachen",viewType:"overview"}
                    },
                    {
                        "key":"w018"+appVersion,
                        version:"0.0.1",
                        "label":"weather",
                        "widgetType":"portal-client-demo/widgets/WeatherWidget",
                        "iconClass":"fa fa-sun-o",
                        "config":{location:"Germany/North_Rhine-Westphalia/Aachen",viewType:"hourbyhour"}
                    }
                ]

            },

            {
                key:"Generic"+appVersion,
                version:"0.0.1",
                label:"Generic",
                viewType:"portal-client-demo/views/viewWidgets",
                config:{content:"hello from View2"},
                iconClass:"",
                widgets:[{
                    "key":"w014"+appVersion,
                    version:"0.0.1",
                    "label":"clock widget",
                    "widgetType":"portal-client-demo/widgets/Clock",
                    "iconClass":"fa fa-filter",
                    "config":{"content":"content from widget in view 1"}
                },
                    {
                        "key":"w0181"+appVersion,
                        version:"0.0.1",
                        "label":"Calendar",
                        "widgetType":"portal-client-demo/widgets/Calendar",
                        "iconClass":"fa fa-calendar",
                        "config":{"content":"Calendar"}
                    },
                    {
                        "key":"w019"+appVersion,
                        version:"0.0.1",
                        "label":"ContentRotator",
                        "widgetType":"portal-client-demo/widgets/ContentRotator",
                        "iconClass":"fa fa-fax",
                        "config":{}
                    } ,
                    {
                        "key":"w0191"+appVersion,
                        version:"0.0.1",
                        "label":"ContentRotator",
                        "widgetType":"portal-client-demo/widgets/ExampleOptimierung",
                        "iconClass":"fa fa-cogs",
                        "config":{}
                    }
                ]

            },
			{
                key:"RasterMapAnimationViewer"+appVersion,
                version:"0.0.1",
                label:"Charts View",
                viewType:"portal-client-demo/views/viewWidgets",
                config:{content:""},
                iconClass:"fa fa-line-chart",
                widgets:[ {
                    "key":"w027"+appVersion,
                    version:"0.0.1",
                    "label":"RasterMapAnimationViewer",
                    "widgetType":"portal-client-demo/widgets/RasterMapAnimationViewer",
                    "iconClass":"fa fa-line-chart",
                    "config":{ baselayer : "osm" , ts_id : 2813010, rasterProvider:"http://vm-gisweb-suse11:8080/KiWIS/KiWIS?datasource=99"}
                },
			    {
                    "key":"w028"+appVersion,
                    version:"0.0.1",
                    "label":"RasterMapAnimationViewer",
                    "widgetType":"portal-client-demo/widgets/RasterToPointSeriesViewer",
                    "iconClass":"fa fa-line-chart",
                    "config":{  ts_id : 2813010, period: "PT3H50M", rasterProvider:"http://vm-gisweb-suse11:8080/KiWIS/KiWIS?datasource=99"}
                }
				
				
				
				]

            }
            //,
            //{
            //    key:"Layout"+appVersion,
            //    version:"0.0.1",
            //    label:"Layout",
            //    viewType:"portal-client-demo/views/GalleryView",
            //    config:{},
            //    iconClass:"fa fa-paint-brush",
            //    widgets:[]
            //
            //}
        ],
        "config": {ne: "da"}
    }
});