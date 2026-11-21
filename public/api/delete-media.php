<?php
/** POST {path: "/uploads/<slot>/<file>"} - deletes one uploaded file. Bundled originals can't be deleted (only hidden). */
require __DIR__ . '/_lib.php';
require __DIR__ . '/_auth.php';

require_method('POST');
require_admin();

$body = read_json_body();
$path = rawurldecode((string)($body['path'] ?? ''));
if (!preg_match('#^/uploads/([a-z0-9-]{1,40})/([A-Za-z0-9._-]{1,200})$#', $path, $m) || strpos($m[2], '..') !== false) {
    fail('Invalid file.');
}
[$slot] = safe_slot($m[1]);
$file = $m[2];

$dir = slot_dir($slot, false);
if ($dir === null) fail('File not found.', 404);
$real = realpath($dir . DIRECTORY_SEPARATOR . $file);
// Containment: the resolved file must live directly inside this slot's folder.
if ($real === false || !is_file($real) || dirname($real) !== $dir) fail('File not found.', 404);
if (!in_array(strtolower(pathinfo($real, PATHINFO_EXTENSION)), CMS_MEDIA_EXT, true)) fail('Invalid file.');

if (!@unlink($real)) fail_internal("unlink failed: $slot/$file", 'Could not delete the file.');

with_lock('order-' . $slot, function () use ($slot, $file) {
    $o = read_order($slot);
    $id = 'uploaded_' . $file;
    if (in_array($id, $o['order'], true)) {
        $o['order'] = array_values(array_diff($o['order'], [$id]));
        atomic_write_json(order_file($slot), $o);
    }
});
ok();
