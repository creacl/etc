/**
 * Created by kaaboeld on 18.09.14.
 */

(function (window) {
	function init() {
		var ready;

		var _layout = etc.layout;
		_layout.attr("data-etc", "layout");
		//var _layout = $("body").attr("data-etc","layout");
		_layout.prepend($("<div/>").attr("id", "page").addClass("page-layout"));

		if (window.etc == undefined) {
			console.error("god object not exist");
		}
		var etcControl = etc.fn.addToolbar({
			buttons: [
				/*{
				 "name":"status"
				 },*/
				{
					"name": "switch",
					/*"click":function(){
					 etc.fn.toggleEditable();
					 return false;
					 },*/
					data: {"bind": "toggleEditable"}
				},
				etc.fn.addToolbar({
					buttons: [
						/* Dropdown menu for example
						{"name": "store", type: "dropdown", data: {"bind": "toggleDropdown", "direction": "up", "menuheight": 100, "content": "getPageMenu"}},*/
						{"name": "template", data: {}},
						{"name": "lorem", type: "toggle", data: {"bind": "etc.fn.grid.lorem"}},
						{"name": "grid", type: "toggle", data: {"bind": "etc.fn.grid.toggle"}},
						{"name": "save", data: {}},
						{"name": "cancel", data: {"bind": "cancelEditing"}}
					],
					callback: function (elem) {
						$(elem).hide();
					},
					cssClass: "global-control",
					direction: "h"
				})
			],
			direction: "h",
			cssClass: "switch"
		});
		_layout.append(etcControl);

		// TODO: add status loading control condition
		ready = true;
		_layout.addClass(_prefix + "-" + ((ready) ? "ready" : "err"));

		_layout.on("click", "[data-etc=button],[data-etc=toggle],[data-etc=block],[data-etc=dropdown]", function () {
			var self = $(this);
			var type = self.data(_prefix);
			var bind = (self.data("bind") != undefined) ? self.data("bind") : null;
			etc.fn.button[type](self, bind);
			return false;
		});

		_layout.on("click mousemove mouseenter mouseleave ","."+_prefix+"-col,."+_prefix+"-row",function(e){
			var self = $(this);
			var cssRemove = "s-toremove";
			if(e.ctrlKey){
				if(e.type == "mouseenter"){
					self.addClass(cssRemove);
				}else if(e.type == "mousemove" && !self.hasClass(cssRemove)){
					self.addClass(cssRemove);
				}
				else if(e.type == "mouseleave") self.removeClass(cssRemove);
				if(e.type == "click"){
					etc.fn.grid.modify.remove(self);

				}
				return false;
			}
			self.removeClass(cssRemove);
		});

		_layout.on("mouseenter mouseleave","."+_prefix+"-col",function(e){
			var self = $(this);

			if(e.type == "mouseleave"){
				self.find(".etc-action-resize").remove();
				return false;
			}

			var resize = etc.fn.grid.modify.testRowSize(self);

			if(!resize){
				console.info("row is full length");
				return false;
			}

			self.append(etc.fn.addButton({
				"name":"resize",
				"type":"resize",
				"data":{
					"direction":"right",
					"bind":"etc.fn.grid.modify.columnResize"
					}
				}));
			return false;
		});



		// TODO: dummy for confirm close window if editing active
		/*
		 $(window).bind("beforeunload", function() {
		 var message = "";
		 return message;
		 });*/

		// TODO: add error message processor
		var message = "fatal error";
		if (!ready) console.error("err:" + message);
		else console.info(_prefix + " success loaded");

		etc.fn.grid.get({
			elem: $("#page"),
			name: "base"
		});
		//$(".etc-action-switch,.etc-action-grid").trigger("click");
	}

	init();
})(window);