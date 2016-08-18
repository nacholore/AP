define([
	"dojo/_base/lang"
	, "dojo/_base/array"
	, "dojo/_base/declare"
	, "dojo/Evented"
	, "dojo/json"
	, "dijit/form/Button"
	, "dijit/form/TextBox"
	, "dijit/form/Textarea"
	, "dijit/form/DateTextBox"
	, "dijit/layout/ContentPane"
	, "dijit/layout/BorderContainer"
	, "dijit/Dialog"
	, "dojo/request/xhr"
	, "put-selector/put"
	, "dojox/mvc/at"
], function (
	lang
	, arrayUtil
	, declare
	, Evented
	, JSON
	, Button
	, TextBox
	, TextArea
	, DateTextBox
	, ContentPane
	, BorderContainer
	, Dialog
	, xhr
	, put
	, at
) {
	return declare([Button, Evented], {
		map: null,
		iconClass: "icon-print",
		urlService: "/geoserver/pdf/info.json",
		layouts: null,
		scales: null,

		constructor: function(arguments) {
			this.service = {};
			this.info = {
				title: '',
				author: ''
			};
			lang.mixin(this, arguments);
		},

		postCreate: function() {
			this.on("loading", this._onLoading);
			this.on("disabled", this._disabled);
			this.on("ready", this._onReady);
			this.on("ready", !this.dialog && this._createDialog);
			this.on("printed", this._onPrinted);
			this.on("error, loading", this._closeDialog);
			this.on("error", this._onReady);

			this._getConfig();
		},

		_getConfig: function() {
			this.emit("loading", "Cargando configuración");
			xhr(this.urlService, {
				handleAs: "json",
				method: "GET"
			}).then(
				lang.hitch(this, this._serviceAvailable),
				lang.hitch(this, this._serviceNotAvailable)
			);
		},

		_serviceAvailable: function(data) {
			lang.mixin(this.service, data);
			this.emit("ready");
		},

		_serviceNotAvailable: function(error) {
			this.emit("disabled", "Servicio no disponible");
		},

		_createDialog: function() {
			var formPane = new ContentPane({
				region: 'center',
				"class": "formPrint"
			});

			var inputs = {
				title: {
					label: "Titulo",
					type: "ValidationTextBox"
				},
				author: {
					label: "Autor",
					type: "ValidationTextBox"
				}
			};
			for (var key in inputs) {
				this._createInput(formPane.containerNode, inputs[key], key);
			}

			var actionPane = new ContentPane({
				region: 'bottom'
			});

			new Button({ 
				label: "Imprimir",
				"class": "primary",
				onClick: lang.hitch(this, this._print)
			}).placeAt(actionPane.containerNode);

			var layout = new BorderContainer({
				design: "headline",
				"class": "dialogPrint",
				style: "width: 400px; height: 200px;"
			});

			layout.addChild(formPane);
			layout.addChild(actionPane);

			this.dialog = new Dialog({
				title: "Imprimir",
				content: layout
			});
		},

		_createInput: function(node, data, key) {
			var self = this;
			require(["dijit/form/" + data.type], function(Type) {
				
				var rowNode = put(node, "div.form-group"),
					inputNode = new Type({
						placeHolder: data.label,
						trim: true,
						maxLength: 42,
						value: at(self.info, key)
					});
				put(rowNode, "label[for=$]", inputNode.id, data.label);
				inputNode.placeAt(rowNode);
			});
		},

		_closeDialog: function() {
			this.dialog && this.dialog.hide();
		},

		hasDownload: function() {
			return this.urlPdf;
		},

		onClick: function() {
			this.hasDownload() ? this._download() : this.dialog && this.dialog.show();
		},

		_print: function(layout) {
			this.emit("loading", "imprimiendo");

			xhr(this.service.createURL, {
				timeout: 120000,
				handleAs: "json",
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				data: this._requestPrinterConfig()
			}).then(
				lang.hitch(this, this._printed),
				lang.hitch(this, this._printError)
			);
		},

		_printError: function() {
			this.emit("error");
			alert("Ha ocurrido un error imprimiendo");
		},

		_getLayout: function() {
			return this.service.layouts && this.service.layouts.length && this.service.layouts[0].name;
		},

		_getScale: function () {
			var map = this.map.map,
			bounds = map.getBounds(),
			inchesKm = 39.3701 * 1000,
			scales = this.service.scales,
			sw = bounds.getSouthWest(),
			ne = bounds.getNorthEast(),
			halfLat = (sw.lat + ne.lat) / 2,
			midLeft = L.latLng(halfLat, sw.lng),
			midRight = L.latLng(halfLat, ne.lng),
			mwidth = midLeft.distanceTo(midRight),
			pxwidth = map.getSize().x,
			kmPx = mwidth / pxwidth / 1000,
			mscale = (kmPx || 0.000001) * inchesKm * 72,
			closest = Number.POSITIVE_INFINITY,
			i = scales.length,
			diff,
			scale;

			while (i--) {
				diff = Math.abs(mscale - Number(scales[i].value));
				if (diff < closest) {
					closest = diff;
					scale = parseInt(Number(scales[i].value), 10);
				}
			}
			return scale;
		},

		_requestPrinterConfig: function() {
			var layers = this._getLayers();
			var center = this.map.getCenter();
			var scale = this._getScale();

			return JSON.stringify({
					'units': 'degrees',
					'srs':'EPSG:4326',
					'layout': this._getLayout(),
					'dpi':'150',
					'layers': layers,
					'pages':[{
						'center': [center.lng, center.lat],
						'scale': parseInt(scale),
						'rotation': 0,
						'title': this.info.title,
						'author': this.info.author
					}]
				})
		},


		_getLayers: function() {
			var conf = [];
			this.map.getLayers().query({}).forEach(function(layer) {
				var l = {
					baseURL: layer.get("url"),
					opacity: layer.get("opacity"),
					type: layer.get("service"),
					singleTile: !layer.isTiled(),
					layers: layer.get("layers"),
					format: layer.get("format")
				};
				conf.push(l);
			});
			return conf;
		},

		_printed: function(url) {
			this.emit("printed");
			this.urlPdf = url.getURL;
		},

		_download: function() {
			var strWindowFeatures = "location=yes,height=1,width=1,status=yes";
			var win = window.open(this.urlPdf, "_blank", strWindowFeatures);
			this.urlPdf = null;
			this._onDownload();
		},

		_onReady: function() {
			this.set("label", "Imprimir");
			this.set("iconClass", "icon-print");
			this.set("disabled", false);
		},

		_onLoading: function(message) {
			this.set("iconClass", "icon-spinner spin");
			this.set("label", message);
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
