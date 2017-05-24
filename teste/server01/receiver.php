<?php
//check folder
$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}
// Check if image file is a actual image or fake image
if (isset($_POST["submit"])) {
    $data = array();
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);

    // Check if file already exists
    if (file_exists($target_file)) {
        $data['msg'][] = "Sorry, file already exists.";
        $data['status'] = 0;
    } else {
        $data['status'] = 1;
    }
    // Check file size
    if ($_FILES["fileToUpload"]["size"] > 50000000) {
        $data['msg'][] =  "Sorry, your file is too large.";
        $data['status'] = 0;
    } else {
        $data['status'] = 1;
    }
    // Allow certain file formats
    if ($imageFileType != "txt" && $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        $data['msg'][] =  "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
        $data['status'] = 0;
    } else {
        $data['status'] = 1;
    }
    // Check if $uploadOk is set to 0 by an error
    if ($data['status'] == 0) {
        $data['msg'][] = "Sorry, your file was not uploaded.";
        // if everything is ok, try to upload file
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
    echo json_encode($data);
    exit();
} else {
    ?>
    <!DOCTYPE html>
    <html>
        <body>
            <form action="./receiver.php" method="post" enctype="multipart/form-data">
                Select image to upload:
                <input type="file" name="fileToUpload" id="fileToUpload">
                <input type="text" name="param" id="param" value="" />
                <input type="submit" value="Upload Image" name="submit">
            </form>
        </body>
    </html>
<?php } ?>
