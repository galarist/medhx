<?php
include 'cors.php';
require __DIR__."/../model/conn.php";
require 'ratelimiter.php';
require_once 'session.php';
$method = $_SERVER['REQUEST_METHOD'];
$id = '';
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

$content = file_get_contents('php://input');
$data = json_decode($content, true);
/**
 * Check if token session exists
 */
//if ((Session::get('token')) !== null) {
    switch ($method) {
        case 'GET':
            $sql = "select * from reports";
            // run SQL statement
            $result = mysqli_query($con, $sql);
            http_response_code(202); // ACCEPTED
            if (!$id) {
                echo '[';
            }

            for ($i = 0; $i < mysqli_num_rows($result); $i++) {
                echo ($i > 0 ? ',' : '') . json_encode(mysqli_fetch_object($result));
            }
            if (!$id) {
                echo ']';
            }
            break;
        case 'POST':
            foreach ($data as $report) {
                $docID = '1';
                $patient_ref = checkInput($report["patient_ref"]);
                $reportTitle = checkInput($report["report_title"]);
                $reportLocation = checkInput($report['report']);
                if (!empty($docID) && !empty($patient_ref) && !empty($reportTitle) && !empty($reportLocation)) {
                    $reportDate = date('Y-m-d H:i:s', strtotime("now"));
                    $docID = filter_var($docID, FILTER_SANITIZE_NUMBER_INT);
                    $patient_ref = filter_var($patient_ref, FILTER_SANITIZE_STRING);
                    $reportTitle = filter_var($reportTitle, FILTER_SANITIZE_STRING);
                    $report = filter_var($reportLocation, FILTER_SANITIZE_EMAIL);
                    $sql = "INSERT INTO `reports` (`docID`, `patient_ref`, `report_title`, `report`, `reportDate`)
                    VALUES ('$docID', '$patient_ref', '$reportTitle', '$reportLocation', '$reportDate')";
                    if (mysqli_query($con, $sql)) {
                        http_response_code(201); // CREATED
                    } else {
                        http_response_code(500);
                        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
                    }
                } else {
                    http_response_code(500);
                }
            }
            break;
        case 'DELETE':
            foreach ($data as $key) {
                $id = checkInput($key['removeID']);
                $sql = "DELETE from `reports` where repID='$id'";
                if (mysqli_query($con, $sql)) {
                    $result = mysqli_query($con, $sql);
                    http_response_code(200); // OK
                } else {
                    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
                }
            }
            break;
        case 'PATCH':
            foreach ($data as $key) {
                $id = checkInput($key['updateID']);
                $title = checkInput($key['title']);
                $query = mysqli_query($con, "SELECT * FROM reports WHERE repID='" . $id . "'");
                if (mysqli_num_rows($query) > 0) {
                    $sql = "UPDATE `reports` SET report_title = '$title' where repID='$id'";
                    if (mysqli_query($con, $sql)) {
                        $result = mysqli_query($con, $sql);
                        http_response_code(202); // OK
                    } else {
                        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
                    }
                } else {
                    http_response_code(500);
                }
            }
            break;
    }
//}
require 'log.php';

$con->close();
