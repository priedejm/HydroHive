<?php
/**
 * Shared helpers for the content admin endpoints. PHP 7.4+.
 *
 * Layout on the server (public_html = the folder this api/ folder sits in):
 *   public_html/api/*.php          these endpoints (deployed with every build - code only)
 *   public_html/uploads/<slot>/    uploaded images/videos          <- LIVE DATA, never delete
 *   public_html/site-data/         content.json, order-*.json, backups/  <- LIVE DATA, web access denied
 *   ../cms-config/<site-folder>.php  admin password hash, OUTSIDE the web root, one file per
 *                                  site (e.g. /home/user/cms-config/example.com.php when the
 *                                  site lives in /home/user/example.com) so several sites on
 *                                  one cPanel account never share a password
 *
 * Nothing here ever echoes a filesystem path back to the browser.
 */

define('CMS_OK', true);

ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

const CMS_IMAGE_MAX_BYTES = 15 * 1024 * 1024;
const CMS_VIDEO_MAX_BYTES = 150 * 1024 * 1024;
const CMS_CONTENT_MAX_BYTES = 2 * 1024 * 1024;
const CMS_BACKUPS_KEEP = 30;

function ok(array $data = [])
{
    echo json_encode(['success' => true] + $data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function fail(string $message, int $code = 400)
{
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

/** Log details server-side only; the browser gets a generic message. */
function fail_internal(string $logDetail, string $message = 'Something went wrong on the server. Please try again.')
{
    error_log('[cms] ' . $logDetail);
    fail($message, 500);
}

function require_method(string $method)
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) fail('Method not allowed', 405);
}

function web_root(): string
{
    static $root = null;
    if ($root === null) $root = realpath(dirname(__DIR__));
    return $root;
}

/** Name of this site's config file: the web root's folder name (from disk, never from the request). */
function cms_config_name(): string
{
    return basename(web_root()) . '.php';
}

function cms_config(): array
{
    $file = dirname(web_root()) . DIRECTORY_SEPARATOR . 'cms-config' . DIRECTORY_SEPARATOR . cms_config_name();
    if (!is_file($file)) return [];
    $cfg = include $file;
    return is_array($cfg) ? $cfg : [];
}

function ensure_dir(string $dir, ?string $htaccess = null): string
{
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
        fail_internal("mkdir failed: $dir");
    }
    if ($htaccess !== null) {
        $ht = $dir . DIRECTORY_SEPARATOR . '.htaccess';
        if (!is_file($ht) || file_get_contents($ht) !== $htaccess) @file_put_contents($ht, $htaccess);
    }
    return realpath($dir);
}

const CMS_DENY_ALL = "# Managed by the site admin. Private data - never served.\nRequire all denied\n";

/**
 * Uploads: only plain media files are ever served from here, and no script
 * handler runs (belt and braces - the upload code never writes other extensions).
 */
const CMS_UPLOADS_HTACCESS = <<<'HT'
# Managed by the site admin. Only media files may be served from here.
Options -Indexes -ExecCGI
RemoveHandler .php .php3 .php4 .php5 .php7 .php8 .phtml .phar .pl .py .cgi .sh
RemoveType .php .php3 .php4 .php5 .php7 .php8 .phtml .phar
Require all denied
<FilesMatch "(?i)\.(jpe?g|png|webp|gif|mp4|webm)$">
  Require all granted
</FilesMatch>
<IfModule mod_headers.c>
  Header set X-Content-Type-Options nosniff
</IfModule>

HT;

function data_dir(): string
{
    return ensure_dir(web_root() . DIRECTORY_SEPARATOR . 'site-data', CMS_DENY_ALL);
}

function backups_dir(): string
{
    return ensure_dir(data_dir() . DIRECTORY_SEPARATOR . 'backups', CMS_DENY_ALL);
}

function uploads_root(): string
{
    return ensure_dir(web_root() . DIRECTORY_SEPARATOR . 'uploads', CMS_UPLOADS_HTACCESS);
}

/* ---------------------------------------------------------------- slots */

function cms_slots(): array
{
    static $slots = null;
    if ($slots === null) $slots = require __DIR__ . '/_slots.php';
    return $slots;
}

/** Validates a slot id against the allow-list. Returns [id, type]. */
function safe_slot($slot): array
{
    if (!is_string($slot) || !preg_match('/^[a-z0-9-]{1,40}$/', $slot)) fail('Unknown photo/video area.');
    $slots = cms_slots();
    if (!isset($slots[$slot])) fail('Unknown photo/video area.');
    return [$slot, $slots[$slot]];
}

