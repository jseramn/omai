import type { OmaiThemeId } from '@jseramn/omai-tokens';

export type DocsSectionId =
  | 'overview'
  | 'foundations'
  | 'components'
  | 'omai-os'
  | 'templates'
  | 'usage';

export type ComponentCategoryId =
  | 'primitives'
  | 'forms'
  | 'feedback'
  | 'navigation'
  | 'data'
  | 'omai';

export interface ComponentCatalogEntry {
  id: string;
  name: string;
  category: ComponentCategoryId;
  tagline: string;
  cssClass: string;
}

export const DOCS_SECTIONS: readonly {
  id: DocsSectionId;
  label: string;
  workspace: number;
  shortLabel: string;
}[] = [
  { id: 'overview', label: 'Overview', workspace: 1, shortLabel: '01 Overview' },
  { id: 'foundations', label: 'Foundations', workspace: 2, shortLabel: '02 Foundations' },
  { id: 'components', label: 'Components', workspace: 3, shortLabel: '03 Components' },
  { id: 'omai-os', label: 'OMAI Shell', workspace: 4, shortLabel: '04 OMAI Shell' },
  { id: 'templates', label: 'Templates', workspace: 5, shortLabel: '05 Templates' },
  { id: 'usage', label: 'Usage', workspace: 6, shortLabel: '06 Usage' },
];

export const COMPONENT_CATEGORIES: readonly {
  id: ComponentCategoryId;
  label: string;
  count: number;
  description: string;
}[] = [
  {
    id: 'primitives',
    label: 'Primitives',
    count: 9,
    description: 'Core atomic building blocks with sharp 0px defaults, 1px hairline borders, and tactile press scaling.',
  },
  {
    id: 'forms',
    label: 'Forms',
    count: 8,
    description: 'Accessible form controls wired to FormField context with automatic aria-describedby and invalid states.',
  },
  {
    id: 'feedback',
    label: 'Feedback & Overlays',
    count: 7,
    description: 'Mako-inspired stacked notification decks, portalled modals, drawers, roving menus, and btop block meters.',
  },
  {
    id: 'navigation',
    label: 'Navigation',
    count: 4,
    description: 'Keyboard-driven roving tablists, collapsible sidebar trees, breadcrumbs, and pagination.',
  },
  {
    id: 'data',
    label: 'Data Display',
    count: 4,
    description: 'Sortable tabular data, line-highlighted code blocks, btop telemetry cards, and copyable key-value specs.',
  },
  {
    id: 'omai',
    label: 'OMAI Shell Signature',
    count: 8,
    description: 'Signature Linux desktop primitives: Walker launcher, 26px Waybar, Hyprland TilingGrid, Ghostty Terminal, and PixelField.',
  },
];

