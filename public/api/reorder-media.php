<?php
/** POST {slot, order: [ids], hidden: [static ids]} - gallery order + which bundled originals are hidden. */
require __DIR__ . '/_lib.php';
require __DIR__ . '/_auth.php';

require_method('POST');
require_admin();

$body = read_json_body();
[$slot, $type] = safe_slot($body['slot'] ?? '');
if ($type !== 'list' && $type !== 'media') fail('This area has no order.');

function clean_ids($list, string $pattern): array
{
    if (!is_array($list) || count($list) > 500) fail('Invalid order.');
    $out = [];
    foreach ($list as $id) {
        if (!is_string($id) || !preg_match($pattern, $id)) fail('Invalid order.');
        $out[$id] = true;
    }
    return array_keys($out);
}

$order = clean_ids($body['order'] ?? [], '/^(uploaded|static)_[A-Za-z0-9._-]{1,200}$/');
$hidden = clean_ids($body['hidden'] ?? [], '/^static_[A-Za-z0-9._-]{1,200}$/');

with_lock('order-' . $slot, function () use ($slot, $order, $hidden) {
    atomic_write_json(order_file($slot), ['order' => $order, 'hidden' => $hidden]);
});
ok();
