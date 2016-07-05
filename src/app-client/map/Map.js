/*
 * 
 * Autor: Ignacio Lorenzo García
 * Email: nacholore@gmail.com
 * Fecha de creación: 03/03/2014
 *
 * Nombre: Map.js
 * Descripción: Genera un mapa utilizando la librería de javascript
 * OpenLayers.
 * 
 */
define([
	"dojo/_base/declare",
	"dojo/on",
	"dijit/layout/ContentPane",
	"put-selector/put",
	"app-client/map/_Map",
	"app-client/map/Home",
	"app-client/map/QueryFeature",
	"app-client/map/Print",
	"dijit/form/Select",
	"dojo/text!app-client/resources/data/Puertos.json",
	"dojo/json",
	"dojo/store/Memory"
], function (
	declare,
	on,
	ContentPane,
	put,
	_Map,
	Home,
	QueryFeature,
	Print,
	Select,
	config,
	JSON,
	Memory
) {
	return declare([ContentPane], {
		baseClass: "map",
		map: null,
		mapOL: null,
		config: JSON.parse(config),

		postCreate: function() {
			this.mapNode = put(this.containerNode, 
				"div.map[style=width:100%;height:100%;margin:0]");
			this.toolbarNode = put(this.containerNode,
				"div.toolbar");

			this.toolbarLeftNode = put(this.containerNode, "div.toolbar.left");
			this.toolbarTopNode = put(this.containerNode, "div.toolbar.top");


			this.map = new _Map({
				/* Hay que pasarle los parámetros de inicialización */
				spatialRef: {
					projection: new OpenLayers.Projection("EPSG:4326"),
					resolutions: this.config.resolutions
				}
			}, this.mapNode);

			this.mapOL = this.map.map;
			new Home({
				map: this.map,
				label: "Inicio",
				showLabel: false
			}).placeAt(this.toolbarLeftNode);

			this._createToolbar();
		},

		_createToolbar: function() {
			var self = this;
			new QueryFeature({
				label: 'Consultar',
				iconClass: 'icon-info-sign',
				showLabel: false,
				map: this.map
			}).placeAt(this.toolbarTopNode);

			// Imprimir mapa
			new Print({
				label: "Imprimir",
				iconClass: "icon-print",
				showLabel: false,
				map: this.map
			}).placeAt(this.toolbarTopNode);

			var store = Memory({
				data: this.config.ports
			});
			// Seleccionar puerto
			var sel = new Select({
				labelAttr: "name",
				style: "width: 150px;",
				value: 1,
				store: store,
				onChange: function(val) {
					var bounding = this.store.get(val);
					self.map.set("restrictedExtent", bounding.bounds);
				}
			}).placeAt(this.toolbarTopNode);

			var rest = this.map.on("basemap-change", function() {
				var port = store.get(sel.get("value"));
				self.map.set("restrictedExtent", port.bounds);
				rest.remove();
			});
		}
	});
});