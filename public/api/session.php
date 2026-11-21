<?php
require __DIR__ . '/_lib.php';
require __DIR__ . '/_auth.php';

require_method('GET');
require_cms_header();
$admin = is_admin();
// The server's real per-file upload limit, so the admin can warn before a long upload fails.
ok(['loggedIn' => $admin] + ($admin ? ['maxUpload' => cms_upload_limit()] : []));
