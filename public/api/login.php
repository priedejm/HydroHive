<?php
/** POST {password} - starts an admin session. 5 wrong passwords from one IP = 15 minute lockout. */
require __DIR__ . '/_lib.php';
require __DIR__ . '/_auth.php';

require_method('POST');
require_cms_header();

const MAX_FAILS = 5;
const LOCK_SECONDS = 900;

$body = read_json_body(4096);
$password = $body['password'] ?? '';
if (!is_string($password) || $password === '' || strlen($password) > 200) fail('Enter the password.');

$hash = (string)(cms_config()['password_hash'] ?? '');
if ($hash === '') fail_internal('cms-config/' . cms_config_name() . ' missing or has no password_hash', 'The admin password has not been set up on the server yet.');

$attemptsFile = data_dir() . DIRECTORY_SEPARATOR . 'login-attempts.json';
$key = hash('sha256', client_ip());
$now = time();

$attempts = read_json_file($attemptsFile, []);
$rec = $attempts[$key] ?? [];
if ((int)($rec['until'] ?? 0) > $now) {
    $mins = (int)ceil(((int)$rec['until'] - $now) / 60);
    fail("Too many attempts. Try again in $mins minute" . ($mins === 1 ? '' : 's') . '.', 429);
}

if (!cms_verify_password($password, $hash)) {
    usleep(400000);
    with_lock('login', function () use ($attemptsFile, $key, $now) {
        $all = read_json_file($attemptsFile, []);
        foreach ($all as $k => $r) {
            // Forget stale records so the file can't grow forever.
            if ((int)($r['until'] ?? 0) < $now && (int)($r['last'] ?? 0) < $now - 86400) unset($all[$k]);
        }
        $r = $all[$key] ?? ['fails' => 0, 'until' => 0];
        $r['fails'] = (int)($r['fails'] ?? 0) + 1;
        $r['last'] = $now;
        if ($r['fails'] >= MAX_FAILS) {
            $r['fails'] = 0;
            $r['until'] = $now + LOCK_SECONDS;
        }
        $all[$key] = $r;
        atomic_write_json($attemptsFile, $all);
    });
    fail('Wrong password.', 401);
}

with_lock('login', function () use ($attemptsFile, $key) {
    $all = read_json_file($attemptsFile, []);
    if (isset($all[$key])) {
        unset($all[$key]);
        atomic_write_json($attemptsFile, $all ?: new stdClass());
    }
});

cms_session_start();
session_regenerate_id(true);
$_SESSION['cms'] = true;
$_SESSION['seen'] = time();
ok();
