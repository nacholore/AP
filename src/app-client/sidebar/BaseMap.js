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
	"app-client/map/Layer"
	, "dojo/store/Observable"
	, "dojo/store/Memory",
	"put-selector/put",
	"dojo/NodeList-dom"
], function (
	declare
	, lang
	, arrayUtil
	, when
	, domAttr
	, on
	, query
	, xhr
	, ContentPane
	, Layer
	, Observable
	, Memory
	, put
) {
	return declare([ContentPane], {
		title: "Mapa base",
		iconClass: "fa fa-map",
		_baseLayerStore: null,

		optionsBaseMap: {
			baselayer: true
		},


		postCreate: function () {			
			this._loadData();
			this.map.on("basemap-changed", lang.hitch(this, this._setActiveItem));
		},


		_loadData: function() {
			var self = this;
			this._baseLayerStore = new Observable(
					new Memory({
						data: []
					}));

			results = this._baseLayerStore.query({});
			results.observe(function(layer, removedFrom, insertedInto){
				if(removedFrom > -1){
					self._removeItem(layer);
				}
				if(insertedInto > -1){
					self._createItem(layer);
				}			
			});
			
			xhr("/conf/mapas_base.json", {
				handleAs: "json"
			}).then(function(data) {
				for (i = 0; i < data.length; i++) {
					var conf = lang.mixin(data[i], self.optionsBaseMap);
					self._baseLayerStore.add(conf);
				}
			});
		},

		_setActiveItem: function(newLayer) {
			query(".active", this.domNode)
				.removeClass("active");
			query("[data-basemap-id=" + newLayer.id  + "]", this.domNode)
				.addClass("active");
		},

		_createItem: function(layer) {
			var itemHtml = lang.replace("div.baselayerItemContainer.shadow" + 
				"[data-basemap-id={id}][style=background:url('/resources/img/{img}')]" , layer),
				labelHtml = lang.replace("span.baselayerItemLabel" + 
					"[alt={label}][title={label}]", layer),
				basemapNode = put(this.containerNode, itemHtml);

			put(basemapNode, labelHtml, layer.label);		
			on(basemapNode, "click", lang.hitch(this, this._onClickChangeBaseMap));
					
			if (layer.default)
				this._changeBaseMap(layer.id);
		},

		_onClickChangeBaseMap: function(evt) {
			this._changeBaseMap(domAttr.get(evt.currentTarget, "data-basemap-id"));
		},

		_changeBaseMap: function(idLayer) {
			var itemConf = this._baseLayerStore.get(idLayer),
				layer = new Layer(itemConf);

			this.map.addLayer(layer);
		},


		_removeItem: function() {

		}
	});
});
 
