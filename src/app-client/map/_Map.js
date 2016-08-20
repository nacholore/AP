define([
	"dojo/_base/declare"
	, "dojo/_base/lang"
	, "dojo/Evented"
	, "dojo/promise/all"
	, "dijit/layout/_LayoutWidget"
	, "dojo/store/Memory"
	, "leaflet"
], function (
	declare
	, lang
	, Evented
	, all
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
			this.on("map-new-query", this._removeFeature);
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
			var layerId = typeof layer === 'string' ? layer : layer.id,
				layer = this.layers.get(layerId)

			if (layer) {
				this.layers.remove(layer.id);
				this.emit("remove-layer", layer);
			}
		},

		postCreate: function () {
			this._buildMap();
		},

		startup: function() {
			this.emit("ready");
		},

		_buildMap: function() {

			this.map = L.map(this.domNode, {
					center: [28.5, -16.0],
					doubleClickZoom: false,
					attributionControl: false,
					zoom: 12,
					crs: L.CRS.EPSG4326,
					uppercase: true,
					maxZoom: 18
			}); 

			this.map.on("click", lang.hitch(this, this._getFeatureInfo));
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

		existsLayer: function(layerId) {
			return this.layers.get(layerId) ? true : false;
		},

		resize: function() {
			this.map.invalidateSize();
		},

		_getFeatureInfo: function(evt) {
			var self = this,
			  	size = this.map.getSize(),
				bounds = this.map.getBounds(),
				query = {
					"width": size.x,
					"height": size.y,
					"bbox": [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].join(','),
					"x": evt.containerPoint.x,
					"y": evt.containerPoint.y
				};
			
			var listDfd = {};
			this.layers.query({}).map(function(item){
				if (!item.isBaseLayer() && item.isQueryable())
					listDfd[item.id] = item.getFeatureInfo(query);
			});

			if (Object.keys(listDfd).length) {
				this.emit("map-new-query");
				all(listDfd).then(function(features) {
					self.emit("map-response-query", features);
				});
			}
		},

		zoomToFeature: function(feature) {
			this._removeFeature();

			this._addFeature(feature);
			this.map.flyToBounds(this.layersFeatures.getBounds());
		},

		_addFeature: function(feature) {
			this.layersFeatures = new L.geoJson(feature, {}).addTo(this.map);
		},

		_removeFeature: function() {
			this.layersFeatures && this.map.removeLayer(this.layersFeatures);
		},

		setMaxBound: function(bound) {
			var maxBounds = {
					xmin: bound[0],
					ymin: bound[1],
					xmax: bound[2],
					ymax: bound[3]
				}
				southWest = new L.LatLng(maxBounds.ymin, maxBounds.xmin),
				northEast = new L.LatLng(maxBounds.ymax, maxBounds.xmax);

			this.map.setMaxBounds(new L.LatLngBounds(southWest, northEast));
			this.emit("set-max-bounds", bound);
		},

		getLayers: function() {
			return this.layers;
		},

		getCenter: function() {
			return this.map.getCenter();
		},

		getZoom: function() {
			return this.map.getZoom();
		},

		getScale: function() {
			return L.CRS.EPSG4326.scale(this.getZoom());
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