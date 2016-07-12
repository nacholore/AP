define([
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/json",
	"dojo/dom-geometry",
	"dojo/on",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/Deferred",
	"dijit/form/ToggleButton",
	"dijit/layout/BorderContainer", 
	"dijit/layout/TabContainer", 
	"dijit/layout/StackContainer", 
	"app-client/StackControllerNumber",
	"dijit/layout/ContentPane"
], function (
	lang,
	arrayUtil,
	declare,
	JSON,
	domGeom,
	on,
	domConstruct,
	domAttr,
	Deferred,
	ToggleButton,
	BorderContainer,
	TabContainer,
	StackContainer,
	StackController,
	ContentPane
) {
	return declare([ToggleButton], {
		map: null,
		iconClass: "icon-home",
		_popup: null,
		_RegExPattern: /foto\d*/,
		popupSize: {
			height: 0,
			width: 0
		},
		_setPopupSizeAttr: function(value) {
			if (value.w > this.popupSize.width) {
				this.popupSize.width = value.w;
			}
			if (value.h > this.popupSize.height) {
				this.popupSize.height = value.h;
			}
		},

		onChange: function(value) {
			if (value) 
				this._action.activate();
			else
				this._action.deactivate();
		},


		_addPopup: function(info) {
			this._createContent(info);
			this._popup = new OpenLayers.Popup.CSSFramedCloud(
				"frame",
				this.map.map.getLonLatFromPixel(info.point),
				null,
				'',
				null,
				true,
				lang.hitch(this, this._removePopup)
			);


			this._popup.minSize = new OpenLayers.Size(this.popupSize.width, this.popupSize.height + 150);
			this.map.map.addPopup(this._popup, true);

			this._contentPopup.placeAt("frame_contentDiv");
			this._contentPopup.startup();
			this._contentPopup.resize();		
		},

		_removePopup: function() {
			this.map.map.removePopup(this._popup);
			this._contentPopup.destroy();
			this.popupSize = {
				height: 0,
				width: 0
			};
		},


		_createContent: function(geoJson) {

			var self = this;

			this.set("popupSize", {w: 0, h: 0});

			// Popup general
			this._contentPopup = new BorderContainer({
				style: "height: 100%; width: 100%;padding: 2px;"
			});

			// Cabecera del popup, botón de cerrar
			var nodeClose = domConstruct.create("i", {
				"class": "link icon-remove"
			});
			on(nodeClose, "click", lang.hitch(this, this._removePopup));
			this._contentPopup.addChild(new ContentPane({
				region: "top",
				style: "height: 20px; width: 100%; padding: 3px; text-align: right",
				content: nodeClose
			}));
			

			var contentPopup = BorderContainer({
				style:"width: 100%",
				region: "center"
			});

			var tc = new TabContainer({
				region: "center",
				style:"height: 100%; width: 100%"
			});

			contentPopup.addChild(tc);
			var mapSize = domGeom.position(this.map.domNode, true);

			var nodeHid = domConstruct.create("div", {
				"class": "hidden",
				style: "max-width:400px;max-height:" + parseInt(mapSize.h * 0.6) +"px"
			}, document.body);
			

			for (var key in geoJson.layers) {
				var layer = geoJson.layers[key];
				var bcLayer = refCont = new BorderContainer({
					title: layer.label
				});
				if (layer.features.length > 1) {
					refCont = new StackContainer({
						region: "center",
						title: layer.label
					});
					bcLayer.addChild(new StackController({
						region: "bottom",
						containerId: refCont.id
					}));
					bcLayer.addChild(refCont);
				}
					
				arrayUtil.forEach(layer.features, function(feature) {
					nodeHid.innerHTML = lang.replace(layer.infoTemplate, feature);
					self.set("popupSize", domGeom.position(nodeHid, true));
					var content = layer.infoTemplate;
					if (feature.foto) {
						arrayUtil.forEach(feature.foto, function(foto) {
							content += "<img class='thumbnail' src='" + foto + "'>";
						})
					}
					var feat = new ContentPane({
						title: layer.label,
						style: "height:" + self.popupSize.height + "px",
						region: "center",
						"class": "form-horizontal, bg-silver",
						content: lang.replace(content, feature)
					});
					refCont.addChild(feat);
				});
				tc.addChild(bcLayer);							
			}
			domConstruct.destroy(nodeHid);
			this._contentPopup.addChild(contentPopup);
		},

		_getGeoJson: function() {
			return "hola";
		},

		_getFeatureInfo: function(event) {
			var geoJSON = JSON.parse(event.text);
			// Solo se muestra el popup si hay resultados
			if (geoJSON.features.length > 0) {
				var info = {
					point: event.xy,
					layers:{}
				};	

				// Divide el json devuelto por geoserver, separando cada uno de los
				// features en diferentes capas
				arrayUtil.forEach(geoJSON.features, function(feature) {
					var layer = this.map.getLayerById(feature.id.split(".")[0]);
					if (layer) {
						if (!info.layers[layer.get("layerId")]) {
							info.layers[layer.layerId] = {};
							info.layers[layer.layerId].features = [];
							info.layers[layer.layerId].infoTemplate = layer.get("infoTemplate");				
							info.layers[layer.layerId].name = layer.get("name");
							info.layers[layer.layerId].label = layer.get("name");
						} 
						var feat = {};
						for (var key in feature.properties) {
							if (key.match(this._RegExPattern)) {
								if (feature.properties[key].length > 0) {
									if (feat["foto"] === undefined)
										feat["foto"] = [];
									feat.foto.push(feature.properties[key]);
								}
							} else {
								feat[key] = feature.properties[key];	
							}
						}
						info.layers[layer.layerId].features.push(feat);
					}
				}, this);
				this._addPopup(info);
			}			
		},

		postCreate: function () {
			var self = this;
			this.inherited(arguments);

			this._action = new OpenLayers.Control.WMSGetFeatureInfo({
				url: dojoConfig.geoserver.wms,
				title: 'Identify features by clicking',
				queryVisible: true,
				infoFormat: "application/json",
				vendorParams: {
					infoFormat: "application/json",
				},
				eventListeners: {
					getfeatureinfo: lang.hitch(self, self._getFeatureInfo)
				}
			});
			this.map.map.addControl(this._action);
		}
	});
});
