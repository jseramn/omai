import { DEFAULT_THEME_ID, themeMeta, type OmaiThemeId } from '@jseramn/omai-tokens';

/**
 * Inline `<script>` body that restores the persisted theme BEFORE first paint (SSR / static HTML).
 * Put it in <head>: `<script dangerouslySetInnerHTML={{ __html: getOmaiInitScript() }} />`.
 */
export function getOmaiInitScript(options: { storageKey?: string; defaultTheme?: OmaiThemeId } = {}): string {
  const key = JSON.stringify(options.storageKey ?? 'omai-theme');
  const fallback = JSON.stringify(options.defaultTheme ?? DEFAULT_THEME_ID);
  const light = JSON.stringify(themeMeta.filter((t) => t.mode === 'light').map((t) => t.id));
  const ids = JSON.stringify(themeMeta.map((t) => t.id));
  return `(function(){try{var d=document.documentElement,k=${key},s=localStorage;var t=s.getItem(k);if(${ids}.indexOf(t)<0)t=${fallback};d.setAttribute('data-omai-theme',t);d.setAttribute('data-omai-mode',${light}.indexOf(t)>-1?'light':'dark');var r=s.getItem(k+':radius');if(r==='sharp'||r==='soft')d.setAttribute('data-omai-radius',r);var g=s.getItem(k+':gaps');if(g==='default'||g==='none'||g==='wide')d.setAttribute('data-omai-gaps',g);}catch(e){}})();`;
}
