var dojoConfig = {
	isDebug: true,
	async: 1,
	cacheBust: 1,
	baseUrl: "../",
	packages: [{
			name: "dojo"
		},{
			name: "dijit"
		},{
			name: "dojox"
		},{
			name: "dgrid"
		},{
			name: "leaflet",
			main: "leaflet-src",
		},{
			name: "L-navBar",
			location: "leaflet_navbar/src/",
			main: "Leaflet.NavBar"
		},{
			name: "L-measure",
			location: "leaflet-measure/dist/",
			main: "leaflet-measure"
		},{
			name: "L-notTiled",
			location: "leaflet-notiled/",
			main: "NonTiledLayer"
		},{
			name: "L-WMS",
			location: "leaflet-wms/",
			main: "leaflet.wms"
		},{
			name: "L-minimap",
			location: "leaflet-minimap/dist",
			main: "Control.MiniMap.min"
		},{
			name: "cbtree"
		},{
			name: "put-selector"
		}
	],
	deps: ["leaflet"],
	shim: {
		// util depends on jquery.
		// util is non-AMD.
		"L-notTiled": {
			deps: ["leaflet"]
		}
	},
	waitSeconds: 5,
	requestProvider: 'dojo/request/registry',
	selectorEngine: 'lite',
	tlmSiblingOfDojo: false
};