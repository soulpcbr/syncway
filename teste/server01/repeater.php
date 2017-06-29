<?php

//check folder
$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

$data = array();
//if (isset($_POST['newfilename']) && !empty($_POST['newfilename'])) {
//    $target_file = $target_dir . basename($_POST['newfilename']);
//} else {
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
//}
$imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);

//Check auth
if (isset($_POST['auth']) && !empty($_POST['auth']) && $_POST['auth'] != "testando") {
    $data['msg'][] = "Sorry, you dont have permission for upload.";
    $data['status'] = 0;
} else {
    $data['status'] = 1;

    // Check if file already exists
    if (file_exists($target_file)) {
        unlink($target_file);
    }
    $data['status'] = 1;

    // Check file size
    if ($_FILES["fileToUpload"]["size"] > 50000000) {
        $data['msg'][] = "Sorry, your file is too large.";
        $data['status'] = 0;
    } else {
        $data['status'] = 1;

        // Allow certain file formats
        if ($imageFileType != "txt" && $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
            $data['msg'][] = "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
            $data['status'] = 0;
        } else {
            $data['status'] = 1;
        }
    }
}

// Check if $uploadOk is set to 0 by an error
if ($data['status'] == 0) {
    $data['msg'][] = "Sorry, your file was not uploaded.";

    //Something to write to txt log
    $log = "[START] ------------------------- [START]" . PHP_EOL;
    $log .= "User: " . $_SERVER['REMOTE_ADDR'] . ' - ' . date("F j, Y, g:i a") . PHP_EOL;
    if (isset($data["msg"]) && !empty($_FILES["msg"])) {
        $log .= "Erros: " . PHP_EOL;
        foreach ($_FILES["msg"] as $key => $value) {
            $log .= '   [' . $key . ']: ' . $value . PHP_EOL;
        }
    }
    if (isset($_POST) && !empty($_POST)) {
        $log .= "Parâmetros post: " . PHP_EOL;
        foreach ($_POST as $key => $value) {
            $log .= '   [' . $key . ']: ' . $value . PHP_EOL;
        }
    }
    if (isset($_GET) && !empty($_GET)) {
        $log .= "Parâmetros get: " . PHP_EOL;
        foreach ($_GET as $key => $value) {
            $log .= '   [' . $key . ']: ' . $value . PHP_EOL;
        }
    }
    if (isset($_FILES["fileToUpload"]) && !empty($_FILES["fileToUpload"])) {
        $log .= "Arquivo: " . PHP_EOL;
        foreach ($_FILES["fileToUpload"] as $key => $value) {
            $log .= '   [' . $key . ']: ' . $value . PHP_EOL;
        }
    }
    $log .= "[END]  ------------------------- [END]" . PHP_EOL;

    //Save string to log, use FILE_APPEND to append.
    file_put_contents('./logs/' . date("Y.m.d") . '-log.txt', $log, FILE_APPEND);
} else {
    $tipos_de_delay = array('main', 'extra');
    $delay = array_rand($tipos_de_delay);
    $data['delay'] = $tipos_de_delay[$delay];

    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        $data['msg'][] = "The file " . basename($_FILES["fileToUpload"]["name"]) . " has been uploaded.";
    } else {
        $data['msg'][] = "Sorry, there was an error uploading your file.";
    }
}

header('Content-Type: application/json');
echo json_encode($data);


//file_put_contents("s.jpg", fopen("http://192.168.1.102:8080/432VKdE1h0IaTJbODhYIDrCyF4q15f/jpeg/2Df5hBE/t8eEznKWMS/s.jpg", 'r'));

