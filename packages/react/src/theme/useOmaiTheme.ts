import { useContext } from 'react';
import { OmaiThemeContext, type OmaiThemeContextValue } from './context';

/** Read + control the active OMAI theme. Must be called inside `<OmaiProvider>`. */
export function useOmaiTheme(): OmaiThemeContextValue {
  const ctx = useContext(OmaiThemeContext);
  if (!ctx) {
    throw new Error('[omai] useOmaiTheme() must be used inside <OmaiProvider>.');
  }
  return ctx;
}

/** Same as useOmaiTheme but returns `null` outside a provider (for optional integration). */
export function useOptionalOmaiTheme(): OmaiThemeContextValue | null {
  return useContext(OmaiThemeContext);
}

/**
 * Data attributes to spread on the ROOT element of any portalled overlay
 * (Dialog, Drawer, Popover, DropdownMenu, Tooltip, Toast viewport, Walker) so it keeps the
 * theme of a scoped provider. Returns `{}` for document-level providers or no provider.
 */
export function useOmaiPortalAttributes(): Record<string, string> {
  const ctx = useContext(OmaiThemeContext);
  if (!ctx || ctx.target !== 'scope') return {};
  return {
    'data-omai-theme': ctx.theme,
    'data-omai-mode': ctx.mode,
    'data-omai-radius': ctx.radius,
    'data-omai-gaps': ctx.gaps,
  };
}
