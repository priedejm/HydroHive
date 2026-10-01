<?php

require_once __DIR__ . '/../auth.php';

hh_require_method('POST');
hh_require_admin();

const HH_VALID_SECTIONS = [
    'site', 'services', 'locations', 'service_content',
    'reviews', 'team', 'home', 'gallery', 'seo',
];

$body = hh_json_body();
$key = (string) ($body['key'] ?? '');
$data = $body['data'] ?? null;

if (!in_array($key, HH_VALID_SECTIONS, true)) {
    http_response_code(422);
    echo json_encode(['error' => 'Unknown section key']);
    exit;
}

if ($data === null) {
    http_response_code(422);
    echo json_encode(['error' => 'Missing data']);
    exit;
}

$json = json_encode($data);
if ($json === false) {
    http_response_code(422);
    echo json_encode(['error' => 'Data is not valid JSON']);
    exit;
}

$stmt = hh_db()->prepare(
    'INSERT INTO content_sections (section_key, data) VALUES (:key, :data)
     ON DUPLICATE KEY UPDATE data = VALUES(data)'
);
$stmt->execute(['key' => $key, 'data' => $json]);

echo json_encode(['ok' => true]);
