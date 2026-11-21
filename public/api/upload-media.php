<?php
/**
 * POST multipart: slot=<slot id>, file0..fileN.
 * Images: jpg/png/webp/gif, verified with getimagesize() AND finfo.
 * Videos: mp4/mov/webm, verified with finfo ("video" slots, and "media" galleries
 * that take photos and videos).
 * Never SVG, never anything executable.
 * The saved extension comes from the detected type, not from the uploaded name.
 */
require __DIR__ . '/_lib.php';
require __DIR__ . '/_auth.php';

require_method('POST');

// When a request exceeds post_max_size PHP silently drops the whole body.
if (empty($_POST) && empty($_FILES) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    $lim = cms_upload_limit();
    fail('That upload is too large for the server' . ($lim ? ' (limit ' . ($lim >> 20) . 'MB)' : '') . '.', 413);
}

require_admin();

[$slot, $type] = safe_slot($_POST['slot'] ?? '');
$single = $type === 'single' || $type === 'video';

const IMAGE_TYPES = [
    IMAGETYPE_JPEG => ['image/jpeg', 'jpg'],
    IMAGETYPE_PNG => ['image/png', 'png'],
    IMAGETYPE_WEBP => ['image/webp', 'webp'],
    IMAGETYPE_GIF => ['image/gif', 'gif'],
];
const VIDEO_TYPES = [
    'video/mp4' => 'mp4',
    'video/x-m4v' => 'mp4',
    'video/webm' => 'webm',
    'video/quicktime' => 'mov', // iPhone videos
];
const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const VIDEO_EXT = ['mp4', 'm4v', 'webm', 'mov'];

$files = [];
foreach ($_FILES as $field => $f) {
    if (!preg_match('/^file\d{1,2}$/', (string)$field) || is_array($f['name'] ?? null)) continue;
    $files[] = $f;
}
if (!$files) fail('No file received.');
if ($single) $files = array_slice($files, 0, 1);
if (count($files) > 20) fail('Please upload at most 20 files at a time.');

$finfo = new finfo(FILEINFO_MIME_TYPE);
$saved = [];
$errors = [];

foreach ($files as $f) {
    $orig = (string)($f['name'] ?? 'file');
    $label = substr(preg_replace('/[^A-Za-z0-9 ._()-]+/', '', basename($orig)), 0, 80) ?: 'File';
    $err = (int)($f['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE) {
        $errors[] = "$label is too large for the server (limit " . (cms_upload_limit() >> 20) . 'MB).';
        continue;
    }
    if ($err !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) {
        $errors[] = "$label didn't upload completely. Please try again.";
        continue;
    }
    $tmp = $f['tmp_name'];
    $size = filesize($tmp);
    $ext = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
    $mime = (string)$finfo->file($tmp);
    // A photo+video gallery decides per file; the checks below still verify the content.
    $isVideo = $type === 'video' || ($type === 'media' && in_array($ext, VIDEO_EXT, true));

    if ($isVideo) {
        if (!in_array($ext, VIDEO_EXT, true) || !isset(VIDEO_TYPES[$mime])) {
            $errors[] = "$label isn't an MP4, MOV or WebM video.";
            continue;
        }
        if ($size > CMS_VIDEO_MAX_BYTES) {
            $errors[] = "$label is over " . (CMS_VIDEO_MAX_BYTES >> 20) . 'MB.';
            continue;
        }
        $finalExt = VIDEO_TYPES[$mime];
    } else {
        $info = @getimagesize($tmp);
        $kind = $info[2] ?? null;
        if (!in_array($ext, IMAGE_EXT, true) || !$info || !isset(IMAGE_TYPES[$kind]) || IMAGE_TYPES[$kind][0] !== $mime) {
            $errors[] = "$label isn't a JPG, PNG, WebP or GIF image.";
            continue;
        }
        if ($size > CMS_IMAGE_MAX_BYTES) {
            $errors[] = "$label is over " . (CMS_IMAGE_MAX_BYTES >> 20) . 'MB.';
            continue;
        }
        if ($info[0] < 1 || $info[1] < 1 || $info[0] * $info[1] > 80000000) {
            $errors[] = "$label has unusable dimensions.";
            continue;
        }
        $finalExt = IMAGE_TYPES[$kind][1];
    }

    $base = preg_replace('/[^A-Za-z0-9-]+/', '-', pathinfo($orig, PATHINFO_FILENAME));
    $base = trim(substr((string)$base, 0, 60), '-');
    if ($base === '') $base = 'file';
    $name = time() . '_' . uniqid() . '_' . $base . '.' . $finalExt;
    $dir = slot_dir($slot, true);
    $dest = $dir . DIRECTORY_SEPARATOR . $name;
    if (!move_uploaded_file($tmp, $dest)) {
        error_log("[cms] move_uploaded_file failed for slot $slot");
        $errors[] = "$label couldn't be saved. Please try again.";
        continue;
    }
    @chmod($dest, 0644);
    $saved[] = ['url' => '/uploads/' . $slot . '/' . $name, 'name' => display_name($name), 'file' => $name];
}

// Single image / video areas keep only the newest upload.
if ($single && $saved) {
    $keep = $saved[0]['file'];
    $dir = slot_dir($slot, false);
    foreach (list_uploads($slot) as $u) {
        $file = substr($u['id'], strlen('uploaded_'));
        if ($file !== $keep) @unlink($dir . DIRECTORY_SEPARATOR . $file);
    }
}

$out = array_map(function ($s) {
    return ['url' => $s['url'], 'name' => $s['name']];
}, $saved);

if (!$out) fail($errors ? implode(' ', $errors) : 'Upload failed.', 400);
ok(['files' => $out] + ($errors ? ['errors' => $errors] : []));
