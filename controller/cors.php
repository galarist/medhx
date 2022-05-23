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
    header('Access-Control-Allow-Origin: https://medhx.netlify.app/');
} else {
    header('Access-Control-Allow-Origin: http://localhost:1234');
}
