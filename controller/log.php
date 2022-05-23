<?php
require_once 'session.php';
$file_name      = 'log.json';
$current_data   = file_get_contents("$file_name");
$array_data     = json_decode($current_data, true);
$logging        = array(
    'IP'        => getHostByName(getHostName()),
    'username'  => session::get('user'),
    'usertype'  => null,
    'timestamp' => date("d-m-Y H:i:s"),
    'method'    => $_SERVER['REQUEST_METHOD']);
$array_data[]   = $logging;
file_put_contents("$file_name", json_encode($array_data, JSON_PRETTY_PRINT));
