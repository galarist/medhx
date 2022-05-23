<?php
include 'cors.php'; // cannot be a wildcard, you have to specify the name of the domain making the request here.
$localIP = getHostByName(getHostName()); // get user ip
echo json_encode($localIP); //convert php data to json data