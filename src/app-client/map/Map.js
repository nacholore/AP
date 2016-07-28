define([
	"dojo/_base/declare"
	, "dijit/layout/ContentPane"
	, "put-selector/put"
	, "app-client/map/_Map"
	, "dojo/store/Memory"
	, "dojo/request/xhr"
	, "dijit/form/Select"
	, "app-client/map/Home"
/*	, "dojo/on"




	, "app-client/map/QueryFeature"
	, "app-client/map/Print"


	, "dojo/json"
	*/
], function (
	declare
	, ContentPane
	, put
	, _Map
	, Memory
	, xhr
	, Select
	, Home
	/*, on	




	, QueryFeature
	, Print


	, JSON
	*/
) {
	return declare([ContentPane], {
		baseClass: "map",
		map: null,
		mapOL: null,
		config: null,

		postCreate: function() {
			var self = this;

			this.mapNode = put(this.containerNode, "div.map[style=width:100%;height:100%;margin:0]");
			this.toolbarNode = put(this.containerNode, "div.toolbar");
			//this.toolbarLeftNode = put(this.containerNode, "div.toolbar.left");
			this.toolbarTopNode = put(this.containerNode, "div.toolbar.top");
			this._createMap();

			xhr("/conf/puertos.json", {
				handleAs: "json"
			}).then(function(conf) {
				self.config = conf;
				self._createToolbar();
			});
		},

		_createMap: function() {
			this.map = new _Map({
			}, this.mapNode);

			//this.mapOL = this.map.map;

			new Home({
				map: this.map,
			});
		},

		_createToolbar: function() {
			var self = this;
		/*	new QueryFeature({
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
			}).placeAt(this.toolbarTopNode);*/

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

		/*	var rest = this.map.on("basemap-change", function() {
				var port = store.get(sel.get("value"));
				self.map.set("restrictedExtent", port.bounds);
				rest.remove();
			});*/
		}
	});
});