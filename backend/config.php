<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'mysql'); // Default to mysql database

// Create connection function
function getConnection($dbName = null) {
    $host = DB_HOST;
    $user = DB_USER;
    $pass = DB_PASS;
    $db = $dbName ? $dbName : DB_NAME;
    
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        return null;
    }
    
    return $conn;
}

// Response helper functions
function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

function sendError($message, $code = 400) {
    http_response_code($code);
    sendResponse(false, $message);
}

function sendSuccess($message, $data = null) {
    sendResponse(true, $message, $data);
}
?>
