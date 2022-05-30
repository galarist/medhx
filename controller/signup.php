<?php
include 'cors.php';
require __DIR__."/../model/conn.php";
require 'ratelimiter.php';
require_once 'session.php';
$method = $_SERVER['REQUEST_METHOD'];

if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

switch ($method) {
    case 'POST':
        /**
         * Check if token session exists
         */
        if (Session::get('token') !== null) {
            $content = file_get_contents('php://input');
            //convert to stdclass object
            $data = json_decode($content, true);
            // Extracting row by row
            foreach ($data as $row) {
                //$role = $row['role'];
                $role = 'p';
                $name = checkInput($row['name']);
                $email = checkInput($row['email']);
                $patient_ref = checkInput($row['patient_ref']);
                $password = 'Password@123';
                if (!empty($name) && !empty($email) && !empty($patient_ref)) {
                    $pwd = password_hash($password, PASSWORD_BCRYPT, array("cost" => 13));
                    $timestamp = time();
                    $dateReg = date("Y-m-d H:i:s", $timestamp);
                    $name = filter_var($name, FILTER_SANITIZE_STRING);
                    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
                    $patient_ref = filter_var($patient_ref, FILTER_SANITIZE_STRING);
                    $query = mysqli_query($con, "SELECT * FROM `users` WHERE email='" . $email . "'");
                    $query1 = mysqli_query($con, "SELECT * FROM `patient` WHERE patient_ref='" . $patient_ref . "'");
                    if (mysqli_num_rows($query) == 0 && mysqli_num_rows($query1) == 0) {
                        //build the signature
                        $key = $patient_ref;
                        $headers_encoded = '';
                        $payload_encoded = '';
                        $signature = hash_hmac('sha256', "$headers_encoded.$payload_encoded", $key, true);
                        $signature_encoded = base64_encode($signature);
                        //build and return the token
                        $token = "$headers_encoded.$payload_encoded.$signature_encoded";
                        $sql = "insert into users (role, name, email, password, dateReg, token) values ('$role','$name', '$email', '$pwd', '$dateReg', '$token')";
                        if (mysqli_query($con, $sql)) {
                            http_response_code(201); // CREATED
                            $last_id = mysqli_insert_id($con);
                            $sqlPatient = "insert into patient (userID, patient_ref) values ('$last_id', '$patient_ref')";
                            $result = mysqli_query($con, $sqlPatient);
                            http_response_code(201); // CREATED
                            session_destroy();
                        } else {
                            http_response_code(500); // ERROR
                            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
                        }
                    }
                } else {
                    http_response_code(500); // ERROR
                }
            }
        }
        break;
}

if ($method == 'GET') {
    $result = mysqli_query($con, $sql);
    if (!$id) {
        echo '[';
    }

    for ($i = 0; $i < mysqli_num_rows($result); $i++) {
        echo ($i > 0 ? ',' : '') . json_encode(mysqli_fetch_object($result));
    }
    if (!$id) {
        echo ']';
    }

} elseif ($method == 'POST') {
    //echo json_encode($result);
} else {
    echo mysqli_affected_rows($con);
}

require 'log.php';

$con->close();
