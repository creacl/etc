/**
 * Created by kaaboeld on 19.09.14.
 */

(function (window) {
	var _prefix = "etc";
	var _prefixIcon = "fa fa-";
	/**
	 *
	 * @type {{buttons: {base: (*|jQuery)}, blocks: {base: (*|jQuery)}, toolbar: {base: (*|jQuery)}}}
	 * @private
	 */
	var _dummy = {
		buttons: {
			base: $("<button/>").addClass(_prefix + "-button")
		},
		blocks: {
			base: $("<div/>").addClass(_prefix + "-block")
		},
		toolbar: {
			base: $("<div/>").addClass(_prefix + "-toolbar")
		}
	};
	_dummy.buttons.icon = _dummy.buttons.base.clone().addClass(_prefix + "-button-icon");
	_dummy.buttons.dropdown = _dummy.buttons.base.clone().addClass(_prefix + "-button-dropdown").append(
		$("<i/>").addClass(_prefix+"-button-dropdown-toggle")
	);
	_dummy.blocks.text = _dummy.blocks.base.clone().data({"editor": "text"});

	/*var _buttons = {
		"save" : _dummy.buttons.base.clone(),
		"cancel" : _dummy.buttons.base.clone(),
		"help" : _dummy.buttons.base.clone()
	};*/

	/**
	 *
	 * @type {{icons: {switch: String("fa fa-pencil")}, button: *, dropZone: {selector: string, counter: number}, config: {connector: String("php"), connectorUrl: String(""), uploadUrl: String("")}, entities: {block: *, toolbar: *}, utils: {}, fn: {req: req, callback: callback, toggleEditable: toggleEditable, setTextRange: setTextRange}}}
	 */
	var etc = {
		icons: {
			"switch": "pencil",
			"save" : "check",
			"cancel" : "times",
			"status":"circle-o"
		},
		dropZone: {
			selector: "." + _prefix + "-dropzone",
			counter: 0
		},
		config: {
			connector: "php",
			connectorUrl: "",
			uploadUrl: ""
		},
		entities: {
			block: _dummy.blocks.base.clone(),
			toolbar: _dummy.toolbar.base.clone()
		},
		utils: {},
		fn: {
			// Ajax request to connector
			req: function (params) {
			},
			// Processing server response from connector
			callback: function (params) {
			},
			// Toggle editable mode for content blocks
			toggleEditable: function (elem) {
				var container = $("[data-etc=layout]");
				container.toggleClass(_prefix+"-ready "+_prefix+"-active");
				$("."+_prefix+"-toolbar-global-control, ."+_prefix+"-action-switch").toggle();

				elem = elem || $("." + _prefix + "-block");
				elem.prop("contenteditable", (container.hasClass(_prefix + "-active")));

			},
			cancelEditing: function() {
				// TODO: add function undo changes
				//$("body").toggleClass(_prefix+"-ready "+_prefix+"-active");
				//$("."+_prefix+"-toolbar-global-control, ."+_prefix+"-action-switch").toggle();
				etc.fn.toggleEditable();
			},
			// Add button from template and parameters
			addButton: function(params){
				var opt = {
					selector : "",
					name : "",
					cssClass: "",
					type : "icon",
					data : null,
					click : function(){}
				};

				$.extend(true, opt, params);

				var button = (opt.type == "icon") ?
					_dummy.buttons.icon.clone() :
					_dummy.buttons.base.clone();

				var button;
				switch(opt.type){
					case "text":
						button = _dummy.buttons.base.clone();
					break;
					case "dropdown":
						button = _dummy.buttons.dropdown;
						button.addClass(_prefixIcon+"bars");
						var direction = (opt.data.direction != undefined) ? opt.data.direction : "down";
						var reDirection = "";
						switch (direction) {
							case "down":
								reDirection = "up";
								break;
							case "up":
								reDirection = "down";
								break;
							case "left":
								reDirection = "right";
								break;
							case "right":
								reDirection = "left";
								break;
						}

						button.find("."+_prefix+"-button-dropdown-toggle").addClass(_prefixIcon+"angle-"+direction).data("redirection",reDirection);



						//if(opt.data.direction != undefined) delete opt.data.direction;

					break;
					default:
						//opt.type = icon
						button = _dummy.buttons.icon.clone();
					break;
				}

				button.on("click",opt.click);

				if(opt.cssClass != "") button.addClass(_prefix+"-button-"+opt.cssClass);

				if(opt.name != "" && etc.icons[opt.name] != undefined){
					button.addClass(_prefixIcon+etc.icons[opt.name]+" "+_prefix+"-action-"+opt.name);

				}
				if(opt.data != null && typeof opt.data == "object")
					button.data(opt.data).attr("data-etc","button");


				if(opt.selector == "") return button;
			},
			// Add toolbar to block or other element
			addToolbar: function (params) {
				var opt = {
					selector: "",
					cssClass: "",
					direction:"v",
					buttons: [],
					callback: null
				}
				$.extend(true, opt, params);

				var toolbar = etc.entities.toolbar.clone();

				if(opt.cssClass != "") toolbar.addClass(_prefix+"-toolbar-"+opt.cssClass);
				toolbar.addClass("nav-"+opt.direction);

				if (opt.buttons.length == 0) {
					// TODO: add error message
					var message = "";
					if (opt.buttons.length == 0) message += " " + "button count <= 0";
					console.error(message);
					return false;
				}

				toolbar.append($("<ul/>").addClass(_prefix+"-toolbar-inner"));
				$.each(opt.buttons,function(k,v){
					var button;
					if(v instanceof jQuery) button = v;
					else if(typeof v == "string") button = etc.fn.addButton({"name":v,type:"icon"});
					else if(typeof v == "object") button = etc.fn.addButton(v);
					else button = v;

					var item = $("<li/>").append(button);
					toolbar.find(" > ."+_prefix+"-toolbar-inner").append(item);
				});

				if(opt.callback != null){
					opt.callback(toolbar);
				}
				if(opt.selector == "") return toolbar;
			},
			// Add tag wrapper for selected range text and/or return current selected text
			setTextRange: function (wrap) {
				var range;
				var fragment = "";
				var selection;
				if (window.getSelection) {
					selection = window.getSelection();
					range = selection.getRangeAt(0);
					if (wrap != undefined && wrap != "") {
						fragment = range.extractContents();
						wrap = $(wrap).get(0);
						wrap.appendChild(fragment);
						range.insertNode(wrap);
					} else fragment = selection.toString();
					selection.removeAllRanges();
				} else if (document.selection && document.selection.type != "Control") {
					selection = document.selection;
					range = selection.createRange();
					fragment = range.htmlText;
					if (wrap != undefined && wrap != "") {
						wrap.append(fragment);
						range.pasteHTML(wrap.get(0));
					}
				}
				return fragment;
			},
			getPageMenu : function(params){
				// TODO: replace this dummy function to procuction
				var opt = {};
				$.extend(true,opt,params);
				var content = "";
				// dummy <title> edit
				/*$("body").on("keyup keydown","."+_prefix+"-input-page-title",function(){
					var self = $(this);
					var val = self.val();
					if($.trim(val) != "") $("title").text(val);
				});*/
				return content;
			},
			toggleDropdown : function(elem){

				var sel = _prefix+"-button-dropdown-menu";
				var dropdownMenu = $("<div/>").addClass(sel);

				var reDirection = elem.find("."+_prefix+"-button-dropdown-toggle").data("redirection");
				var direction = elem.data("direction");
				if(!elem.hasClass("s-open")) {
					var menuHeight = (elem.data("menuheight")) ? elem.data("menuheight") : 40;
					var elemHeight = elem.outerHeight(true);
					if (direction == "up") dropdownMenu.css({
						"margin-top": -(menuHeight + elemHeight) + "px",
						height: menuHeight
					});
					if (elem.next("." + sel).length > 0) elem.next("." + sel).remove();

					var content = (elem.data("content") != undefined && etc.fn[elem.data("content")]) ? etc.fn[elem.data("content")] : "";
					dropdownMenu.append(content);
					dropdownMenu.insertAfter(elem).show();
				}else{
					elem.next("." + sel).remove();
				}
				elem.toggleClass("s-open")
					.find("."+_prefix+"-button-dropdown-toggle")
						.toggleClass(_prefixIcon+"angle-"+direction+" "+_prefixIcon+"angle-"+reDirection);

				return true;
			}
		}
	}
	//etc.button.addClass(_prefixIcon+etc.icons.switch);
	etc.config.uploadUrl = "/connector/php/upload.php";

	/**
	 *
	 * @param elem
	 * @param params
	 * @returns {*}
	 */
	etc.utils.resizeBlock = function (elem, params) {
		if (typeof params == 'string') {
			switch (params) {
				case "fill":
					elem.css({
						height: $(document).height(),
						width: $(document).width()
					})
					break;
			}
		}
		return elem;
	}
	etc.utils.positionBlock = function (elem, params) {
	}
	/**
	 *
	 * @type {string}
	 * @private
	 */
	window._prefix = _prefix;
	window.etc = etc;
})(window);