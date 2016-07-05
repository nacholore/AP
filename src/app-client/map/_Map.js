/*
 * 
 * Autor: Ignacio Lorenzo García
 * Email: nacholore@gmail.com
 * Fecha de creación: 03/06/2013
 *
 * Nombre: MapWidget.js
 * Descripción: Genera un mapa utilizando la librería de javascript
 * 	OpenLayers.
 * 
 */
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/Evented",
	"dijit/layout/ContentPane",
	"dijit/layout/_LayoutWidget",
	"dojo/store/Observable",
	"dojo/store/Memory"
], function (
	declare,
	lang,
	arrayUtils,
	Evented,
	ContentPane,
	_LayoutWidget,
	Observable,
	Memory
) {
	return declare([_LayoutWidget, Evented], {
		map: null,
		
		layers: null,
		_getLayersAttr: function() {
			return this.layers.query(function(layer){
					return layer.visible === true;
				}, {sort: [{attribute: "baseLayer", descending: true}]});
		},
		getLayerById: function(layerID) {
			return this.layers.get(layerID);
		},

		_addLayer: function(layer) {
			this.map.addLayer(layer.get("olLayer"));
			if (!layer.baseLayer) this.emit("addLayer", layer);
		},

		_removeLayer: function(layer) {
			this.map.removeLayer(layer.get("olLayer"));
			if (!layer.baseLayer) this.emit("removeLayer", layer);
		},

		// Añade una capa al mapa
		addLayer: function(layer) {
			if (!this.layers.get(layer.layerId)) {
				this.layers.add(layer);
				if (layer.baseLayer)
					this.set("baseLayer", layer);
			}
		},

		baseLayer: null,
		_setBaseLayerAttr: function(layer) {
			if (this.baseLayer) {
				this.layers.remove(this.baseLayer.layerId);
			} else {
				this.map.zoomToMaxExtent();
			}
			this.map.setBaseLayer(layer.get("olLayer"));
			this._set("baseLayer", layer);
			this.emit("basemap-change", layer);

		},

		// Elimina una capa al mapa
		removeLayer: function(layer) {
			if (!this.layers.get(layer.layerId)) {
				this.layers.remove(layer.layerId);
			}		
		},

		constructor: function() {
			lang.mixin(this, arguments);
			var self = this;
			this.layers = new Observable(
					new Memory({
						idProperty: "layerId",
						data: []
					}));

			results = this.layers.query({});
			results.observe(function(object, removedFrom, insertedInto){
				if(removedFrom > -1){ // existing object removed
					self._removeLayer(object);
				}
				if(insertedInto > -1){ // new or updated object inserted
					self._addLayer(object);
				}			
			});
		},

		// Construye el mapa
		buildMap: function() {
			this.map = new OpenLayers.Map(this.domNode, this.spatialRef);
			this.map.addControls([
				new OpenLayers.Control.OverviewMap(),
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.ScaleLine({
					maxWidth: 250
				})
			]);
		},

		getLayer: function(/* string */ id) {
			return this.layers.get(id);
		},

		restrictedExtent: null,
		_setRestrictedExtentAttr: function(bounds) {
			this.map.setOptions({
				restrictedExtent: bounds
			});
			this.restrictedExtent = bounds;
			this.emit("restrictedExtent-change", bounds);
		},

		zoomToMaxExtent: function() {
			this.map.zoomToMaxExtent();
			this.emit("zoom-change");
		},

		// Cambia la restricción del extent
		_changeBoudingBox: function(item) {
			this.map.setOptions({restrictedExtent: item.bounds});
		},

		_getAttrsOL: function() {
			var properties = ["projection", "Zoom", "Scale", "Center"];
			arrayUtils.forEach(properties, function(prop) {
				this["get" + prop] = function() {
					return this.map["get"+prop]();
				};
			}, this);
		},
		
		postCreate: function () {
			this.buildMap();
			this.on("restrictedExtent-change", this.zoomToMaxExtent);			
			this._getAttrsOL();			
		},

		resize: function() {
			this.map.updateSize();
		}
	});
});