<?php

require_once __DIR__ . '/../auth.php';

hh_require_method('POST');
hh_require_admin();

$_SESSION = [];
session_destroy();

echo json_encode(['ok' => true]);
