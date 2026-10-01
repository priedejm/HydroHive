<?php
// One-time setup script: populates content_sections from seed-data.json and
// creates the initial admin_users row. Run once by visiting this file in a
// browser with ?key=<seed_secret from config.php>, then DELETE this file
// from the server - it is not part of the ongoing API surface.

require_once __DIR__ . '/../db.php';

header('Content-Type: text/plain');

$config = hh_config();

if (($_GET['key'] ?? '') !== $config['seed_secret']) {
    http_response_code(403);
    echo "Forbidden: pass ?key=<seed_secret from config.php>\n";
    exit;
}

$seedPath = __DIR__ . '/seed-data.json';
$data = json_decode(file_get_contents($seedPath), true);
if (!is_array($data)) {
    http_response_code(500);
    echo "Failed to read/parse seed-data.json\n";
    exit;
}

$pdo = hh_db();

$stmt = $pdo->prepare(
    'INSERT INTO content_sections (section_key, data) VALUES (:key, :data)
     ON DUPLICATE KEY UPDATE data = VALUES(data)'
);
foreach ($data as $key => $value) {
    $stmt->execute(['key' => $key, 'data' => json_encode($value)]);
    echo "Seeded section: $key\n";
}

$adminUser = $_GET['username'] ?? 'admin';
$adminPass = $_GET['password'] ?? null;
if ($adminPass) {
    $stmt = $pdo->prepare(
        'INSERT INTO admin_users (username, password_hash) VALUES (:u, :p)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'
    );
    $stmt->execute(['u' => $adminUser, 'p' => password_hash($adminPass, PASSWORD_DEFAULT)]);
    echo "Created/updated admin user: $adminUser\n";
} else {
    echo "No admin user created - pass &username=...&password=... to also set the initial login.\n";
}

echo "\nDone. Now DELETE this file (seed.php) from the server.\n";
