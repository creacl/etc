<?php
error_reporting(E_ALL);



$res = new stdClass();
$res->result = null;
$res->err = true;

if (!empty($_FILES)) {
	$storagePath = '/var/www/filestmp/';
	$isImage = false;
	$file = $_FILES['file'];
	$tmp = $file['tmp_name'];
	$origName = $file['name'];

	$mime = $file['type'];
	$ext = strtolower(end(explode('.', $origName)));

	$name = md5($origName);
	$fn = $name.".".$ext;

	if(file_exists($storagePath.$fn)){
		$i = 1;
		while(file_exists($storagePath.$fn."_".$i.".".$ext)){
			$i++;
		}
		$fn=$name."_".$i.".".$ext;
	}
	$dest = $storagePath.$fn;
	$isImage = (strpos($mime,"image") === false) ? false : true;

	if(move_uploaded_file($tmp,$dest)){
		chmod($dest, 0664);

		$fileData = new stdClass();
		$fileData->name = $fn;
		$fileData->image = $isImage;
		$fileData->originalName = $origName;
		$fileData->ext = $ext;

		$res->result = $fileData;
		$res->err = false;
	}else{
		$res->err = true;
	}
	if($is_img){
		// TODO: add function prepare image
	}

}
echo json_encode($res);
?>