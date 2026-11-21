<?php
defined('CMS_OK') || exit;

const CMS_BACKUP_RE = '/^content-\d{8}-\d{6}-[a-f0-9]{6}\.json$/';

function content_file(): string
{
    return data_dir() . DIRECTORY_SEPARATOR . 'content.json';
}

/** Copy the current content.json into backups/ and prune old copies. Call inside with_lock('content'). */
function backup_content()
{
    $cur = content_file();
    if (!is_file($cur)) return;
    $dir = backups_dir();
    $name = 'content-' . date('Ymd-His') . '-' . bin2hex(random_bytes(3)) . '.json';
    if (!@copy($cur, $dir . DIRECTORY_SEPARATOR . $name)) fail_internal('backup copy failed');
    foreach (array_slice(list_backup_files(), CMS_BACKUPS_KEEP) as $old) {
        @unlink($dir . DIRECTORY_SEPARATOR . $old['name']);
    }
}

/** Newest first. */
function list_backup_files(): array
{
    $dir = backups_dir();
    $out = [];
    foreach (scandir($dir) ?: [] as $f) {
        if (!preg_match(CMS_BACKUP_RE, $f)) continue;
        $p = $dir . DIRECTORY_SEPARATOR . $f;
        $out[] = ['name' => $f, 'modified' => filemtime($p), 'size' => filesize($p)];
    }
    usort($out, function ($a, $b) {
        return strcmp($b['name'], $a['name']);
    });
    return $out;
}
