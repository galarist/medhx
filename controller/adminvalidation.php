<?php
include '../model/conn.php';
require 'ratelimiter.php';
require_once 'session.php';
$token = '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    foreach ($data as $key) {
        $token = $key["token"];
        $sql = "SELECT * FROM admin
            WHERE `token` = '$token'";
        $select = mysqli_query($con, "$sql");
        $result = $con->query($sql);
        // Associative array
        $row = $result->fetch_array(MYSQLI_ASSOC);
        //build the signature
        if (!empty($row['token'])) {
            $key = $row['token'];
            $headers_encoded = '';
            $payload_encoded = '';
            $signature = hash_hmac('sha256', "$headers_encoded.$payload_encoded", $key, true);
            $signature_encoded = base64_encode($signature);
            //build and return the token
            $token = "$headers_encoded.$payload_encoded.$signature_encoded";
            Session::set('token', $token);
            // Check login details
            if (mysqli_num_rows($select)) {
                http_response_code(202); // ACCCEPTED
                echo json_encode(array(
                    "token" => $row['token'],
                    "username" => $row['username'],
                ));
                Session::set('token', $row['token']);
            } else {
                session_destroy();
            }
        }       
    }
}
