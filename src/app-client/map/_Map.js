define([
	"dojo/_base/declare"
	, "dojo/_base/lang"
	, "dojo/Evented"
	, "dijit/layout/_LayoutWidget"
	, "dojo/store/Memory"
	, "leaflet"
], function (
	declare
	, lang
	, Evented
	, _LayoutWidget
	, Memory
	, L
) {
	return declare([_LayoutWidget, Evented], {
		map: null,
		layers: null,
		baselayer: null,

		constructor: function() {
			lang.mixin(this, arguments);

			this.layers = new Memory({
						data: []
					});

			this.on("add-layer", this._addLayer);
			this.on("remove-layer", this._removeLayer);
			this.on("change-baselayer", this._changeBaselayer);
		},

		addLayer: function(layer) {
			if (!this.layers.get(layer.id)) {
				this.layers.add(layer);

				if (!layer.isBaseLayer()) {
					this.emit("add-layer", layer)
				} else {
					if (!this.baselayer || this.baselayer && !this.baselayer.equalTo(layer))
						this.emit("change-baselayer", layer);
				}
			}
		},

		removeLayer: function(layer) {
			if (this.layers.get(layer.id)) {
				this.layers.remove(layer.id);
				this.emit("remove-layer", layer);
			}
		},

		postCreate: function () {
			this._buildMap();
	//		this.on("restrictedExtent-change", this.zoomToMaxExtent);			
		},

		_buildMap: function() {

			this.map = L.map(this.domNode, {
				 	center: [28.5, -16.0],
					doubleClickZoom: false,
					attributionControl: false,
    				zoom: 13,
					crs: L.CRS.EPSG4326
					//maxBounds: L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180))
			}); 

//			this.map = new OpenLayers.Map(this.domNode, this.spatialRef);
/*			this.map.addControls([
				new OpenLayers.Control.OverviewMap(),
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.ScaleLine({
					maxWidth: 250
				})
			]);*/
		},
	
		_addLayer: function(layer, index) {
			layer.getLayerL().addTo(this.map, index);
			this.emit("layer-added", layer);
		},

		_removeLayer: function(layer) {
			this.map.removeLayer(layer.getLayerL());
			this.emit("layer-removed", layer);
		},

		_changeBaselayer: function(layer) {
			this.baselayer && this.removeLayer(this.baselayer);

			this.emit("add-layer", layer, 0);
			this.emit("basemap-changed", layer);
			
			this.baselayer = layer;
		},

		resize: function() {
			this.map.invalidateSize();
		}

/*


		_setBaseLayerAttr: function(layer) {
			if (this.baseLayer)
				this.layers.remove(this.baseLayer.id);
			else {
//				this.map.zoomToMaxExtent();
			}
			this.emit("basemap-changed", layer);
			
			layer.addTo(this.map);
			layer.setZIndex(0);

			this._set("baseLayer", layer);
		},


 		_getLayersAttr: function() {
			return this.layers.query(function(layer){
					return layer.visible === true;
				}, {
					sort: [{
						attribute: "baseLayer", 
						descending: true
					}]
				}
			);
		},

		getLayerById: function(layerID) {
			return this.layers.get(layerID);
		},

		_addLayer: function(layer) {
			layer.addTo(this.map)
			
			//if (!layer.baseLayer)
			//	this.emit("addLayer", layer);
		},

		_removeLayer: function(layer) {
			if (!layer.isBaseLayer()) 
				this.emit("removeLayer", layer);
			this.map.removeLayer(layer.layer);
		},

		// Elimina una capa al mapa



		getLayer: function(id) {
			return this.layers.get(id);
		},

		restrictedExtent: null,
		_setRestrictedExtentAttr: function(bounds) {
/*			this.map.setOptions({
				restrictedExtent: bounds
			});
			this.restrictedExtent = bounds;
			this.emit("restrictedExtent-change", bounds);
		},

		zoomToMaxExtent: function() {
//			this.map.zoomToMaxExtent();
			this.emit("zoom-change");
		},

		// Cambia la restricción del extent
		_changeBoudingBox: function(item) {
//			this.map.setOptions({restrictedExtent: item.bounds});
		},

		_getAttrsOL: function() {
			var properties = ["projection", "Zoom", "Scale", "Center"];
			arrayUtils.forEach(properties, function(prop) {
				this["get" + prop] = function() {
					return this.map["get"+prop]();
				};
			}, this);
		},
		
*/


	});
});