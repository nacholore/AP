require([
	"dbootstrap/main",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/AccordionContainer",
	"app-client/sidebar/LayersTree",
	"app-client/sidebar/BaseMap",
	"app-client/sidebar/Legend",
	"app-client/sidebar/Search",
	"app-client/map/Map",
	"dojo/ready"
], function(
		Db,
		BorderContainer,
		ContentPane,
		AccordionContainer,
		LayersTree,
		BaseMap,
		Legend,
		Search,
		Map,
		ready
	) {
	ready(function() {

		// create a BorderContainer as the top widget in the hierarchy
		var bc = new BorderContainer({
			style: "width: 100%; height: 100%;"
		});

		// Sidebar
		var bcSidebar = new BorderContainer({
			style: "width: 30%; height: 100%;",
			region: "leading",
			minWidth: 280,
			splitter: true
		});

		// Logo del puerto
		var cpBanner = new ContentPane({
			style: "height: 50px",
			"class": "banner",
			region: "top"
		});

		// Menú de navegación
		var cpSidebar = AccordionContainer({
			region: "center",
			class: "sidebar"
		});
		bcSidebar.addChild(cpBanner);
		bcSidebar.addChild(cpSidebar);

		bc.addChild(bcSidebar);

		// create a ContentPane as the left pane in the BorderContainer
		var cpMap = new Map({
			region: "center",
			style: "height: 100%; width: 100%; margin: 0"
		});
		bc.addChild(cpMap);

	/*	// Widget para seleccionar las capas disponibles
		cpSidebar.addChild(new LayersTree({
			map: cpMap.map
		}));*/

		// Widget para cambiar el mapa base
		cpSidebar.addChild(new Search({
			map: cpMap.map
		}));

		// Widget para cambiar el mapa base
		cpSidebar.addChild(new BaseMap({
			map: cpMap.map
		}));

/*
		// Widget para cambiar el mapa base
		cpSidebar.addChild(new Legend({
			map: cpMap.map
		}));*/
		
		bc.placeAt(document.body);
		bc.startup();
	});
});