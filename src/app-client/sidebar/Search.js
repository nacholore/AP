/*
 *
 * Autor: Ignacio Lorenzo García
 * Email: nacholore@gmail.com
 * Fecha de creación: 03/06/2013
 *
 * Nombre: BaseLayersWidget.js
 * Descripción: Crea un widget donde muestra las
 *		diferentes capas base que se pueden usar.
 *
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
    "dgrid/Grid",
    'dojo/dom-construct',
    "dgrid/extensions/DijitRegistry"
], function (
	declare,
	lang,
	BorderContainer,
	ContentPane,
	Grid,
	domConstruct,
	DijitRegistry
) {
	return declare([BorderContainer], {
		title: "Buscador",

		renderRow: function (obj) {
			// function used for renderRow for gallery view (large tiled thumbnails)
			return domConstruct.create('div', {
				innerHTML: '<div class="icon" style="background-image:url(resources/' +
					obj.icon + '-128.png);">&nbsp;</div>' +
					'<span class="zoomToFeature"><i class="icon-map-marker" aria-hidden="true"></i></span>' +
					'<div class="name">' + obj.label + '</div>'
			});
		},

		createSearchBox: function() {
			this.addChild(new ContentPane({
				region: "top",
				style: "border: 1px solid green"
			}))
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
 
