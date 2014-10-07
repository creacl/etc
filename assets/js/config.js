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
			base: $("<button/>").addClass(_prefix + "-button"),
			block: $("<div/>").addClass(_prefix + "-button-block")
		},
		blocks: {
			base: $("<div/>").addClass(_prefix + "-block")
		},
		grid: {
			row: $("<div/>").addClass(_prefix + "-row row"),
			col: $("<div/>").addClass(_prefix + "-col col").attr("data-cid",""),
			container: $("<div/>").addClass(_prefix + "-container container")
		},
		toolbar: {
			base: $("<div/>").addClass(_prefix + "-toolbar")
		}

	};
	_dummy.buttons.icon = _dummy.buttons.base.clone().addClass(_prefix + "-button-icon");

	_dummy.buttons.toggle = _dummy.buttons.base.clone().addClass(_prefix + "-button-toggle");
	_dummy.buttons.dropdown = _dummy.buttons.base.clone().addClass(_prefix + "-button-dropdown").append(
		$("<i/>").addClass(_prefix + "-button-dropdown-toggle")
	);
	_dummy.blocks.text = _dummy.blocks.base.clone().data({"editor": "text"});

	_dummy.buttons.resize = _dummy.buttons.icon.clone();

	/**
	 *
	 * @type {{icons: {switch: String("pencil"), save: String("check"), cancel: String("times"), status: String("circle-o"), grid: String("th-large"), direction: String("angle"), template: String("newspaper-o"), editor: {bold: String("bold"), italic: String("italic"), header: String("header"), link: String("link")}}, dropZone: {selector: string, counter: number}, config: {connector: String("php"), connectorUrl: String(""), uploadUrl: String(""), grid: {columnCount: number}, template: {path: String("/views/"), engine: String("handlebars")}}, entities: {block: *, toolbar: *}, utils: {}, fn: {req: req, callback: callback, grid: {set: set, get: get}, toggleEditable: toggleEditable, cancelEditing: cancelEditing, addButton: addButton, addToolbar: addToolbar, setTextRange: setTextRange, getPageMenu: getPageMenu, toggleDropdown: toggleDropdown}}}
	 */
	var etc = {
		layout: $("body"),
		icons: {
			"switch": "pencil",
			"save": "check",
			"cancel": "times",
			"status": "circle-o",
			"grid": "th-large",
			"direction": "angle",
			"resize": "caret",
			"template": "newspaper-o",
			"plus": "plus",
			"lorem": "align-left",
			"editor": {
				"bold": "bold",
				"italic": "italic",
				"header": "header",
				"link": "link"
			}
		},
		dropZone: {
			selector: "." + _prefix + "-dropzone",
			counter: 0
		},
		config: {
			connector: "php",
			connectorUrl: "",
			uploadUrl: "",
			grid: {
				columnCount: 12
			},
			template: {
				path: "./views/",
				engine: "handlebars"
			}
		},
		entities: {
			block: _dummy.blocks.base.clone(),
			toolbar: _dummy.toolbar.base.clone()
		},
		utils: {},
		fn: {
			/**
			 * Ajax request to connector
			 * @param params
			 */
			req: function (params) {

				var callback = (params.callback != undefined) ? params.callback : null;
				delete params.callback;

				var elem = (params.elem != undefined) ? params.elem : null;
				delete params.elem;

				var opt = {
					url: etc.config.connectorUrl,
					type: "post",
					data: {},
					dataType: "json",
					beforeSend: function () {
						// TODO: add preloader
					},
					error: function (xhr, status, err) {
						// TODO: add error processing
						console.error("ajax request error:", status, err);
					},
					success: function (data, status, xhr) {
						console.info("ajax request success:", status);
						var params = {
							"data": data,
							"elem": elem,
							"callback": callback
						}
						etc.fn.callback(params);
					},
					complete: function (xhr, status) {
						// TODO: add complete processing
						// TODO: add finishing preloader
						console.log("ajax request complete:", status);
					}
				};

				$.extend(true, opt, params);
				$.ajax(opt);
			},
			/**
			 * Processing server response from connector
			 * @param params
			 */
			callback: function (params) {
				var opt = {
					"callback" : null
				};
				$.extend(true,opt,params);

				var fn;
				if (opt.callback != null) {
					fn = ($.inArray(".", opt.callback) >= 0) ? eval(opt.callback) :
						(etc.fn[opt.callback] != undefined) ? etc.fn[opt.callback] :
							(window[opt.callback] != undefined) ? window[opt.callback] : null;
				}
				delete opt.callback;
				fn(opt);
			},
			/**
			 * Grid processing
			 */
			grid: {
				/**
				 * Grid set
				 * @param params
				 */
				set: function (params) {

					/**
					 * Example data response:
					 * {
					 *  "err" : null || {
					 *      "code"     : (int), <- error code
					 *      "text"     : ""     <- status textual description
					 *  },
					 *  "result" : [
					 *      {
					 *          "id"       : "",  <- id from db to be set on html attribute id
					 *          "type"     : "",  <- type of content: text, media, header & etc.
					 *          "container : "",  <- grid-id for placement this block
					 *          "attr"     : {},  <- html attributes
					 *          "data"     : {},  <- html data-* attributes
					 *          "content   : null <- content by type of block
					 *      },
					 *      ...
					 *  ]
					 * }
					 */

					/*function for remove col-* from element attribute class
					 elem.removeClass (function (index, css) {
					 return (css.match (/(^|\s)col-\d+/g) || []).join(' ');
					 });*/
					var opt = {
						"data": {},
						"elem": null
					};

					$.extend(true, opt, params);
					// TODO: add change compliation processing by template engine
					var template = (etc.config.template.engine == "handlebars") ?
						Handlebars.compile($(opt.elem).html()) : opt.elem;

					var data = opt.data;
					var grid = $("<i>").append($(template(data)));


					// TODO: move to single function
					$.each($(grid).find(".container,.row,.col"), function () {
						var self = $(this);
						if (self.hasClass("container")) self.addClass(_prefix + "-container");
						if (self.hasClass("row")) self.addClass(_prefix + "-row");
						if (self.hasClass("col")) self.addClass(_prefix + "-col");
						if (!self.hasClass("col")) self.append(etc.fn.grid.control.add());
					});


					$(opt.elem).empty().append(grid.children());


				},
				/**
				 * Grid get
				 * @param params
				 */
				get: function (params) {
					var opt = {
						"name": "",
						"dataUrl": "./testData.json",
						"elem": null
					};
					$.extend(true, opt, params);
					// TODO: add change extension by template engine
					var ext = ".hbs";
					$(opt.elem).load(etc.config.template.path + opt.name + ext, function () {
						var self = this;
						var reqParams = {
							url: opt.dataUrl,
							elem: $(opt.elem),
							dataType: "json",
							callback: "etc.fn.grid.set"
						}
						etc.fn.req(reqParams);
					});
				},
				toggle: function () {
					etc.layout.toggleClass("s-show-grid");

				},
				/**
				 * modifiy grid structure
				 */
				modify: {
					/**
					 * add element to grid structure
					 * @param elem
					 */
					add: function (elem) {

						var container = $(elem).closest(".container,.row,.col").eq(0);

						var buttonBlock = $(elem).closest("." + _prefix + "-button-block");

						var block;
						var act = "";
						if (container.hasClass("container")) {
							block = _dummy.grid.row.clone();
							act = "append";
						}
						var num = 1;
						if (container.hasClass("row")) {
							block = _dummy.grid.col.clone();
							block.addClass("col-" + num).attr({"data-size": num});
							act = "append";

						}
						if (!block.hasClass("col")) etc.fn.grid.control.add(block);
						container[act](block.fadeIn(300));
						buttonBlock.removeClass("s-active").empty();

						var resize = etc.fn.grid.modify.testRowSize(container);
						if (!resize) {
							container.find(" > ." + _prefix + "-button-block").hide();
						}
					},
					/**
					 * remove element from grid structure
					 * @param elem
					 */
					remove: function (elem) {
						var container = null;

						if (elem.parent().hasClass("row")) {
							container = elem.parent();
						}
						elem.remove();

						if (container == null) return false;

						var resize = etc.fn.grid.modify.testRowSize(container);
						if (resize) {
							container.find(" > ." + _prefix + "-button-block").removeAttr("style");
						}
					},
					columnResize: function (elem) {
						console.log("columnresize")
						var container = elem.closest(".col");
						var size = container.data("size");
						container.removeClass(function (index, css) {
							return (css.match(/(^|\s)col-\d+/g) || []).join(' ');
						});
						size += 1;
						container.data("size", size).addClass("col-" + size);

						var resize = etc.fn.grid.modify.testRowSize(container);

						if (!resize) {
							elem.remove();
							container.closest(".row").find(" > ." + _prefix + "-button-block").hide();
						}
					},
					testRowSize: function (elem) {
						var container = (elem.hasClass("row")) ? elem : elem.closest(".row");
						var columnCount = etc.config.grid.columnCount;
						var columnRow = container.find("> .col");
						var count = columnRow.length;
						var resize = false;

						var sizeRow = 0;
						if (columnCount > count) {
							$.each(columnRow, function () {
								var item = $(this);
								sizeRow += item.data("size");
							});
							if (columnCount > sizeRow) resize = true;
						}
						return resize;
					}
				},
				/**
				 * for grid controls
				 */
				control: {
					/**
					 * add grid control to grid element
					 * @param elem
					 */
					add: function (elem) {
						console.log("add control")
						var control = etc.fn.addButton({"name": "block",
							"type": "block"
						});
						if (elem == undefined) {
							return control;
						} else elem.append(control)

					},
					/**
					 * remove grid control from grid elemnt
					 * @param elem
					 */
					remove: function (elem) {

					}
				},
				lorem: function (elem) {
					etc.layout.toggleClass("s-lorem")
				}
			},
			/**
			 * Toggle editable mode for content blocks
			 * @param elem
			 */
			toggleEditable: function (elem) {
				var container = etc.layout;
				container.toggleClass(_prefix + "-ready " + _prefix + "-active");
				$("." + _prefix + "-toolbar-global-control, ." + _prefix + "-action-switch").toggle();

				elem = elem || $("." + _prefix + "-block");
				elem.prop("contenteditable", (container.hasClass(_prefix + "-active")));

			},
			/**
			 * Cancel the current changes
			 */
			cancelEditing: function () {
				// TODO: add function undo changes
				//$("body").toggleClass(_prefix+"-ready "+_prefix+"-active");
				//$("."+_prefix+"-toolbar-global-control, ."+_prefix+"-action-switch").toggle();
				etc.fn.toggleEditable();
			},
			/**
			 * Function wrappers for interface elements
			 */
			"interface": {
				"button": function (params) {
					return etc.fn.addButton(params);
				},
				"toolbar": function (params) {
					return etc.fn.addToolbar(params)
				}
			},
			/**
			 * Function wrapper for events button by type
			 */
			"button": {
				"_fn": function (bind) {
					var fn;
					fn = ($.inArray(".", bind) >= 0) ? eval(bind) :
						(etc.fn[bind] != undefined) ? etc.fn[bind] :
							(window[bind] != undefined) ? window[bind] : null;

					return fn;
				},
				"button": function (elem, bind) {
					console.info("button-button")
					var fn = this._fn(bind);
					if (fn != null) fn(elem);
				},
				"dropdown": function (elem, bind) {
					console.info("button-dropdown")
					var sel = _prefix + "-button-dropdown-menu";
					var dropdownMenu = $("<div/>").addClass(sel);

					var reDirection = elem.find("." + _prefix + "-button-dropdown-toggle").data("redirection");
					var direction = elem.data("direction");
					if (!elem.hasClass("s-open")) {
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
					} else {
						elem.next("." + sel).remove();
					}
					elem.toggleClass("s-open")
						.find("." + _prefix + "-button-dropdown-toggle")
						.toggleClass(_prefixIcon + etc.icons.direction + "-" + direction + " " + _prefixIcon + etc.icons.direction + "-" + reDirection);
				},
				"toggle": function (elem, bind) {
					console.info("button-toggle")
					elem.toggleClass("s-active");
					var fn = this._fn(bind);
					if (fn != null) fn(elem);

				},
				"block": function (elem, bind) {
					console.info("button-block")
					elem.toggleClass("s-active");
					var fn = this._fn(bind);
					if (fn != null) fn(elem);
					var controls = {
						direction: "h",
						buttons: [
							{"name": "plus", data: {
								"bind": "etc.fn.grid.modify.add"
							}}
						]
					};
					$(elem).append(etc.fn.addToolbar(controls));
				}
			},
			/**
			 * Add button from template and parameters
			 * @param params
			 * @returns {*}
			 */
			addButton: function (params) {
				var opt = {
					selector: "",
					name: "",
					cssClass: "",
					type: "icon",
					title: "",
					data: null,
					click: function () {
					}
				};

				$.extend(true, opt, params);

				var button = (opt.type == "icon") ?
					_dummy.buttons.icon.clone() :
					_dummy.buttons.base.clone();

				//var button;

				var direction;
				switch (opt.type) {
					case "text":
						button = _dummy.buttons.base.clone();
						break;
					case "dropdown":
						button = _dummy.buttons.dropdown;
						button.addClass(_prefixIcon + "bars");
						direction = (opt.data.direction != undefined) ? opt.data.direction : "down";
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

						button.find("." + _prefix + "-button-dropdown-toggle").addClass(_prefixIcon + etc.icons.direction + "-" + direction).data("redirection", reDirection);

						button.attr("data-" + _prefix, opt.type);
						break;
					case "toggle":
						button = _dummy.buttons.toggle.clone();
						button.attr("data-" + _prefix, opt.type);
						break;
					case "block":

						button = _dummy.buttons.block.clone();
						button.attr("data-" + _prefix, opt.type);
						break;
					case "resize":
						direction = (opt.data.direction != undefined) ? opt.data.direction : "right";
						button = _dummy.buttons.resize.clone();
						button.addClass(_prefixIcon + etc.icons.resize + "-" + direction);
						break;
					default:
						//opt.type = icon
						button = _dummy.buttons.icon.clone();
						break;
				}
				if (button.attr("data-" + _prefix) == undefined) button.attr("data-" + _prefix, "button");

				button.attr("title", ((opt.title != "") ? opt.title : opt.name));

				button.on("click", opt.click);

				if (opt.cssClass != "") button.addClass(_prefix + "-button-" + opt.cssClass);

				if (opt.name != "" && etc.icons[opt.name] != undefined) {
					button.addClass(_prefixIcon + etc.icons[opt.name] + " " + _prefix + "-action-" + opt.name);

				}

				if (opt.data != null && typeof opt.data == "object")
					button.data(opt.data);

				if (opt.selector == "") return button;
			},
			/**
			 * Add toolbar to block or other element
			 * @param params
			 * @returns {*}
			 */
			addToolbar: function (params) {
				var opt = {
					selector: "",
					cssClass: "",
					direction: "v",
					buttons: [],
					callback: null
				}
				$.extend(true, opt, params);

				var toolbar = etc.entities.toolbar.clone();

				if (opt.cssClass != "") toolbar.addClass(_prefix + "-toolbar-" + opt.cssClass);
				toolbar.addClass("nav-" + opt.direction);

				if (opt.buttons.length == 0) {
					// TODO: add error message
					var message = "";
					if (opt.buttons.length == 0) message += " " + "button count <= 0";
					console.error(message);
					return false;
				}

				toolbar.empty().append($("<ul/>").addClass(_prefix + "-toolbar-inner"));
				$.each(opt.buttons, function (k, v) {
					var button;
					if (v instanceof jQuery) button = v;
					else if (typeof v == "string") button = etc.fn.addButton({"name": v, type: "icon"});
					else if (typeof v == "object") button = etc.fn.addButton(v);
					else button = v;

					var item = $("<li/>").append(button);
					toolbar.find(" > ." + _prefix + "-toolbar-inner").append(item);
				});

				if (opt.callback != null) {
					opt.callback(toolbar);
				}
				if (opt.selector == "") return toolbar;
			},
			/**
			 * Add tag wrapper for selected range text and/or return current selected text
			 * @param wrap
			 * @returns {string}
			 */
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
			/**
			 * Add tag wrapper for selected range text and/or return current selected text
			 * @param params
			 * @returns {string}
			 */
			getPageMenu: function (params) {
				// TODO: replace this dummy function to procuction
				var opt = {};
				$.extend(true, opt, params);
				var content = "";
				// dummy <title> edit
				/*$("body").on("keyup keydown","."+_prefix+"-input-page-title",function(){
				 var self = $(this);
				 var val = self.val();
				 if($.trim(val) != "") $("title").text(val);
				 });*/
				return content;
			}
		}
	}

	etc.config.uploadUrl = "/connector/php/upload.php";

	/**
	 * Blocks resizing
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
	/**
	 * Blocks positioning
	 * @param elem
	 * @param params
	 */
	etc.utils.positionBlock = function (elem, params) {
	}

	window._prefix = _prefix;

	/**
	 * Add god object to global object window
	 */
	window.etc = etc;
})(window);