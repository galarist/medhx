<?php
require_once '../controller/checkinput.php';
include '../controller/cors.php';
$id = '';
$host = 'us-cdbr-east-05.cleardb.net';
$user = 'b20549fe5517cc';
$password = '68781af3';
$dbname = 'heroku_f4aba06f53f6864';
/*$host = 'localhost';
$user = 'admin';
$password = 'admin';
$dbname = 'medhx';*/
$con = mysqli_connect($host, $user, $password, $dbname);
