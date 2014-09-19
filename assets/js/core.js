/**
 * Created by kaaboeld on 18.09.14.
 */

(function(window) {
	function init(){
		var ready;
		// TODO: add status loading control condition
		ready = true;
		$("body").addClass("etc-"+((ready)? "ready" : "err"));

		// TODO: add error message processor
		var message = "fatal error";
		if(!ready) console.error("err:"+message);
	}
	init();
})(window);