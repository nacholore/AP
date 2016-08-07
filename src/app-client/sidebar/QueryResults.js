define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/query",
	"dijit/layout/_LayoutWidget",
	"put-selector/put",
	"dojo/NodeList-dom"
], function (
	declare,
	lang,
	query,	
	_LayoutWidget,
	put
) {
	return declare([_LayoutWidget], {
		title: "Info",
		"class": "legendWidget",
		iconClass: "fa fa-list",
		map: null,
		
		postCreate: function() {
			lang.mixin(this, arguments);

		//	this.map.on("layer-added", lang.hitch(this, this._addLegend));
		//	this.map.on("layer-removed", lang.hitch(this, this._removeLegend));
		}
	});
});