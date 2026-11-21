<?php
/** POST {content: {...}} - replaces site-data/content.json (the previous version goes to backups/). */
require __DIR__ . '/_lib.php';
require __DIR__ . '/_auth.php';
require __DIR__ . '/_backups.php';

require_method('POST');
require_admin();

$body = read_json_body(CMS_CONTENT_MAX_BYTES);
$content = $body['content'] ?? null;
if (!is_array($content)) fail('Invalid content.');
// Top level must be an object of page sections, not a list.
if ($content && array_keys($content) === range(0, count($content) - 1)) fail('Invalid content.');

with_lock('content', function () use ($content) {
    backup_content();
    atomic_write_json(content_file(), $content ?: new stdClass());
});
ok();
