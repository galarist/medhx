<?php
include 'cors.php';
require __DIR__."/../model/conn.php";
require 'ratelimiter.php';
require_once 'session.php';
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "POST") {
    $content = file_get_contents('php://input');
    //convert to stdclass object
    $data = json_decode($content, true);
    foreach ($data as $key) {
        $username = checkInput($key['username']);
        $password = checkInput($key['password']);
        $password = $password; // Password@123
        // Input field call + sanitize
        $username = filter_var($username, FILTER_SANITIZE_STRING);
        $password = filter_var($password, FILTER_SANITIZE_STRING);
        $sql = "SELECT * FROM admin
                WHERE username = '$username'";
        $select = mysqli_query($con, "$sql");
        $result = $con->query($sql);
        // Associative array
        $row = $result->fetch_array(MYSQLI_ASSOC);
        // Increase the default cost for BCRYPT to 12
        // Also switched to 60 characters (BCRYPT)
        //$pwd = password_hash($pwd, PASSWORD_BCRYPT, array("cost" => 13));
        $verify = password_verify($password, $row['password']);
        if ($verify) {
            Session::set('user', $row['username']);
            //build the signature
            $key = $username;
            $headers_encoded = '';
            $payload_encoded = '';
            $signature = hash_hmac('sha256', "$headers_encoded.$payload_encoded", $key, true);
            $signature_encoded = base64_encode($signature);
            //build and return the token
            $token = "$headers_encoded.$payload_encoded.$signature_encoded";
            // Check login details
            if (mysqli_num_rows($select)) {
                if ($row['token'] == $token) {
                    http_response_code(202); // ACCCEPTED
                    Session::set('token', $row['token']);
                    echo $row['token'];
                }
            }
        } else {
            session_destroy();
        }
    }
}
require 'log.php';
