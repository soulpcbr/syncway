<?php

set_time_limit(1);
$url = 'http://192.168.1.102:8080/bf8d2423002cf9e7f6f32b01ac9964ca/mjpeg/2Df5hBE/PcZw8tBm9p/s.jpg';
//echo '<img src="' . $url . '" />';
copy($url, 'downloads/flower.jpg');
die();
?>