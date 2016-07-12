define([
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/declare",
	"dojo/request/xhr",
	"dojo/json",
	"dojo/topic",
	"dojo/store/Memory",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/MapControlsWidget.html",
	"dijit/form/ToggleButton",
	"dijit/form/Button",
	"dijit/form/Select",
	"app-client/banner/ToggleButtonGroup"

], function (
	arrayUtil,
	lang,
	declare,
	xhr,
	JSON,
	topic,
	Memory,
	_WidgetBase,
	_TemplatedMixin,
	_WidgetsInTemplateMixin,
	template
) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {
		templateString: template,
		_map: null,


		activeDragPan: function(val) {
			if (val)
				this._controls.dragPan.activate();
			else
				this._controls.dragPan.deactivate();
		},

		activeZoomboxIn: function(val) {
			if (val)
				this._controls.zoomboxIn.activate();
			else
				this._controls.zoomboxIn.deactivate();
		},

		activeZoomboxOut: function(val) {
			if (val)
				this._controls.zoomboxOut.activate();
			else
				this._controls.zoomboxOut.deactivate();
		},

		fullextent: function(val) {
			this.map.zoomToMaxExtent();
		},

		print: function() {
			// Ruta para imprimir
			//localhost:8080/geoserver/pdf/print.pdf?spec={"units":"degrees","srs":"EPSG:4326","layout":"A4 portrait","dpi":"300","mapTitle":"This is the map title","comment":"This is the map comment","layers":[{"baseURL":"http://idecan1.grafcan.es/ServicioWMS/OrtoUrb","version":"1.1.1","type":"WMS","layers":["OU"],"format":"image/jpeg"},{"baseURL":"http://localhost:8080/geoserver/AutoridadPortuaria/wms","opacity":0.5,"singleTile":true,"type":"WMS","layers":["AutoridadPortuaria:Areas_funcionales"],"format":"image/png"}],"pages":[{"center":[-16.216919517518,28.47826814684],"scale":50000,"rotation":0}]}
			var printUrl = "http://localhost:3000/proxy?http://localhost:8080/geoserver/pdf/create.json";
			xhr(printUrl, {
				timeout: 60000,
				handleAs: "json",
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				data: JSON.stringify({
					'units': 'degrees',
					'srs':'EPSG:4326',
					'layout':'A4 portrait',
					'dpi':'300',
					'mapTitle':'This is the map title',
					'comment':'This is the map comment',
					'layers':[{
						'baseURL':'http://idecan1.grafcan.es/ServicioWMS/OrtoUrb',
						'version':'1.1.1',
						'type':'WMS',
						'customParams': {
							'width': 256,
							'height': 256,
							'srs': 'EPSG:4326',
							'projection': 'EPSG:4326'
						},
						'layers':['OU'],
						'format':'image/jpeg'
					}, {
						'baseURL':'http://localhost:8080/geoserver/AutoridadPortuaria/wms',
						'opacity':0.5,
						'singleTile':true,
						'type':'WMS',
						'layers':['AutoridadPortuaria:Areas_funcionales'],
						'format':'image/png'}
					],'pages':[{
						'center': [-16.2, 28.4],
						'scale':50000,
						'rotation':0
					}]
				})
			}).then(function(data) {
				console.debug(data);
			}, function(error) {

			});
		},

		buildNavigationHistory: function() {
			var self = this;
			this.map.addControl(this._controls.zoomboxIn);
			this.map.addControl(this._controls.zoomboxOut);
			this.map.addControl(this._controls.fullextent);
			this.map.addControl(this._controls.dragPan);
			this._controls.query = new OpenLayers.Control.WMSGetFeatureInfo({
				url: "conf/puertos.json",
				title: 'Identify features by clicking',
				queryVisible: true,
				infoFormat: "application/json",
				vendorParams: {
					infoFormat: "application/json",
				},
//				format : new OpenLayers.Format.GeoJSON(),
				eventListeners: {
					getfeatureinfo: function(event) {
						var geoJSON = JSON.parse(event.text);
						var features = geoJSON.features;
						console.debug(features);
						var html = "";
						arrayUtil.forEach(geoJSON.features, function(feature) {
							var layer = self._layers.get(feature.id.split(".")[0]);
							html += "<h2>" + layer.name + "</h2>";
							html += lang.replace(layer.infoTemplate, feature.properties);
						});

						//var layer = self._layers.get();
						var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
						//event.text = event.text.replace(exp,"<a href='$1' target='_blank'>Enlace</a>"); 

						var frameCloud = new OpenLayers.Popup.FramedCloud(
							"frame",
							self.map.getLonLatFromPixel(event.xy),
							null,
							html,
							null,
							true
						);
						frameCloud.maxSize = new OpenLayers.Size(400, 500);
						self.map.addPopup(frameCloud);
					}
				}
			});
			this.map.addControl(this._controls.query);
		},

		changePort: function(value) {
			var configPort = this.portStore.get(value);
			topic.publish("map/boudingbox/change", configPort);
		},

		constructor: function() {
			this.inherited(arguments);
			lang.mixin(this, arguments);

			this._controls =  {
				dragPan: {
					action: this._onDragPan,
					control: new OpenLayers.Control.DragPan()
				}, 
				zoomboxIn: {
					action: this._onZoomBoxIn,
					control: new OpenLayers.Control.ZoomBox()
				},
				zoomboxOut: {
					action: this._onZoomBoxOut,
					control: new OpenLayers.Control.ZoomBox({
						out: true
					})
				},
				home: {
					action: this._onFullExtent,
					control: new OpenLayers.Control.ZoomToMaxExtent()
				},
				print: {
					action: this._onPrint
				},
				port: {
					action: this._onSelectPort
				}
			}; 
			var self = this;
			xhr("conf/capas.json", {
				handleAs: "json"
			}).then(function(data) {
				self._layers = new Memory(data);
			});
		},

		queryFeature: function(val) {
			if (val) {
				this._controls.query.activate();
			} else {
				this._controls.query.deactivate();
			}
		},

		_createButton: function() {

		},

		postCreate: function () {
			this.inherited(arguments);
			this.buildNavigationHistory();
			this.portStore = new Memory({data: this.config.ports});
			this.cbPortNode.setStore(this.portStore);
		}
	});
});