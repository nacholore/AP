define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/Evented",
	"dojo/Stateful"
], function (
	declare,
	arrayUtil,
	lang,
	Evented,
	Stateful
) {
	return declare([Stateful, Evented], {
		_type: "WMS",
		_olLayer: "",

		layerId: "",
		name:"",
		url: "",

		infoTemplate: null,
		_infoTemplateSetter: function(value) {
			this.infoTemplate = lang.isArray(value) ? value.join('') : value;
			this.emit("infoTemplate-change", this);
		},

		baseLayer: false,
		singleTile: false,

		olLayer: null,
		_olLayerGetter: function() {
			if (this.olLayer === null)
				this.olLayer = new OpenLayers.Layer.WMS(this.layerId, 
					this.url, this.layersInfo, {
						isBaseLayer: this.baseLayer,
						opacity: this.opacity,
						singleTile: this.singleTile
					});
			return this.olLayer;
		},

		visible: true,
		_visibleSetter: function(value) {
			if (typeof value  === "boolean") {	
				this.visible = value;
				this.olLayer.setVisibility(value);
				this.emit("visible-change", value);
			}
		},

		opacity: 1,
		_setOpacityAttr: function(value) {
			if (typeof value === "number") {
				this.opacity = value;
				this.emit("opacity-change", value);
					
			}
		},

		_getAttrsOL: function() {
			var properties = ["projection", "maxExtent", "minExtent", "maxResolution", 
					"minResolution", "numZoomLevels", "minScale", "maxScale"];
			arrayUtil.forEach(properties, function(prop) {
				this["get" + prop] = function() {
					return this.map[prop];
				};
			}, this);
		},

		constructor: function(args) {
			
			this.layersInfo = {
				version: "1.1.1",
				layers: null,
				format: "image/png"
			};

			if (args.layersInfo) {
				lang.mixin(this.layersInfo, args.layersInfo);
				delete args.layersInfo;
			}
			lang.mixin(this, args);
			this._getAttrsOL();
		}
	});
});