define([
	'dojo/_base/declare'
	, 'dojo/_base/lang'
	, 'dojo/query'
	, 'dojo/dom-construct'
	, 'dijit/layout/_LayoutWidget'
	, 'put-selector/put'
	, 'dojo/NodeList-dom'
], function (
	declare
	, lang
	, query
	, domConstruct
	, _LayoutWidget
	, put
) {
	return declare([_LayoutWidget], {
		title: 'Leyenda',
		'class': 'legendWidget',
		iconClass: 'fa fa-list',
		map: null,

		_addLegend: function(layer) {
			var legendUrl = layer.getLegendUrl();
			if (legendUrl) {
				var itemNode = put(this.domNode, 'div.item[data-map-layerid=' + layer.id + ']');
				put(itemNode, 'div.head', layer.getLabel());
				domConstruct.create('img', {
					'class': 'legend',
					src: legendUrl,
					onload: function() {
						layer.setSizeLegend({
							height: this.height,
							width: this.width
						});
					}
				}, itemNode);
			}
		},

		_removeLegend: function(layer) {
			query('div[data-map-layerid=' + layer.id + ']', this.domNode).forEach(function(node) {
				put(node, '!');
			});
		},
		
		postCreate: function() {
			lang.mixin(this, arguments);

			this.map.on('layer-added', lang.hitch(this, this._addLegend));
			this.map.on('layer-removed', lang.hitch(this, this._removeLegend));
		}
	});
});