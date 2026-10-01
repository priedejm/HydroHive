<?php

require_once __DIR__ . '/bootstrap.php';

hh_require_method('GET');
header('Cache-Control: no-cache');

$stmt = hh_db()->query('SELECT section_key, data FROM content_sections');
$sections = [];
foreach ($stmt->fetchAll() as $row) {
    $sections[$row['section_key']] = json_decode($row['data'], true);
}

echo json_encode($sections);
