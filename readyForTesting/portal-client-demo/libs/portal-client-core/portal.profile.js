var profile = {

	basePath: './',
	releaseDir:'./build',
	releaseName:'portal',
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
            name: "portal",
            location: "src"
        },{
			name:'dojo',
			location:'./libs/dojo'
		},{
			name:'dijit',
			location:'./libs/dijit'
		},{
			name:'dojox',
			location:'./libs/dojox'
		},{
			name:'dstore',
			location:'./libs/dstore'
		},{
			name:'dgrid',
			location:'./libs/dgrid'
		},{
			name:'highcharts',
			location:'./libs/highcharts'
		},{
			name:'put-selector',
			location:'./libs/put-selector'
		},{
			name:'xstyle',
			location:'./libs/xstyle'
		},{
			name:'jsPDF',
			location:'./customLibs/jsPDF_fake' //use fake one to through build process, temp solution
		}
	]
	//TODO not work , with error
	,
	layers: {
            'portal/portalLayer': {
                include: [
                    "portal/main"
                ]
            }
	}

};