export const COMPONENT_CATALOG: readonly ComponentCatalogEntry[] = [
  // Primitives (9)
  { id: 'comp-button', name: 'Button', category: 'primitives', tagline: 'Primary, secondary, outline, ghost & danger actions', cssClass: '.omai-button' },
  { id: 'comp-icon-button', name: 'IconButton', category: 'primitives', tagline: 'Square accessible icon-only control', cssClass: '.omai-icon-button' },
  { id: 'comp-badge', name: 'Badge', category: 'primitives', tagline: 'Uppercase mono status pill with optional live dot', cssClass: '.omai-badge' },
  { id: 'comp-kbd', name: 'Kbd', category: 'primitives', tagline: 'Keycap chord notation for hotkeys & bindings', cssClass: '.omai-kbd' },
  { id: 'comp-card', name: 'Card', category: 'primitives', tagline: '1px bordered surface container with structured parts', cssClass: '.omai-card' },
  { id: 'comp-separator', name: 'Separator', category: 'primitives', tagline: 'Hairline horizontal/vertical rule with optional mono label', cssClass: '.omai-separator' },
  { id: 'comp-avatar', name: 'Avatar', category: 'primitives', tagline: 'User identity tile with initials fallback & presence dot', cssClass: '.omai-avatar' },
  { id: 'comp-skeleton', name: 'Skeleton', category: 'primitives', tagline: 'Block, multi-line text, and stepped pixel placeholders', cssClass: '.omai-skeleton' },
  { id: 'comp-tooltip', name: 'Tooltip', category: 'primitives', tagline: 'Portalled hover/focus hint with keycap shortcut support', cssClass: '.omai-tooltip' },

  // Forms (8)
  { id: 'comp-form-field', name: 'FormField', category: 'forms', tagline: 'Context provider connecting label, description & alert errors', cssClass: '.omai-form-field' },
  { id: 'comp-input', name: 'Input', category: 'forms', tagline: 'Monospace text field with leading/trailing icon slots', cssClass: '.omai-input' },
  { id: 'comp-textarea', name: 'Textarea', category: 'forms', tagline: 'Multi-line text input with optional auto-resize', cssClass: '.omai-textarea' },
  { id: 'comp-select', name: 'Select', category: 'forms', tagline: 'Native select control with custom OMAI chevron chrome', cssClass: '.omai-select' },
  { id: 'comp-checkbox', name: 'Checkbox', category: 'forms', tagline: 'Check & indeterminate toggle with label + description', cssClass: '.omai-checkbox' },
  { id: 'comp-switch', name: 'Switch', category: 'forms', tagline: 'Binary switch button with role="switch" and hidden form input', cssClass: '.omai-switch' },
  { id: 'comp-radio-group', name: 'RadioGroup', category: 'forms', tagline: 'Roving arrow-key radio list in vertical or horizontal layout', cssClass: '.omai-radio-group' },
  { id: 'comp-slider', name: 'Slider', category: 'forms', tagline: 'Brand-filled range input with formatted live value readout', cssClass: '.omai-slider' },

  // Feedback & Overlays (7)
  { id: 'comp-alert', name: 'Alert', category: 'feedback', tagline: 'Semantic callout banner with tone icon, action & dismiss', cssClass: '.omai-alert' },
  { id: 'comp-toast', name: 'Toast', category: 'feedback', tagline: 'Mako-style stacked notification deck with numbered actions', cssClass: '.omai-toast' },
  { id: 'comp-dialog', name: 'Dialog', category: 'feedback', tagline: 'Focus-trapped modal overlay with backdrop & scroll lock', cssClass: '.omai-dialog' },
  { id: 'comp-drawer', name: 'Drawer', category: 'feedback', tagline: 'Edge-docked slide panel (left, right, top, bottom)', cssClass: '.omai-drawer' },
  { id: 'comp-popover', name: 'Popover', category: 'feedback', tagline: 'Collision-flipping anchored floating panel', cssClass: '.omai-popover' },
  { id: 'comp-dropdown-menu', name: 'DropdownMenu', category: 'feedback', tagline: 'WAI-ARIA menu with items, checkboxes, shortcuts & typeahead', cssClass: '.omai-dropdown-menu' },
  { id: 'comp-progress', name: 'Progress', category: 'feedback', tagline: 'Smooth progress bar or btop-style █▓▒░ segmented blocks', cssClass: '.omai-progress' },

  // Navigation (4)
  { id: 'comp-tabs', name: 'Tabs', category: 'navigation', tagline: 'Underline & boxed tablists with automatic or manual activation', cssClass: '.omai-tabs' },
  { id: 'comp-breadcrumb', name: 'Breadcrumb', category: 'navigation', tagline: 'Hierarchical path trail with middle truncation', cssClass: '.omai-breadcrumb' },
  { id: 'comp-sidebar-nav', name: 'SidebarNav', category: 'navigation', tagline: 'Collapsible section tree with active brand bar & rail mode', cssClass: '.omai-sidebar-nav' },
  { id: 'comp-pagination', name: 'Pagination', category: 'navigation', tagline: 'Page range navigator with boundary & sibling controls', cssClass: '.omai-pagination' },

  // Data Display (4)
  { id: 'comp-table', name: 'Table', category: 'data', tagline: 'Sortable data grid with tabular numerals & row selection', cssClass: '.omai-table' },
  { id: 'comp-code-block', name: 'CodeBlock', category: 'data', tagline: 'Deep-surface source viewer with line numbers & highlights', cssClass: '.omai-code-block' },
  { id: 'comp-stat-card', name: 'StatCard', category: 'data', tagline: 'KPI metric card with btop meter, delta & Unicode sparkline', cssClass: '.omai-stat-card' },
  { id: 'comp-key-value-list', name: 'KeyValueList', category: 'data', tagline: 'Horizontal or stacked definition list with one-click copy', cssClass: '.omai-kv-list' },

  // OMAI Shell Signature (8)
  { id: 'comp-walker', name: 'Walker', category: 'omai', tagline: 'Fuzzy-matched command palette modal with highlighted hits', cssClass: '.omai-walker' },
  { id: 'comp-waybar', name: 'Waybar', category: 'omai', tagline: '26px Linux status bar with workspaces, clock & stat meters', cssClass: '.omai-waybar' },
  { id: 'comp-tiling-grid', name: 'TilingGrid', category: 'omai', tagline: 'Hyprland dwindle/master/columns/grid container with Alt+Arrow focus', cssClass: '.omai-tiling-grid' },
  { id: 'comp-window-pane', name: 'WindowPane', category: 'omai', tagline: 'Tiled window surface with 2px brand active border & titlebar', cssClass: '.omai-window-pane' },
  { id: 'comp-terminal', name: 'Terminal', category: 'omai', tagline: 'Ghostty terminal block with 16 ANSI colors & SGR parser', cssClass: '.omai-terminal' },
  { id: 'comp-theme-switcher', name: 'ThemeSwitcher', category: 'omai', tagline: '16-theme swatch picker with mode filters & roving radios', cssClass: '.omai-theme-switcher' },
  { id: 'comp-hotkey-bar', name: 'HotkeyBar', category: 'omai', tagline: 'Inline or edge-pinned keybinding legend with live listeners', cssClass: '.omai-hotkey-bar' },
  { id: 'comp-pixel-field', name: 'PixelField', category: 'omai', tagline: 'DPR-aware interactive canvas reading --omai-field-* ramp', cssClass: '.omai-pixel-field' },
];

