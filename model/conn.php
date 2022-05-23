<?php
require_once '../controller/checkinput.php';
include '../controller/cors.php';
$id = '';
if (isset($_SERVER['HTTPS'])) {
    $host = "s08be.syd5.hostingplatform.net.au";
    $user = "crisgala_galarist";
    $password = "Y[,-}%5.K+jU";
    $dbname = "crisgala_medhx";
} else {
    $host = "localhost";
    $user = "admin";
    $password = "admin";
    $dbname = "medhx";
}
$con = mysqli_connect($host, $user, $password, $dbname);