function slot_dir(string $slot, bool $create): ?string
{
    $dir = uploads_root() . DIRECTORY_SEPARATOR . $slot;
    if (!is_dir($dir)) {
        if (!$create) return null;
        ensure_dir($dir);
    }
    $real = realpath($dir);
    // Containment: the slot folder must sit directly inside uploads/.
    if ($real === false || dirname($real) !== uploads_root()) fail_internal("slot dir escaped: $slot");
    return $real;
}

const CMS_MEDIA_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'mov'];

/** "128M" -> bytes. */
function ini_bytes(string $v): int
{
    $v = trim($v);
    if ($v === '') return 0;
    $n = (int)$v;
    switch (strtolower(substr($v, -1))) {
        case 'g': $n *= 1024;
        // no break
        case 'm': $n *= 1024;
        // no break
        case 'k': $n *= 1024;
    }
    return $n;
}

/** Largest single file this server will accept (0 = unknown / unlimited). */
function cms_upload_limit(): int
{
    $limits = array_filter([ini_bytes((string)ini_get('upload_max_filesize')), ini_bytes((string)ini_get('post_max_size'))]);
    return $limits ? min($limits) : 0;
}

/** Uploaded files in a slot, oldest first. */
function list_uploads(string $slot): array
{
    $dir = slot_dir($slot, false);
    if ($dir === null) return [];
    $out = [];
    foreach (scandir($dir) ?: [] as $f) {
        if ($f[0] === '.' || !preg_match('/^[A-Za-z0-9._-]{1,200}$/', $f)) continue;
        $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
        if (!in_array($ext, CMS_MEDIA_EXT, true)) continue;
        $path = $dir . DIRECTORY_SEPARATOR . $f;
        if (!is_file($path)) continue;
        $out[] = [
            'id' => 'uploaded_' . $f,
            'name' => display_name($f),
            'url' => '/uploads/' . $slot . '/' . rawurlencode($f),
            'size' => filesize($path),
            'modified' => filemtime($path),
        ];
    }
    // Filenames start with a unix timestamp, so name order == upload order.
    usort($out, function ($a, $b) {
        return strcmp($a['id'], $b['id']);
    });
    return $out;
}

/** "1712345678_65f1a2b3c4d5e_team-photo.jpg" -> "team-photo.jpg" */
function display_name(string $file): string
{
    return preg_replace('/^\d+_[0-9a-f]+_/', '', $file);
}

function order_file(string $slot): string
{
    return data_dir() . DIRECTORY_SEPARATOR . 'order-' . $slot . '.json';
}

function read_order(string $slot): array
{
    $d = read_json_file(order_file($slot), []);
    return [
        'order' => array_values(array_filter($d['order'] ?? [], 'is_string')),
        'hidden' => array_values(array_filter($d['hidden'] ?? [], 'is_string')),
    ];
}

/* ------------------------------------------------------------- json io */

function read_json_body(int $maxBytes = 65536): array
{
    $len = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($len > $maxBytes) fail('Request too large.', 413);
    $raw = file_get_contents('php://input', false, null, 0, $maxBytes + 1);
    if ($raw === false || strlen($raw) > $maxBytes) fail('Request too large.', 413);
    $data = json_decode($raw, true);
    if (!is_array($data)) fail('Invalid request.');
    return $data;
}

function read_json_file(string $path, $default)
{
    if (!is_file($path)) return $default;
    $raw = file_get_contents($path);
    if ($raw === false) return $default;
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $default;
}

/** Write to a temp file in the same folder, then rename over the target (atomic on the same filesystem). */
function atomic_write_json(string $path, $data)
{
    $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE | JSON_PRETTY_PRINT);
    if ($json === false) fail('Could not encode data.', 400);
    $tmp = $path . '.tmp-' . bin2hex(random_bytes(6));
    if (file_put_contents($tmp, $json, LOCK_EX) === false) fail_internal("write failed: $tmp");
    @chmod($tmp, 0644);
    if (!@rename($tmp, $path)) {
        @unlink($tmp);
        fail_internal("rename failed: $path");
    }
}

/** Serialises read-modify-write sequences between concurrent requests. */
function with_lock(string $name, callable $fn)
{
    $lock = data_dir() . DIRECTORY_SEPARATOR . '.lock-' . preg_replace('/[^a-z0-9-]/', '', $name);
    $fh = fopen($lock, 'c');
    if ($fh === false) fail_internal("lock open failed: $name");
    flock($fh, LOCK_EX);
    try {
        return $fn();
    } finally {
        flock($fh, LOCK_UN);
        fclose($fh);
    }
}

/* ---------------------------------------------------------------- misc */

function client_ip(): string
{
    // REMOTE_ADDR only - forwarded headers are trivially spoofable.
    return (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}
