#!/usr/bin/env node
/**
 * Creates the cms-config.php file that holds the admin password hash.
 *
 *   node tools/make-password-hash.mjs "the new password"
 *
 * Save the printed text OUTSIDE the web root as
 *   <folder above the web root>/cms-config/<web root folder name>.php
 * e.g. site in /home/user/example.com  ->  /home/user/cms-config/example.com.php
 *      site in /home/user/public_html  ->  /home/user/cms-config/public_html.php
 * Uses PBKDF2-SHA256 so no local PHP install is needed; the server verifies
 * it with hash_pbkdf2() (see public/api/_auth.php).
 */
import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Usage: node tools/make-password-hash.mjs "password (10+ characters)"');
  process.exit(1);
}

const iterations = 210000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
const value = `pbkdf2$sha256$${iterations}$${salt.toString("base64")}$${hash.toString("base64")}`;

console.log(`<?php
// Site admin password hash. Lives OUTSIDE the web root. Regenerate with tools/make-password-hash.mjs
return ['password_hash' => '${value}'];
`);
