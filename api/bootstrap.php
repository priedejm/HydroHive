<?php

require_once __DIR__ . '/db.php';

ini_set('display_errors', '0');
error_reporting(E_ALL);

// 'secure' must match reality: if it's forced true while the site is being
// tested over plain HTTP (e.g. before DNS/SSL is fully switched over on a
// fresh cPanel deploy), the browser silently drops the session cookie and
// every login appears to succeed but never actually persists.
$hh_is_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['SERVER_PORT'] ?? null) == 443)
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? null) === 'https');

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $hh_is_https,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

set_exception_handler(function (Throwable $e) {
    error_log('[hydrohive-api] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
    exit;
});

function hh_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function hh_require_method(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }
}
