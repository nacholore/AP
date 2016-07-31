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
			location: "leaflet-notiled/"
		},{
			name: "cbtree"
		},{
			name: "put-selector"
		}
	],
	deps: ["leaflet"],
	waitSeconds: 5,
	requestProvider: 'dojo/request/registry',
	selectorEngine: 'lite',
	tlmSiblingOfDojo: false
};