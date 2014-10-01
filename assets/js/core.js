/**
 * Created by kaaboeld on 18.09.14.
 */

(function(window) {
	function init(){
		var ready;

		var _layout = $("body").attr("data-etc","layout");
		_layout.append($("<div/>").attr("id","page"))

		if(window.etc == undefined){
			console.error("god object not exist");
		}
		var etcControl = etc.fn.addToolbar({
			buttons : [
				/*{
					"name":"status"
				},*/
				{
					"name":"switch",
					"click":function(){
						etc.fn.toggleEditable();
						return false;
					},
					data:{}
				},
				etc.fn.addToolbar({
					buttons : [
						//{"name":"store",type:"dropdown",data:{"bind":"toggleDropdown","direction":"up","menuheight":100,"content":"getPageMenu"}},
						{"name":"template",data:{}},
						{"name":"grid",data:{}},
						{"name":"save",data:{}},
						{"name":"cancel",data:{"bind":"cancelEditing"}}
					],
					callback : function(elem){
						$(elem).hide();
					},
					cssClass : "global-control",
					direction : "h"
				})
			],
			direction : "h",
			cssClass : "switch"
		});
		_layout.append(etcControl);

		// TODO: add status loading control condition
		ready = true;
		_layout.addClass(_prefix+"-"+((ready)? "ready" : "err"));


		_layout.on("click","[data-etc=button]",function(){
			var self = $(this);
			var bind = self.data("bind");
			if(etc.fn[bind] != undefined) etc.fn[bind](self);
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
		if(!ready) console.error("err:"+message);
		else console.info(_prefix+" success loaded");

		etc.fn.grid.get({
			elem : $("#page"),
			name : "base"
		});
	}
	init();
})(window);