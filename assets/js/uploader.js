/**
 * Created by kaaboeld on 19.09.14.
 */

(function (window) {

	$(document).on('dragenter dragover drop dragleave', function (e) {
		var selector = etc.dropZone.selector;
		if (e.type == 'dragenter') {
			var dropZone = $("<div/>").addClass(_prefix + "-dropzone" + " s-ready").append(
				$("<div/>").addClass(_prefix + "-dropzone-body")
			);
			if ($(selector).length == 0) $("body").append(dropZone);
			etc.utils.resizeBlock($(selector), 'fill').show();


		} else if (e.type == 'dragleave') {

		}
		return false;
	});

	function createStatusbar(obj) {
		var dropZone = $(etc.dropZone.selector);

		var block = etc.entities.block.clone().append(
			$("<div/>").addClass(_prefix + "-progress").append(
				$("<div/>").addClass(_prefix + "-progress-bar")
			),
			$("<div/>").addClass(_prefix + "-block-title")
		);

		this.block = block;

		this.progressBar = this.block.find("." + _prefix + "-progress-bar");
		this.title = this.block.find("." + _prefix + "-block-title");

		var container = dropZone.find("." + _prefix + "-dropzone-body");
		container.append(this.block);
		this.setContainerPosition = function (container) {
			var block = container.find("." + _prefix + "-block");
			var blockSize = block.eq(0).outerWidth(true);

			var colCount = 4;
			var conWidth = blockSize * colCount;
			container.css({
				width: blockSize * colCount
			});
			var conHeight = container.outerWidth(true);
			console.log($(window).innerHeight())
			var conTop = ($(window).innerHeight() / 2) - (conHeight / 2);
			container.css({
				"margin-top": conTop
			});
		}
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
			var ext = name.split(".").pop();
			var title = ext;
			this.title.text(title);
			this.setContainerPosition(container);
		}
		this.setProgress = function (progress) {
			var percent = progress + "%";
			this.progressBar.animate({ width: percent }, 10);

			if (parseInt(progress) >= 100) {
				//this.abort.hide();
			}
		}
		this.setAbort = function (jqxhr) {
			/*var sb = this.statusbar;
			 this.abort.click(function () {
			 jqxhr.abort();
			 sb.hide();
			 });*/
		}
	}

	function sendFileToServer(formData, status, uploadURL) {
		uploadURL = uploadURL || etc.config.uploadUrl; //Upload URL
		var extraData = {};

		etc.dropZone.counter += 1;

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
						console.log(percent)
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
			dataType: "json",
			data: formData,
			complete: function () {
				etc.dropZone.counter -= 1;
				if (etc.dropZone.counter == 0) {
					$(etc.dropZone.selector).find("." + _prefix + "-block").remove();
					$(etc.dropZone.selector).removeClass("s-drop").fadeOut(300);
					$("body").css("overflow", "");
				}
			},
			success: function (data) {
				status.setProgress(100);
				console.log("datafile", data)
			}
		});
		status.setAbort(jqXHR);
	}

	function handleFileUpload(files, obj) {
		$.each(files, function () {
			var fd = new FormData();
			var file = this;
			fd.append('file', file);
			var status = new createStatusbar(obj);
			status.setFileNameSize(file.name, file.size);
			sendFileToServer(fd, status);
		});
	}

	$("body").on("drop", etc.dropZone.selector, function (e) {
		var self = $(this);
		var files = e.originalEvent.dataTransfer.files;
		handleFileUpload(files, self);
	}).on("dragenter dragleave", etc.dropZone.selector, function (e) {
		var self = $(this);
		if (e.type == "dragleave") self.hide();

		self.toggleClass("s-ready " + (e.type == "dragenter") ? "s-dragenter" : "");

	}).on("dragover", etc.dropZone.selector, function (e) {
		var self = $(this);
		self.show();
		$("body").css("overflow", "hidden");
	}).on("drop", etc.dropZone.selector, function (e) {
		var self = $(this);
		self.show();
		self.toggleClass("s-dragenter s-drop");
	});
})(window);