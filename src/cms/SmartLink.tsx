import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Link whose destination comes from editable content: "/team" uses the router,
 * anything else (https://..., mailto:, tel:) is a normal anchor.
 */
/** Editable URLs are limited to http(s), mailto, tel, sms and #anchors. */
export function safeHref(to: string): string {
  return /^(https?:\/\/|mailto:|tel:|sms:|#|\/(?!\/))/i.test(to) ? to : "#";
}

export function SmartLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  if (to.startsWith("/") && !to.startsWith("//")) {
    return (
      <Link to={to as "/"} className={className}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//i.test(to);
  // Only allow web, mail and phone links from editable content.
  const href = external || /^(mailto:|tel:|sms:|#)/i.test(to) ? to : "#";
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
