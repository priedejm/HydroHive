<?php
/** PUBLIC: the only endpoint the website itself calls. Returns edited text + media for every slot. */
require __DIR__ . '/_lib.php';

require_method('GET');

$content = read_json_file(data_dir() . DIRECTORY_SEPARATOR . 'content.json', []);
$media = [];
foreach (cms_slots() as $slot => $type) {
    if ($type === 'pool') continue;
    $o = read_order($slot);
    $media[$slot] = [
        'uploads' => list_uploads($slot),
        'order' => $o['order'],
        'hidden' => $o['hidden'],
    ];
}
// Empty PHP arrays encode as [], the site expects objects.
ok(['content' => $content ?: new stdClass(), 'media' => $media ?: new stdClass()]);
