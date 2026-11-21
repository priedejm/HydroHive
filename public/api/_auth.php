<?php
/**
 * Session auth for the admin. Every write endpoint calls require_admin().
 *
 * - Session cookie: httponly, SameSite=Strict, secure on HTTPS.
 * - Every admin request must also carry the header "X-CMS: 1". Browsers can't
 *   add custom headers to cross-site form posts, so this blocks CSRF even on
 *   old browsers that ignore SameSite.
 * - Sessions expire after 8 hours of inactivity.
 */
defined('CMS_OK') || exit;

const CMS_IDLE_SECONDS = 8 * 3600;

function cms_session_start()
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ((int)($_SERVER['SERVER_PORT'] ?? 0) === 443);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name('cms_sess');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function require_cms_header()
{
    if (($_SERVER['HTTP_X_CMS'] ?? '') !== '1') fail('Forbidden', 403);
}

function is_admin(): bool
{
    cms_session_start();
    if (empty($_SESSION['cms'])) return false;
    if (time() - (int)($_SESSION['seen'] ?? 0) > CMS_IDLE_SECONDS) {
        $_SESSION = [];
        session_destroy();
        return false;
    }
    $_SESSION['seen'] = time();
    return true;
}

/** Gate for every admin endpoint. Releases the session lock so long uploads don't block other requests. */
function require_admin()
{
    require_cms_header();
    if (!is_admin()) fail('Please sign in again.', 401);
    session_write_close();
}

/**
 * Supports two hash formats in cms-config.php:
 *   - PHP password_hash() output ($2y$..., $argon2id$...)
 *   - "pbkdf2$sha256$<iterations>$<salt b64>$<hash b64>" (made by tools/make-password-hash.mjs, no PHP needed)
 */
function cms_verify_password(string $password, string $hash): bool
{
    if (strpos($hash, 'pbkdf2$') === 0) {
        $p = explode('$', $hash);
        if (count($p) !== 5 || $p[1] !== 'sha256') return false;
        $iter = (int)$p[2];
        $salt = base64_decode($p[3], true);
        $want = base64_decode($p[4], true);
        if ($iter < 100000 || $salt === false || $want === false) return false;
        $got = hash_pbkdf2('sha256', $password, $salt, $iter, strlen($want), true);
        return hash_equals($want, $got);
    }
    return password_verify($password, $hash);
}
