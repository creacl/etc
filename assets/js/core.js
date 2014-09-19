/**
 * Created by kaaboeld on 18.09.14.
 */

var _prefix = "etc";
var etc = {};
etc = {
	dropZone : {
		selector : "."+_prefix+"-dropzone",
		counter : 0
	},
	config : {
		uploadUrl : ""
	},
	entities : {
		block : $("<div/>").addClass(_prefix+"-block")
	},
	utils : {},
	bar : {}
}
etc.config.uploadUrl = "/connector/php/upload.php";

etc.utils.resizeBlock = function(elem,params){
	if(typeof params == 'string'){
		switch (params){
			case "fill":
				elem.css({
					height:$(document).height(),
					width:$(document).width()
				})
			break;
		}
	}
	return elem;
}
etc.utils.positionBlock = function(elem,params){
}


