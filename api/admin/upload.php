<?php

require_once __DIR__ . '/../auth.php';

hh_require_method('POST');
hh_require_admin();

const HH_MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const HH_ALLOWED_MIME_EXT = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];

if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(422);
    echo json_encode(['error' => 'No valid file uploaded']);
    exit;
}

$file = $_FILES['image'];

if ($file['size'] > HH_MAX_UPLOAD_BYTES) {
    http_response_code(422);
    echo json_encode(['error' => 'File too large (max 8MB)']);
    exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!isset(HH_ALLOWED_MIME_EXT[$mime]) || getimagesize($file['tmp_name']) === false) {
    http_response_code(422);
    echo json_encode(['error' => 'Only JPEG, PNG, or WebP images are allowed']);
    exit;
}

$ext = HH_ALLOWED_MIME_EXT[$mime];
$filename = bin2hex(random_bytes(16)) . '.' . $ext;

$config = hh_config()['uploads'];
$destDir = $config['dir'];
if (!is_dir($destDir) && !mkdir($destDir, 0755, true) && !is_dir($destDir)) {
    http_response_code(500);
    echo json_encode(['error' => 'Uploads directory is not writable']);
    exit;
}

$destPath = $destDir . '/' . $filename;
if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save uploaded file']);
    exit;
}

$url = rtrim($config['url_prefix'], '/') . '/' . $filename;
echo json_encode(['url' => $url]);
