var profile = {

	basePath: './',
	releaseDir:'./build',
	releaseName:'portal',
	action: 'release',
	cssOptimize: 'comments',
	mini: true,
	optimize: 'closure',
	layerOptimize: 'closure',
	stripConsole: 'all',
	selectorEngine: 'acme',
	localeList: "en,en-gb,de",
	insertAbsMids:false,
    useSourceMaps:false,
	optimizeOptions: {
		languageIn: 'ECMASCRIPT5'
	},
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
			name:'jspdf',
			location:'./libs/jspdf'
		},{
			name:'yeti',
			location:'./libs/yeti'
		}
	],
	plugins: {
		"xstyle/css": "xstyle/build/amd-css"
	},
	layers: {
            'portal/layer': {
                include: [
                    "portal/main",
					'portal/views/Dashboard',
					'portal/views/DashboardFactoryView',
					'portal/views/DashboardManagement',
					'portal/views/NotFoundView',
					'portal/views/TemplateView',
					'portal/views/UserInfoView'
                ],
				targetStylesheet:'portal/layer.css'
            }
	}

};