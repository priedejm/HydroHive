<?php
require __DIR__ . '/_lib.php';
require __DIR__ . '/_auth.php';
require __DIR__ . '/_backups.php';

require_method('GET');
require_admin();
ok(['backups' => list_backup_files()]);
