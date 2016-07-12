define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/form/TextBox",
    "dgrid/Grid",
    'dojo/dom-construct',
    "dgrid/extensions/DijitRegistry"
], function (
	declare,
	lang,
	BorderContainer,
	ContentPane,
	TextBox,
	Grid,
	domConstruct,
	DijitRegistry
) {
	return declare([BorderContainer], {
		title: "Buscador",
		iconClass: "icon-search",

		renderRow: function (obj) {

			return domConstruct.create('div', {
				innerHTML: '<div class="featureRow"><div class="left">' + 
								obj.label +
						   '</div>' +
						   // Icono de zoom
						   '<div class="right zoomToFeature"><i class="icon-map-marker" aria-hidden="true"></i></div></div>'
			});
		},

		createSearchBox: function() {
			this.textBoxSearch = new TextBox({
				placeHolder: "Texto a buscar",
				style: "width:  calc(100% - 4px)"
			});
			
			var textCP = new ContentPane({
				region: "top",
				style: "padding: 10px 0"
			});

			textCP.addChild(this.textBoxSearch);

			this.addChild(textCP);
		},

		createResultList: function() {
			this.grid = new (declare([ Grid, DijitRegistry ]))({
				columns: [{
				        label: 'First Name',
				        field: 'label'
				    },
				    {
				        label: 'Last Name',
				        field: 'coordinates'
				    }],
				showHeader: false,
				renderRow: this.renderRow,
        		region: "center"
    		});

    		this.grid.on('.dgrid-content .dgrid-row .zoomToFeature:click', this.zoomToFeature);
    		this.addChild(this.grid)

		},

		zoomToFeature: function(event) {
			alert("hola has hecho click")
		},

		onNewFeatures: function(features) {
			var features = [
				{ label: "hola", coordinates: [12313.2131, 12321.12321] },
				{ label: "hola 2", coordinates: [12313.2131, 12321.12321] }
			];
			this.grid.renderArray(features);
		},

		postCreate: function () {
			var self = this;
			this.inherited(arguments);
			this.createSearchBox()
			this.createResultList();
			this.onNewFeatures();
		
		}
	});
});
 
