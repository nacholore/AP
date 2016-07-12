define([
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/json",
	"dijit/form/ComboButton",
	"dijit/Menu",
	"dijit/MenuItem",
	"dojo/request/xhr",
], function (
	lang,
	arrayUtil,
	declare,
	JSON,
	ComboButton,
	Menu,
	MenuItem,
	xhr
) {
	return declare([ComboButton], {
		map: null,
		iconClass: "icon-print",
		urlService: "/geoserver/pdf/info.json",
		createURL: "",
		layouts: null,
		scales: null,

		constructor: function(arguments) {
			lang.mixin(this, arguments);

			var self = this;
			xhr(this.urlService, {
				handleAs: "json",
				method: "GET"
			}).then(function(data) {
				lang.mixin(self, data);

				var menu = new Menu({ style: "display: none;"});
				arrayUtil.forEach(data.layouts, function(item) {
					menu.addChild(new MenuItem({
						label: item.name,
						value: item.name,
						onClick: function(evt){
							self._print(this.get("value"));
						}
					}));
				});
				self.set("dropDown", menu);
			}, function(erro) {
				self.destroy(true);
			});

		},

		onClick: function() {
			this.urlPdf !== null ? this._download() :  this._print();
		},

		_getLayers: function() {
			var self = this;
			return this.map.get("layers").map(function(layer) {
				if (layer._type === "WMS") {
					var json = {
						baseURL: layer.url,
						opacity: layer.opacity,
						type: layer._type,
						singleTile: layer.singleTile,
						resolutions: [0.703125, 0.3515625, 0.17578125,
						0.010986328125, 0.0054931640625, 0.00274658203125,
						0.001373291015625, 0.0006866455078125, 0.0003433227539062,
						0.0001716613769531, 0.0000858306884766, 0.0000429153442383,
						0.0000214576721191, 0.0000107288360596, 0.0000053644180298,
						0.0000026822090149, 0.0000013411045074, 0.0000006705522537,
						0.0000003352761269
					]
					};
					lang.mixin(json, layer.layersInfo);
					return json;
				}
			});
		},

		_print: function(layout) {
			var self = this;
			var layers = this._getLayers();

			this._onPrinting();

			var center = this.map.getCenter();
			var scale = this.map.getScale();

			layout = layout || this.layouts[0].name;
			var urlPrint = dojoConfig.proxy ? dojoConfig.proxy +
				 this.createURL : this.createURL;

			var dataPrint = {
				'units': 'degrees',
				'srs':'EPSG:4326',

			}
			var data = JSON.stringify({
					'units': 'degrees',
					'srs':'EPSG:4326',
					'layout': layout,
					'dpi':'150',
					'layers': layers,
					'pages':[{
						'center': [center.lon, center.lat],
						'scale': parseInt(scale),
						'rotation':0
					}]
				})

			xhr(urlPrint, {
				timeout: 120000,
				handleAs: "json",
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				data: data
			}).then(function(data) {
				self._onPrinted();
				self.set("urlPdf", data.getURL);
			}, function(error) {
				alert("Ha ocurrido un error imprimiendo");
				self._onPrintError();
			});
		},

		_download: function() {
			var strWindowFeatures = "location=yes,height=1,width=1,status=yes";
			var win = window.open(this.urlPdf, "_blank", strWindowFeatures);
			this.urlPdf = null;
			this._onDownload();
		},

		_onPrinting: function() {
			this.set("iconClass", "icon-spinner spin");
			this.set("label", "Imprimiendo");
			this.set("disabled", true);
		},

		_onPrinted: function() {
			this.set("iconClass", "icon-download-alt");
			this.set("class", "primary");
			this.set("label", "Descargar");
			this.set("disabled", false);
		},

		_onPrintError: function() {
			this.set("label", "Imprimir");
			this.set("iconClass", "icon-print");
			this.set("disabled", false);
		},

		_onDownload: function() {
			this.set("label", "Imprimir");
			this.set("iconClass", "icon-print");
			this.set("class", "");
		}
	});
});