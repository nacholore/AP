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
	"dojo/_base/array",
	"dojo/when",
	"dojo/dom-attr",
	"dojo/on",
	"dojo/query",
	"dojo/request/xhr",
	"dijit/layout/ContentPane",
	"app-client/map/WMSLayer",
	"dojo/store/Memory",
	"put-selector/put",
	"dojo/NodeList-dom"
], function (
	declare,
	lang,
	arrayUtil,
	when,
	domAttr,
	on,
	query,
	xhr,
	ContentPane,
	WMSLayer,
	Memory,
	put
) {
	return declare([ContentPane], {
		title: "Mapa base",


		_store: null,

		_changeBaseMap: function(idLayer) {
			var item = this._store.get(idLayer);
			// La capa no existe
			var layer = new WMSLayer({
				layerId: item.id,
				url: item.url || dojoConfig.geoserver.wms,
				baseLayer: true,
				layersInfo: item.layersInfo
			});
			this.map.addLayer(layer);
		},

		_onChangeBaseMap: function(evt) {
			this._changeBaseMap(domAttr.get(evt.currentTarget, "data-basemap-id"));
		},

		_loadData: function() {
			var self = this;
			xhr("/conf/mapas_base.json", {
				handleAs: "json"
			}).then(function(data) {
				self._store = new Memory(data);
				self._createItems();
			});
		},

		_createItems: function() {
			var self = this;
			when(this._store.query({}), function(results) {
				arrayUtil.forEach(results, function(data) {
					var itemHtml = lang.replace("div.baselayerItemContainer.shadow" + 
						"[data-basemap-id={id}][style=background:url('/resources/img/{img}')]" , data);
					var labelHtml = lang.replace("span.baselayerItemLabel" + 
						"[alt={label}][title={label}]", data);
					var basemapNode = put(self.containerNode, itemHtml); 
					put(basemapNode, labelHtml, data.label); 
						
					on(basemapNode, "click", lang.hitch(self, self._onChangeBaseMap));
				});
				self._changeBaseMap(results[0].id);
			});
		},
		
		postCreate: function () {
			var self = this;
			this.inherited(arguments);
			this._loadData();
			this.map.on("basemap-change", function(layer) {
				query(".active", self.domNode).removeClass("active");
				query("[data-basemap-id=" + layer.layerId  + "]", self.domNode).addClass("active");
			});
		}
	});
});
 
