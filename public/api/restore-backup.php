<?php
/** POST {name} - makes an earlier content.json current again (the current one is backed up first). */
require __DIR__ . '/_lib.php';
require __DIR__ . '/_auth.php';
require __DIR__ . '/_backups.php';

require_method('POST');
require_admin();

$body = read_json_body();
$name = $body['name'] ?? '';
if (!is_string($name) || !preg_match(CMS_BACKUP_RE, $name)) fail('Unknown version.');

$dir = backups_dir();
$real = realpath($dir . DIRECTORY_SEPARATOR . $name);
if ($real === false || dirname($real) !== $dir || !is_file($real)) fail('Unknown version.', 404);

$data = read_json_file($real, null);
if (!is_array($data)) fail('That version is damaged and can not be restored.');

with_lock('content', function () use ($data) {
    backup_content();
    atomic_write_json(content_file(), $data ?: new stdClass());
});
ok();
