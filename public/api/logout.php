<?php
require __DIR__ . '/_lib.php';
require __DIR__ . '/_auth.php';

require_method('POST');
require_cms_header();
cms_session_start();
$_SESSION = [];
$p = session_get_cookie_params();
setcookie(session_name(), '', [
    'expires' => time() - 3600,
    'path' => $p['path'],
    'secure' => $p['secure'],
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_destroy();
ok();
