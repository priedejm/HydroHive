<?php
// Copy this file to config.php on the server (NOT in git) and fill in real values.
// cPanel "MySQL Databases" gives you the db name/user, usually prefixed like
// cpaneluser_hydrohive / cpaneluser_hhadmin.

return [
    'db' => [
        'host' => 'localhost',
        'name' => 'cpaneluser_hydrohive',
        'user' => 'cpaneluser_hhadmin',
        'pass' => 'change-me',
    ],

    // Absolute filesystem path to the uploads directory (must be writable by PHP)
    // and the public URL prefix it's served under. These usually differ only if
    // uploads/ isn't a direct sibling of api/ in the document root.
    'uploads' => [
        'dir' => __DIR__ . '/../uploads',
        'url_prefix' => '/uploads',
    ],

    // Shared secret required as ?key=... to run migrations/seed.php once.
    // Set to a random string, then delete seed.php from the server after running it.
    'seed_secret' => 'change-me-too',
];
