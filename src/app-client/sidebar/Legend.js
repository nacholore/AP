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
	"dojo/dom-class",
	"dojo/io-query",
	"dojo/query",
	"dijit/layout/_LayoutWidget",
	"put-selector/put",
	"dojo/NodeList-dom"
], function (
	declare,
	lang,
	arrayUtil,
	domClass,
	ioQuery,
	query,	
	_LayoutWidget,
	put
) {
	return declare([_LayoutWidget], {
		title: "Leyenda",
		"class": "legendWidget",
		map: null,
		widthSymb: 15,
		heightSymb: 15,

		_createLegend: function(layer) {
			var queryString = {
				request: "GetLegendGraphic",
				version: layer.layersInfo.version,
				format: layer.layersInfo.format,
				width: this.widthSymb,
				height: this.heightSymb,
				layer: layer.layersInfo.layers
			};
			var url = layer.get("url") + "?" + ioQuery.objectToQuery(queryString);
			var itemNode = put(this.domNode, "div.item[data-map-layerid=" + layer.get("layerId") + "]");
			var headItemNode = put(itemNode, "span.head", layer.get("name"));
			var legendItemNode = put(itemNode, "div.legend img[src=" + url +"]");
		},

		_showLegend: function(layer) {
			query("div[data-map-layerid=" + layer.get("layerId") + "]", this.domNode).forEach(function(item) {
				domClass[layer.get("visible") ? "remove" : "add"](item, "hidden");
			});
		},
		
		postCreate: function() {
			var self = this;
			lang.mixin(this, arguments);
			this.map.on("addLayer", function(layer) {
				layer.on("visible-change", function(value) {
					self._showLegend(this);
				});
				self._createLegend(layer);
			});
		}
	});
});