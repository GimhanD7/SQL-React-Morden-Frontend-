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
        getColumns();
        break;
    case 'POST':
        addColumn();
        break;
    case 'PUT':
        renameColumn();
        break;
    case 'DELETE':
        deleteColumn();
        break;
    default:
        sendError('Method not allowed', 405);
}

function getColumns() {
    if (!isset($_GET['database']) || !isset($_GET['table'])) {
        sendError('Database name and table name are required');
    }
    
    $dbName = $_GET['database'];
    $tableName = $_GET['table'];
    
    $conn = getConnection($dbName);
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $result = $conn->query("DESCRIBE `$tableName`");
    $columns = [];
    
    while ($row = $result->fetch_assoc()) {
        $columns[] = [
            'name' => $row['Field'],
            'type' => $row['Type'],
            'null' => $row['Null'],
            'key' => $row['Key'],
            'default' => $row['Default'],
            'extra' => $row['Extra']
        ];
    }
    
    $conn->close();
    sendSuccess('Columns retrieved successfully', $columns);
}

function addColumn() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['database']) || !isset($data['table']) || !isset($data['column'])) {
        sendError('Database name, table name, and column details are required');
    }
    
    $dbName = $data['database'];
    $tableName = $data['table'];
    $column = $data['column'];
    
    $colName = $column['name'];
    $colType = $column['type'];
    $colLength = isset($column['length']) && !empty($column['length']) ? "({$column['length']})" : '';
    $colNull = isset($column['nullable']) && $column['nullable'] ? 'NULL' : 'NOT NULL';
    $colDefault = isset($column['default']) && !empty($column['default']) ? "DEFAULT '{$column['default']}'" : '';
    $colAI = isset($column['autoIncrement']) && $column['autoIncrement'] ? 'AUTO_INCREMENT' : '';
    
    // Validate column name
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $colName)) {
        sendError('Invalid column name. Use only letters, numbers, and underscores');
    }
    
    $conn = getConnection($dbName);
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $sql = "ALTER TABLE `$tableName` ADD COLUMN `$colName` $colType$colLength $colNull $colDefault $colAI";
    
    if ($conn->query($sql) === TRUE) {
        $conn->close();
        sendSuccess("Column '$colName' added successfully");
    } else {
        $error = $conn->error;
        $conn->close();
        sendError("Error adding column: $error");
    }
}

function renameColumn() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['database']) || !isset($data['table']) || !isset($data['oldName']) || !isset($data['newName'])) {
        sendError('Database name, table name, old column name, and new column name are required');
    }
    
    $dbName = $data['database'];
    $tableName = $data['table'];
    $oldName = $data['oldName'];
    $newName = $data['newName'];
    
    // Validate new column name
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $newName)) {
        sendError('Invalid column name. Use only letters, numbers, and underscores');
    }
    
    $conn = getConnection($dbName);
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    // Get current column definition
    $result = $conn->query("SHOW COLUMNS FROM `$tableName` WHERE Field = '$oldName'");
    
    if ($result->num_rows === 0) {
        $conn->close();
        sendError("Column '$oldName' not found");
    }
    
    $colInfo = $result->fetch_assoc();
    $colType = $colInfo['Type'];
    $colNull = $colInfo['Null'] === 'YES' ? 'NULL' : 'NOT NULL';
    $colDefault = $colInfo['Default'] !== null ? "DEFAULT '{$colInfo['Default']}'" : '';
    $colExtra = $colInfo['Extra'];
    
    $sql = "ALTER TABLE `$tableName` CHANGE `$oldName` `$newName` $colType $colNull $colDefault $colExtra";
    
    if ($conn->query($sql) === TRUE) {
        $conn->close();
        sendSuccess("Column renamed from '$oldName' to '$newName' successfully");
    } else {
        $error = $conn->error;
        $conn->close();
        sendError("Error renaming column: $error");
    }
}

function deleteColumn() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['database']) || !isset($data['table']) || !isset($data['columnName'])) {
        sendError('Database name, table name, and column name are required');
    }
    
    $dbName = $data['database'];
    $tableName = $data['table'];
    $columnName = $data['columnName'];
    
    $conn = getConnection($dbName);
    if (!$conn) {
        sendError('Database connection failed');
    }
    
    $sql = "ALTER TABLE `$tableName` DROP COLUMN `$columnName`";
    
    if ($conn->query($sql) === TRUE) {
        $conn->close();
        sendSuccess("Column '$columnName' deleted successfully");
    } else {
        $error = $conn->error;
        $conn->close();
        sendError("Error deleting column: $error");
    }
}
?>
