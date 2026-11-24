import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
  /** Mount target. Defaults to the nearest `[data-omai-portal-root]`, else `document.body`. */
  container?: Element | null;
}

/**
 * SSR-safe portal for overlays (Dialog, Drawer, Popover, DropdownMenu, Tooltip, Toast, Walker).
 * Renders nothing on the server / first render, then portals on mount.
 * NOTE: portalled content leaves any scoped `[data-omai-theme]` container; overlays rendered
 * by components should copy the theme attributes via `useOmaiPortalAttributes()` (theme/).
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === 'undefined') return null;
  const target = container ?? document.querySelector('[data-omai-portal-root]') ?? document.body;
  return createPortal(children, target);
}
