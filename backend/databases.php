<?php
// CORS headers - must be before any other output
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getDatabases();
        break;
    case 'POST':
        createDatabase();
        break;
    case 'DELETE':
        deleteDatabase();
        break;
    default:
        sendError('Method not allowed', 405);
}

function getDatabases() {
    $conn = getConnection();
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $result = $conn->query("SHOW DATABASES");
    $databases = [];
    
    while ($row = $result->fetch_assoc()) {
        $dbName = $row['Database'];
        // Skip system databases
        if (!in_array($dbName, ['information_schema', 'performance_schema', 'mysql', 'phpmyadmin'])) {
            $databases[] = $dbName;
        }
    }
    
    $conn->close();
    sendSuccess('Databases retrieved successfully', $databases);
}

function createDatabase() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name']) || empty($data['name'])) {
        sendError('Database name is required');
    }
    
    $dbName = $data['name'];
    
    // Validate database name
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $dbName)) {
        sendError('Invalid database name. Use only letters, numbers, and underscores');
    }
    
    $conn = getConnection();
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $sql = "CREATE DATABASE `$dbName`";
    
    if ($conn->query($sql) === TRUE) {
        $conn->close();
        sendSuccess("Database '$dbName' created successfully");
    } else {
        $error = $conn->error;
        $conn->close();
        sendError("Error creating database: $error");
    }
}

function deleteDatabase() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name']) || empty($data['name'])) {
        sendError('Database name is required');
    }
    
    $dbName = $data['name'];
    
    $conn = getConnection();
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $sql = "DROP DATABASE `$dbName`";
    
    if ($conn->query($sql) === TRUE) {
        $conn->close();
        sendSuccess("Database '$dbName' deleted successfully");
    } else {
        $error = $conn->error;
        $conn->close();
        sendError("Error deleting database: $error");
    }
}
?>
