<?php
/**
 * POST multipart: path=/uploads/<slot>/<file>, file0 = a smaller version of that photo.
 * Overwrites an existing uploaded PHOTO in place (same URL, so nothing that links to it
 * has to change). Used by the admin's "Shrink large photos" action.
 * The new file must be a real image of the SAME type as the existing one.
 */
require __DIR__ . '/_lib.php';
require __DIR__ . '/_auth.php';

require_method('POST');
require_admin();

const REPLACE_TYPES = [
    IMAGETYPE_JPEG => ['image/jpeg', ['jpg', 'jpeg']],
    IMAGETYPE_PNG => ['image/png', ['png']],
    IMAGETYPE_WEBP => ['image/webp', ['webp']],
];

$path = rawurldecode((string)($_POST['path'] ?? ''));
if (!preg_match('#^/uploads/([a-z0-9-]{1,40})/([A-Za-z0-9._-]{1,200})$#', $path, $m) || strpos($m[2], '..') !== false) {
    fail('Invalid file.');
}
[$slot] = safe_slot($m[1]);
$dir = slot_dir($slot, false);
if ($dir === null) fail('File not found.', 404);
$real = realpath($dir . DIRECTORY_SEPARATOR . $m[2]);
// Containment: the resolved file must live directly inside this slot's folder.
if ($real === false || !is_file($real) || dirname($real) !== $dir) fail('File not found.', 404);
$ext = strtolower(pathinfo($real, PATHINFO_EXTENSION));

$f = $_FILES['file0'] ?? null;
if (!$f || is_array($f['name'] ?? null) || (int)($f['error'] ?? 1) !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) {
    fail("The photo didn't upload completely. Please try again.");
}
$tmp = $f['tmp_name'];
if (filesize($tmp) > CMS_IMAGE_MAX_BYTES) fail('That photo is too large.');
$info = @getimagesize($tmp);
$kind = $info[2] ?? null;
$mime = (string)(new finfo(FILEINFO_MIME_TYPE))->file($tmp);
if (!$info || !isset(REPLACE_TYPES[$kind]) || REPLACE_TYPES[$kind][0] !== $mime || !in_array($ext, REPLACE_TYPES[$kind][1], true)) {
    fail("The new version isn't the same kind of image.");
}
if ($info[0] < 1 || $info[1] < 1 || $info[0] * $info[1] > 80000000) fail('That photo has unusable dimensions.');

// Atomic swap: move next to the target, then rename over it.
$part = $real . '.part-' . bin2hex(random_bytes(4));
if (!move_uploaded_file($tmp, $part)) fail_internal("replace: move failed for $slot", "The photo couldn't be saved. Please try again.");
@chmod($part, 0644);
if (!@rename($part, $real)) {
    @unlink($part);
    fail_internal("replace: rename failed for $slot", "The photo couldn't be saved. Please try again.");
}
clearstatcache(true, $real);
ok(['size' => filesize($real)]);
