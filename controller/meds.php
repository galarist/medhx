<?php
include 'cors.php';
require __DIR__ . "/../model/conn.php";
require 'ratelimiter.php';
$method = $_SERVER['REQUEST_METHOD'];

if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}
/**
 * Check if token session exists
 */
if (Session::get('token') !== null) {
    $content = file_get_contents('php://input');
    //convert to stdclass object
    $data = json_decode($content, true);
    switch ($method) {
        case 'GET':
            $sql = "select * from meds";
            // run SQL statement
            $result = mysqli_query($con, $sql);
            http_response_code(202); // Accepted
            break;
        case 'POST':
            foreach ($data as $key) {
                $docsID = 1;
                $patient_ref = checkInput($key["patient_ref"]);
                $med_name = checkInput($key["med_name"]);
                $dose = checkInput((int) $key["dose"]);
                if (!empty($docsID) && !empty($patient_ref) && !empty($med_name) && !empty($dose)) {
                    $docsID = filter_var($docsID, FILTER_SANITIZE_NUMBER_INT);
                    $patient_ref = filter_var($patient_ref, FILTER_SANITIZE_STRING);
                    $med_name = filter_var($med_name, FILTER_SANITIZE_STRING);
                    $dose = filter_var($dose, FILTER_SANITIZE_STRING);
                    $sql = "INSERT INTO meds (docsID, patient_ref, med_name, dose)
                values ($docsID, '$patient_ref', '$med_name', $dose)";
                    // run SQL statement
                    $result = mysqli_query($con, $sql);
                    // die if SQL statement failed
                    if (!$result) {
                        http_response_code(500); // Error
                        die(mysqli_error($con));
                    } else {
                        http_response_code(201); // Created
                    }
                } else {
                    echo 'Fill all the inputs';
                    http_response_code(500); // Error
                }
            }
            break;
    }

    if ($method == 'GET') {
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
}
require 'log.php';
$con->close();
