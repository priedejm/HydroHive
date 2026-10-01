<?php

function hh_config(): array
{
    static $config = null;
    if ($config === null) {
        $path = __DIR__ . '/config.php';
        if (!file_exists($path)) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Server not configured: api/config.php is missing.']);
            exit;
        }
        $config = require $path;
    }
    return $config;
}

function hh_db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $db = hh_config()['db'];
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $db['host'], $db['name']);
        $pdo = new PDO($dsn, $db['user'], $db['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}
