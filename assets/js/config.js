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
			"cancel" : "times"
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
					type : "icon",
					data : null,
					click : function(){}
				};

				$.extend(true, opt, params);

				var button = (opt.type == "icon") ?
					_dummy.buttons.icon.clone() :
					_dummy.buttons.base.clone();

				button.on("click",opt.click);

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
					console.log("typeof",typeof v,v instanceof jQuery)
					var button; //= (typeof v == "string") ? etc.fn.addButton({"name":v,type:"icon"}) : v;
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