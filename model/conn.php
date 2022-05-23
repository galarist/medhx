<?php
require_once '../controller/checkinput.php';
include '../controller/cors.php';
$id = '';
/*if (isset($_SERVER['HTTPS'])) {
    $host = "s08be.syd5.hostingplatform.net.au";
    $user = "crisgala_galarist";
    $password = "Y[,-}%5.K+jU";
    $dbname = "crisgala_medhx";
} else {
    $host = "localhost";
    $user = "admin";
    $password = "admin";
    $dbname = "medhx";
}*/

$host = 'us-cdbr-east-05.cleardb.net';
$user = 'b20549fe5517cc';
$password = '68781af3';
$dbname = 'heroku_f4aba06f53f6864';
$con = mysqli_connect($host, $user, $password, $dbname);
