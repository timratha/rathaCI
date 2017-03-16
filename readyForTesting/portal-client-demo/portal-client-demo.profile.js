var profile = {

	basePath: './',
	releaseDir:'./build',
	releaseName:'0.1.2', //change releaseName in Gruntfile too.
	action: 'release',
	cssOptimize: 'comments',
	mini: true,
	optimize: 'shrinksafe',
	layerOptimize: 'shrinksafe',
	stripConsole: 'all',
	selectorEngine: 'acme',
	localeList: "en,en-gb,de",
	insertAbsMids:false,
    useSourceMaps:false,
	packages:[
		{
            name: "dojo",
            location: "libs/dojo"
        },{
            name: "dijit",
            location: "libs/dijit"
        },{
            name: "dojox",
            location: "libs/dojox"
        },{ 
            name: "dgrid",
            location: "libs/dgrid"
        },{ 
            name: "dstore",
            location: "libs/dstore"
        },{ 
            name: "highcharts",
            location: "libs/highcharts"
        },{
            name: "portal",
            location: "../portal-client-core/src"
        },{
            name: "xstyle",
            location: "libs/xstyle"
        },{
            name: "put-selector",
            location: "libs/put-selector"
        },{
            name: "portal-client-demo",
            location: "src"
        }],
	layers: {          
            'portal-client-demo/layer': {
                include: [
                    "portal-client-demo/views/exampleView",
                    "portal-client-demo/views/exampleView2",
                    "portal-client-demo/views/GalleryView",
                    "portal-client-demo/views/chartView",
                    "portal-client-demo/views/airView",
                    "portal-client-demo/views/viewWidgets",
                    'portal-client-demo/widgets/exampleWidget',
                    'portal-client-demo/widgets/GraphExamples',
                    'portal-client-demo/widgets/ExampleOptimierung',
                    'portal-client-demo/widgets/iframeWidget',
                    'portal-client-demo/widgets/Phelix'
                ],
                exclude: ["highcharts/highcharts","highcharts/highstock",'portal-client-demo/data/rees','portal-client-demo/data/pfm','portal-client-demo/data/lg','portal-client-demo/data/cs','portal-client-demo/data/aachen_daily','portal-client-demo/data/aachen_hourly','portal-client-demo/data/aachen_scatter','portal-client-demo/data/polar']
            }
	}

};