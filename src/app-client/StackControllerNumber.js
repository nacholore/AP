define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"put-selector/put",
	"dijit/form/Button",
	"dojox/mvc/at",
	"dojox/mvc/Output",
	"dojo/Stateful",
	"dijit/registry"
], function (
	declare,
	lang,
	topic,
	ContentPane,
	put,
	Button,
	at,
	Output,
	Stateful,
	registry
) {
	return declare([ContentPane, Stateful], {

		baseClass: "stackController",
		selected: 1,
		total: 10,

		postCreate: function() {
			this.own(
				topic.subscribe(this.containerId + "-startup", lang.hitch(this, "onStartup")),
				topic.subscribe(this.containerId + "-addChild", lang.hitch(this, "onAddChild")),
				topic.subscribe(this.containerId + "-removeChild", lang.hitch(this, "onRemoveChild")),
				topic.subscribe(this.containerId + "-selectChild", lang.hitch(this, "onSelectChild"))
			);

			this.stackNode = put(this.containerNode, "div.controllers");

			this._btnBack = new Button({
				label: "Atrás",
				"class": "primary",
				iconClass: "icon-caret-left",
				showLabel: false,
				onClick: lang.hitch(this, this._back)
			}).placeAt(this.stackNode);

			var contDiv = put(this.stackNode, "span.index");

			new Output({
				value: at(this, "selected")
			}).placeAt(contDiv);

			//this._numSelectedNode = put(this.stackNode, "span", "1");
			put(contDiv, "span", "/");
			new Output({
				value: at(this, "total")
			}).placeAt(contDiv);


			this._btnNext = new Button({
				label: "Siguiente",
				"class": "primary",
				iconClass: "icon-caret-right",
				showLabel: false,
				onClick: lang.hitch(this, this._next)
			}).placeAt(this.stackNode);
		},

		_back: function() {
			if (this.selected > 1) {
				registry.byId(this.containerId).back();
				this.set("selected", this.selected -1);
			}				
		},

		_next: function() {
			if (this.selected < this.total) {
				registry.byId(this.containerId).forward();	
				this.set("selected", this.selected + 1);
			}
		},

		onStartup: function(/*Object*/ info) {
			this.set("total", info.children.length);
		},

		onAddChild: function(/*dijit/_WidgetBase*/ page, /*Integer?*/ insertIndex) {
			console.debug("onAddChild", page, insertIndex);
		},

		onRemoveChild: function() {
			console.debug("onRemoveChild");
		},

		onSelectChild: function(/*dijit/_WidgetBase*/ page) {
			console.debug("onSelectChild", page);
		},

	});
});