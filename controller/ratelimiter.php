<?php
require_once 'session.php';
const max = 60;
const sessionMax = 1000;
if (!isset($_SESSION)) {
    session_start();
    $stamp_init = date("Y-m-d H:i:s"); # Time format (ISO Date)
    if (Session::get('FIRST_REQUEST_TIME' === null)) {
       Session::set('FIRST_REQUEST_TIME', $stamp_init); # Set first visited time
    }
    $first_request_time = Session::get('FIRST_REQUEST_TIME'); # Get first visited time
    #session_start();
    if (Session::get('FIRST_REQUEST_TIME') != null) { # Set time limits
        $stamp_expire = date("Y-m-d H:i:s", strtotime($first_request_time) + (84600)); # 24 hours from current time
    } else {
        $stamp_expire = date("Y-m-d H:i:s", strtotime($first_request_time) + (60)); # 1 minute from current time
    }
    # Checks counter if set
    if (Session::get('REQ_COUNT') === null) {
        Session::set('REQ_COUNT', 1); # Sets the counter
    }
    $req_count = Session::get('REQ_COUNT'); # Getting the counter on each reload
    $req_count++; # +1 Count

    if ($stamp_init > $stamp_expire) { # Expired
        $req_count = 1;
        $first_request_time = $stamp_init;
    }
    Session::set('REQ_COUNT', $req_count);
    # Sets limit
    if (Session::get('user') != null) { # Authorised user
        Session::set('FIRST_REQUEST_TIME', $first_request_time);
        header('X-RateLimit-Limit: ' . sessionMax); # 1000
        header('X-RateLimit-Remaining: ' . (sessionMax - $req_count));
        if ($req_count > sessionMax) { # Too many requests
            http_response_code(429); # Too Many Requests
            exit();
        }
    } else { # Non-authorised user
        Session::set('FIRST_REQUEST_TIME', $first_request_time);
        header('X-RateLimit-Limit: ' . max); # 60
        header('X-RateLimit-Remaining: ' . (max - $req_count));
        if ($req_count > max) { # Too many requests
            http_response_code(429); # Too Many Requests
            exit();
        }
    }
}
