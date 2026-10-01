<?php

require_once __DIR__ . '/../auth.php';

hh_require_method('GET');

if (!hh_is_authenticated()) {
    echo json_encode(['authenticated' => false]);
    exit;
}

// A GET never had a CSRF token issued against it before login, so make sure
// one exists for the SPA to pick up on page load/refresh without a re-login.
// Uses the non-rotating variant - see the comment on hh_ensure_csrf_token().
$token = hh_ensure_csrf_token();

echo json_encode(['authenticated' => true, 'csrfToken' => $token]);
