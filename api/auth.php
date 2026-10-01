<?php

require_once __DIR__ . '/bootstrap.php';

const HH_MAX_LOGIN_ATTEMPTS = 5;
const HH_LOGIN_WINDOW_MINUTES = 15;

function hh_client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function hh_is_authenticated(): bool
{
    return !empty($_SESSION['admin']);
}

function hh_require_admin(): void
{
    if (!hh_is_authenticated()) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }
    hh_require_csrf();
}

function hh_issue_csrf_token(): string
{
    $token = bin2hex(random_bytes(32));
    $_SESSION['csrf'] = $token;
    return $token;
}

// Unlike hh_issue_csrf_token(), this does NOT rotate an existing token - it
// only mints one if the session doesn't have one yet. me.php calls this (not
// hh_issue_csrf_token) so that polling /api/admin/me.php on every admin route
// navigation or window-focus refetch doesn't silently invalidate a token the
// client already has in memory, which could otherwise race a save request
// that was built with the token from just before the poll landed.
function hh_ensure_csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        return hh_issue_csrf_token();
    }
    return $_SESSION['csrf'];
}

function hh_require_csrf(): void
{
    // Only mutating requests carry a body/side effect worth protecting.
    if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
        return;
    }
    $header = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $header)) {
        http_response_code(403);
        echo json_encode(['error' => 'Invalid CSRF token']);
        exit;
    }
}

// Keyed by username (not just IP): throttling only by IP lets an attacker
// spread guesses against the same account across a handful of proxy IPs and
// never trip the per-IP limit. Login attempts against a nonexistent username
// still count here (using the raw submitted value) so probing random
// usernames doesn't dodge the limit either.
function hh_recent_failed_attempts(string $username): int
{
    $stmt = hh_db()->prepare(
        'SELECT COUNT(*) FROM login_attempts
         WHERE username = :username AND success = 0
           AND attempted_at > (NOW() - INTERVAL :minutes MINUTE)'
    );
    $stmt->bindValue(':username', $username);
    $stmt->bindValue(':minutes', HH_LOGIN_WINDOW_MINUTES, PDO::PARAM_INT);
    $stmt->execute();
    return (int) $stmt->fetchColumn();
}

function hh_record_login_attempt(string $ip, string $username, bool $success): void
{
    $stmt = hh_db()->prepare(
        'INSERT INTO login_attempts (ip_address, username, success) VALUES (:ip, :username, :success)'
    );
    $stmt->execute(['ip' => $ip, 'username' => $username, 'success' => $success ? 1 : 0]);
}

// Serializes the check-count -> verify-password -> record-attempt sequence
// per username using a MySQL session-scoped named lock, so concurrent
// requests can't all read the same stale attempt count before any of them
// record a failure (a classic check-then-act race that would otherwise let
// N simultaneous requests each slip through the rate limit). The lock is
// released automatically when this request's DB connection closes (i.e. by
// the time the script exits), so callers can freely `exit` while holding it.
function hh_acquire_login_lock(string $username): void
{
    $lockName = 'hh_login_' . substr(md5($username), 0, 40);
    $stmt = hh_db()->prepare('SELECT GET_LOCK(:name, 5)');
    $stmt->execute(['name' => $lockName]);
    if ((int) $stmt->fetchColumn() !== 1) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many login attempts. Try again later.']);
        exit;
    }
}
