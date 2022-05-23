<?php
header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTION');
header('Access-Control-Allow-Headers: Content-Type');
header("Access-Control-Allow-Credentials: true"); // add this header
header('Content-Type: application/json; charset=utf-8');
$id = '';
$content = file_get_contents('php://input');
//convert to stdclass object
$data = json_decode($content, true);
if (!empty($_SERVER['HTTPS'])) {
    $allowed_domains = [
        "https://medhx.herokuapp.com/",
        "https://medhx.netlify.app/"
    ];

    if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_domains)) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    }
} else {
    header('Access-Control-Allow-Origin: http://localhost:1234');
}