export const SURFACE_TOKENS: readonly { token: string; role: string }[] = [
  { token: '--omai-bg-deep', role: 'Deepest surface: odd sections, code blocks, Waybar' },
  { token: '--omai-bg', role: 'Primary page / application canvas' },
  { token: '--omai-surface', role: 'Cards, inputs, secondary buttons, panes' },
  { token: '--omai-surface-2', role: 'Hover state, inline kbd/code, active row' },
  { token: '--omai-border-subtle', role: '1px hairline section & card dividers' },
  { token: '--omai-border-strong', role: 'Interactive control & inactive pane borders' },
  { token: '--omai-text', role: 'Primary high-contrast foreground text' },
  { token: '--omai-text-secondary', role: 'Prose copy & secondary UI labels' },
  { token: '--omai-text-muted', role: 'Captions, placeholders (≥4.5:1 contrast)' },
  { token: '--omai-brand', role: 'Primary accent: active pane border, focus ring, CTA' },
  { token: '--omai-brand-soft', role: '12% brand tint for selected nav & soft badges' },
  { token: '--omai-brand-ink', role: 'High-contrast ink rendered on --omai-brand' },
  { token: '--omai-selection', role: '::selection & active Walker item highlight' },
];

export const STATUS_TOKENS: readonly { token: string; softToken: string; label: string }[] = [
  { token: '--omai-success', softToken: '--omai-success-soft', label: 'Success (ANSI 2)' },
  { token: '--omai-warning', softToken: '--omai-warning-soft', label: 'Warning (ANSI 3)' },
  { token: '--omai-danger', softToken: '--omai-danger-soft', label: 'Danger (ANSI 1)' },
  { token: '--omai-info', softToken: '--omai-info-soft', label: 'Info (ANSI 4)' },
];

export const FIELD_TOKENS: readonly { token: string; label: string }[] = [
  { token: '--omai-field-bg', label: 'Field Base' },
  { token: '--omai-field-dim', label: 'Dim Cell' },
  { token: '--omai-field-mid', label: 'Mid Cell' },
  { token: '--omai-field-lit', label: 'Lit Brand' },
  { token: '--omai-field-hover', label: 'Pointer Hover' },
  { token: '--omai-field-crest', label: 'Wave Crest' },
];

export const ANSI_LABELS: readonly string[] = [
  '0 Black',
  '1 Red',
  '2 Green',
  '3 Yellow',
  '4 Blue',
  '5 Magenta',
  '6 Cyan',
  '7 White',
  '8 BrBlack',
  '9 BrRed',
  '10 BrGreen',
  '11 BrYellow',
  '12 BrBlue',
  '13 BrMagenta',
  '14 BrCyan',
  '15 BrWhite',
];

export const DEFAULT_SCOPED_THEMES: readonly [OmaiThemeId, OmaiThemeId, OmaiThemeId] = [
  'tokyo-night',
  'catppuccin-latte',
  'matte-black',
];
