<?php
/**
 * Upload allow-list: the ONLY folders the admin may write to under /uploads.
 *
 * !! KEEP IN SYNC with MEDIA_SLOTS in src/content/media.ts.
 *
 *   single - one image; an upload replaces the previous upload
 *   video  - one mp4/webm video; an upload replaces the previous upload
 *   list   - a gallery of images (add / delete / hide originals / reorder)
 *   media  - a gallery like "list" that also accepts mp4/webm videos
 *   pool   - images referenced from text records (team portraits, before/after pairs)
 */
defined('CMS_OK') || exit;

return [
    'site-logo' => 'single',
    'footer-logo' => 'single',
    'home-residential' => 'single',
    'home-commercial' => 'single',
    'home-dock' => 'single',
    'home-drone' => 'single',
    'residential-photo' => 'single',
    'residential-gallery' => 'media',
    'commercial-photo' => 'single',
    'commercial-gallery' => 'media',
    'dock-photo' => 'single',
    'dock-gallery' => 'media',
    'drone-photo' => 'single',
    'drone-gallery' => 'media',
    'team-hero' => 'single',
    'content' => 'pool',
];
