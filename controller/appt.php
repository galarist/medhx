<?php
require '../model/conn.php';
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
        $sql = "select appointments.date, appointments.location, appointments.docID, doctors.docsID, doctors.userID, users.userID, users.name from appointments
                INNER JOIN doctors on doctors.docsID = docID
                INNER JOIN users on doctors.userID = users.userID";
        // run SQL statement
        $result = mysqli_query($con, $sql);
        http_response_code(200); // OK
        break;
    case 'POST':
        foreach ($data as $key) {
            $docID = '1';
            $patient_ref = checkInput($key["patient_ref"]);
            $location = checkInput($key["location"]);
            $date = checkInput($key["date"]);
            $fixed = date('Y-m-d H:i:s', strtotime($date));
            if (!empty($docID) && !empty($patient_ref) && !empty($location) && !empty($fixed) && strtotime($fixed)) {
                $docID = filter_var($docID, FILTER_SANITIZE_STRING);
                $patient_ref = filter_var($patient_ref, FILTER_SANITIZE_STRING);
                $location = filter_var($location, FILTER_SANITIZE_STRING);
                $fixed = filter_var($fixed, FILTER_SANITIZE_STRING);
                $sql = "INSERT INTO `appointments` (`docID`, `patient_ref`, `location`, `date`) VALUES ($docID, '$patient_ref', '$location', '$fixed')";
                // run SQL statement
                $result = mysqli_query($con, $sql);
                // die if SQL statement failed
                if (!$result) {
                    http_response_code(500); // Internal server error
                    die(mysqli_error($con));
                } else {
                    http_response_code(201); // Created
                }
            } else {
                http_response_code(500); // Created
            }
        }
        break;
}

    if ($method == 'GET') {
        if (!$id) {
            echo '[';
        }

        for ($i = 0; $i < mysqli_num_rows($result); $i++) {
            echo($i > 0 ? ',' : '') . json_encode(mysqli_fetch_object($result));
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
