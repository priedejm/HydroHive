<?php

require_once __DIR__ . '/../auth.php';

hh_require_method('POST');

$body = hh_json_body();
$username = trim((string) ($body['username'] ?? ''));
$password = (string) ($body['password'] ?? '');
$ip = hh_client_ip();

// Holds a per-username lock for the rest of this script's lifetime, so the
// count-check below and the attempt recorded further down can't race with
// another concurrent request for the same username - see the comment on
// hh_acquire_login_lock().
hh_acquire_login_lock($username);

if (hh_recent_failed_attempts($username) >= HH_MAX_LOGIN_ATTEMPTS) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many login attempts. Try again later.']);
    exit;
}

$stmt = hh_db()->prepare('SELECT id, password_hash FROM admin_users WHERE username = :username');
$stmt->execute(['username' => $username]);
$user = $stmt->fetch();

$valid = $user && password_verify($password, $user['password_hash']);
hh_record_login_attempt($ip, $username, $valid);

if (!$valid) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid username or password']);
    exit;
}

session_regenerate_id(true);
$_SESSION['admin'] = true;
$_SESSION['admin_id'] = $user['id'];
$token = hh_issue_csrf_token();

echo json_encode(['ok' => true, 'csrfToken' => $token]);
