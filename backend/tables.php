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
        getTables();
        break;
    case 'POST':
        createTable();
        break;
    case 'DELETE':
        deleteTable();
        break;
    default:
        sendError('Method not allowed', 405);
}

function getTables() {
    if (!isset($_GET['database'])) {
        sendError('Database name is required');
    }
    
    $dbName = $_GET['database'];
    $conn = getConnection($dbName);
    
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $result = $conn->query("SHOW TABLES");
    $tables = [];
    
    while ($row = $result->fetch_array()) {
        $tables[] = $row[0];
    }
    
    $conn->close();
    sendSuccess('Tables retrieved successfully', $tables);
}

function createTable() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['database']) || !isset($data['tableName']) || !isset($data['columns'])) {
        sendError('Database name, table name, and columns are required');
    }
    
    $dbName = $data['database'];
    $tableName = $data['tableName'];
    $columns = $data['columns'];
    
    if (empty($columns)) {
        sendError('At least one column is required');
    }
    
    // Validate table name
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $tableName)) {
        sendError('Invalid table name. Use only letters, numbers, and underscores');
    }
    
    $conn = getConnection($dbName);
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    // Build column definitions
    $columnDefs = [];
    foreach ($columns as $col) {
        $colName = $col['name'];
        $colType = $col['type'];
        $colLength = isset($col['length']) && !empty($col['length']) ? "({$col['length']})" : '';
        $colNull = isset($col['nullable']) && $col['nullable'] ? 'NULL' : 'NOT NULL';
        $colDefault = isset($col['default']) && !empty($col['default']) ? "DEFAULT '{$col['default']}'" : '';
        $colAI = isset($col['autoIncrement']) && $col['autoIncrement'] ? 'AUTO_INCREMENT' : '';
        $colPK = isset($col['primaryKey']) && $col['primaryKey'] ? 'PRIMARY KEY' : '';
        
        $columnDefs[] = "`$colName` $colType$colLength $colNull $colDefault $colAI $colPK";
    }
    
    $sql = "CREATE TABLE `$tableName` (" . implode(', ', $columnDefs) . ")";
    
    if ($conn->query($sql) === TRUE) {
        $conn->close();
        sendSuccess("Table '$tableName' created successfully");
    } else {
        $error = $conn->error;
        $conn->close();
        sendError("Error creating table: $error");
    }
}

function deleteTable() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['database']) || !isset($data['tableName'])) {
        sendError('Database name and table name are required');
    }
    
    $dbName = $data['database'];
    $tableName = $data['tableName'];
    
    $conn = getConnection($dbName);
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $sql = "DROP TABLE `$tableName`";
    
    if ($conn->query($sql) === TRUE) {
        $conn->close();
        sendSuccess("Table '$tableName' deleted successfully");
    } else {
        $error = $conn->error;
        $conn->close();
        sendError("Error deleting table: $error");
    }
}
?>
