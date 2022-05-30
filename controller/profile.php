<?php
include 'cors.php';
require __DIR__ . "/../model/conn.php";
require 'ratelimiter.php';
$method = $_SERVER['REQUEST_METHOD'];
$id = '';
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}
/**
 * Check if token session exists
 */
//if (Session::get('token') !== null) {
    switch ($method) {
        case 'GET':
            $sql = "select * from users 
            left join emergency on emergency.ID = users.userID";
            // run SQL statement
            $result = mysqli_query($con, $sql);
            http_response_code(202); // Accepted
            break;
        case 'DELETE':
            $content = file_get_contents('php://input');
            //convert to stdclass object
            $data = json_decode($content, true);
            if (is_array($data) || is_object($data)) {
                foreach ($data as $profile) {
                    $id = checkInput($profile['removeID']);
                    $sql = "DELETE from `emergency` where ID='$id'";
                    if (mysqli_query($con, $sql)) {
                        $result = mysqli_query($con, $sql);
                        http_response_code(200); // OK
                    } else {
                        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
                    }
                }
            }
            break;
        case 'PATCH':
            $content = file_get_contents('php://input');
            //convert to stdclass object
            $data = json_decode($content, true);
            if (is_array($data) || is_object($data)) {
                foreach ($data as $profile) {
                    $userID = checkInput($profile["userID"]);
                    $name = checkInput($profile["name"]);
                    $contact = checkInput($profile["contact"]);
                    $result = mysqli_query($con, "SELECT * FROM `emergency` WHERE ID='" . $userID . "'");
                    if ($result->num_rows) {
                        $sql1 = "UPDATE `emergency` SET contact='$contact' where ID='$userID'";
                        if (mysqli_query($con, $sql1)) {
                            http_response_code(202); // CREATED
                        } else {
                            http_response_code(500); // ERROR
                        }
                    } else {                        
                        $sqlEmergency = "INSERT INTO `emergency` (`contact`, `ID`) VALUES ('$contact', '$userID')";
                        mysqli_query($con, $sqlEmergency);
                    }
                    $sql = "UPDATE users SET name='$name' where userID='$userID'";
                    mysqli_query($con, $sql);
                    if (mysqli_query($con, $sql)) {
                        http_response_code(202); // CREATED
                    } else {
                        http_response_code(500); // ERROR
                    }
                    /*$result = mysqli_query($con, "SELECT * FROM `emergency` WHERE userID='" . $userID . "'");
                    if ($result->num_rows) {
                        $sql = "UPDATE users SET name='$name' where userID='$userID'";
                        $sql1 = "UPDATE `emergency` SET contact='$contact' where userID='$userID'";
                        mysqli_query($con, $sql);
                        mysqli_query($con, $sql1);
                        if (mysqli_query($con, $sql)) {
                            http_response_code(202); // CREATED
                        } else {
                            http_response_code(500); // ERROR
                        }
                    } else {
                        $sqlEmergency = "INSERT INTO `emergency` (`contact`, `userID`) VALUES ('$contact', '$userID')";
                        mysqli_query($con, $sqlEmergency);
                    }*/
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
        echo json_encode($result);
    } else {
        echo mysqli_affected_rows($con);
    }
//}
require 'log.php';

$con->close();
