<?php

require_once __DIR__ . '/../auth.php';

hh_require_method('POST');
hh_require_admin();

$body = hh_json_body();
$currentPassword = (string) ($body['currentPassword'] ?? '');
$newPassword = (string) ($body['newPassword'] ?? '');

if (strlen($newPassword) < 10) {
    http_response_code(422);
    echo json_encode(['error' => 'New password must be at least 10 characters']);
    exit;
}

$stmt = hh_db()->prepare('SELECT password_hash FROM admin_users WHERE id = :id');
$stmt->execute(['id' => $_SESSION['admin_id']]);
$user = $stmt->fetch();

if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Current password is incorrect']);
    exit;
}

$stmt = hh_db()->prepare('UPDATE admin_users SET password_hash = :hash WHERE id = :id');
$stmt->execute([
    'hash' => password_hash($newPassword, PASSWORD_DEFAULT),
    'id' => $_SESSION['admin_id'],
]);

echo json_encode(['ok' => true]);
