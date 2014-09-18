/**
 * Created by kaaboeld on 18.09.14.
 */
var WebFontConfig;
WebFontConfig = {
	google: { families: [ 'Roboto:400,400italic,300,300italic,700,700italic:latin' ] }
};

var etc = {};

$(document).on('dragenter dragover drop', function (e) {
	return false;
});

var dropZone = $("body");
dropZone.addClass("dragzone state-ready");

/**
 *
 * @param obj
 */
function createStatusbar(obj) {
	
	this.statusbar = $("<div class='statusbar " + row + "'></div>");
	this.filename = $("<div class='filename'></div>").appendTo(this.statusbar);
	this.size = $("<div class='filesize'></div>").appendTo(this.statusbar);
	this.progressBar = $("<div class='progressBar'><div></div></div>").appendTo(this.statusbar);
	this.abort = $("<div class='abort'>Abort</div>").appendTo(this.statusbar);
	obj.after(this.statusbar);

	this.setFileNameSize = function (name, size) {
		var sizeStr = "";
		var sizeKB = size / 1024;
		if (parseInt(sizeKB) > 1024) {
			var sizeMB = sizeKB / 1024;
			sizeStr = sizeMB.toFixed(2) + " MB";
		}
		else {
			sizeStr = sizeKB.toFixed(2) + " KB";
		}

		this.filename.html(name);
		this.size.html(sizeStr);
	}
	this.setProgress = function (progress) {
		var progressBarWidth = progress * this.progressBar.width() / 100;
		this.progressBar.find('div').animate({ width: progressBarWidth }, 10).html(progress + "% ");
		if (parseInt(progress) >= 100) {
			this.abort.hide();
		}
	}
	this.setAbort = function (jqxhr) {
		var sb = this.statusbar;
		this.abort.click(function () {
			jqxhr.abort();
			sb.hide();
		});
	}
}
/**
 *
 * @param formData
 * @param status
 */
function sendFileToServer(formData, status) {
	var uploadURL = "/upload.php"; //Upload URL
	var extraData = {};
	var jqXHR = $.ajax({
		xhr: function () {
			var xhrobj = $.ajaxSettings.xhr();
			if (xhrobj.upload) {
				xhrobj.upload.addEventListener('progress', function (event) {
					var percent = 0;
					var position = event.loaded || event.position;
					var total = event.total;
					if (event.lengthComputable) {
						percent = Math.ceil(position / total * 100);
					}
					//Set progress
					status.setProgress(percent);
				}, false);
			}
			return xhrobj;
		},
		url: uploadURL,
		type: "POST",
		contentType: false,
		processData: false,
		cache: false,
		data: formData,
		success: function (data) {
			status.setProgress(100);
		}
	});
	status.setAbort(jqXHR);
}

function handleFileUpload(files, obj) {
	$.each(files,function(){
		var fd = new FormData();
		var file = this;
		fd.append('file', file);
		var status = new createStatusbar(obj);
		status.setFileNameSize(file.name, file.size);
		sendFileToServer(fd, status);
		console.log(fd)
	});
}

dropZone.on("drop", function (e) {
	var files = e.originalEvent.dataTransfer.files;
	handleFileUpload(files, dropZone);

	console.log(files);
}).on("dragenter dragleave", function (e) {
	var self = $(this);
	dropZone.toggleClass("state-ready " + (e.type == "dragenter") ? "state-dragenter" : "");

}).on("dragover", function (e) {

});

