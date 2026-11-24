# OMAI (Omarchy Based Agent Interface) — Architecture

> Single source of truth for everyone building in this repo. If code and this document disagree, this document wins until it is updated (ask **@architect** on the board).

The look comes from **omarchy.org** (Geist headings, JetBrains Mono body, 0px corners, 1px hairline borders, brand-green Tokyo Night). The behaviour comes from **Omarchy OS** (Hyprland tiling with gaps and an accent border on the active window, a 26px Waybar, the Walker launcher, a Mako notification stack, Ghostty terminals, 16 ANSI colors from each theme's `colors.toml`).

---

## 1. Principles

1. **Tokens first.** Every color, font, radius, gap and duration is an `--omai-*` CSS custom property. Component CSS never hard-codes a color (only `transparent` and `currentColor` are allowed).
2. **Works with or without Tailwind.** `@jseramn/omai` ships plain CSS classes (`omai-*`) in `@jseramn/omai/styles.css`. Tailwind v4 is an **optional** layer on top, for consumer overrides and app layout. Components **must not** rely on Tailwind utility classes internally.
3. **Sharp by default.** The default is `data-omai-radius="sharp"`, which sets every radius to `0px`, as on omarchy.org. `soft` turns on Hyprland-style 4/6/8px rounding.
4. **Flat elevation.** Surfaces are layered and separated by 1px borders or a 1px luminous ring (`--omai-elevation`). No big drop shadows, except a restrained `--omai-elevation-overlay` for floating layers.
5. **Keyboard-first.** Every interactive component can be fully operated from the keyboard, uses correct ARIA, and shows a visible `:focus-visible` ring.
6. **Theme by attribute.** You switch a theme by setting one attribute. No JS is needed at runtime to theme CSS.

---

## 2. Monorepo layout

npm workspaces (Node ≥ 22.12, verified on **Node 26.13 / npm 11.20 / Windows**). TypeScript **7.0** (native `tsc`), Vite **8**, Vitest **5**, React **19.3**, Tailwind **4.3**.

```
antigravity/
├── package.json              # workspaces ["packages/*","apps/*"], root scripts
├── tsconfig.base.json        # shared strict TS config (Bundler resolution, customConditions ["source"])
├── scripts/clean.mjs         # cross-platform rm -rf
├── ARCHITECTURE.md
├── packages/
│   ├── tokens/               # @jseramn/omai-tokens
│   │   ├── css/tokens.css    # STATIC: typography, geometry, Hyprland, motion, z-index, radius & gap modes
│   │   ├── css/base.css      # STATIC, optional: element defaults (mono body, Geist headings, selection, focus)
│   │   ├── css/tailwind.css  # STATIC: Tailwind v4 bridge (@theme inline -> --omai-*)
│   │   ├── src/types.ts      # OmaiTheme schema (contract)
│   │   ├── src/meta.ts       # 16 theme ids / names / modes / swatches
│   │   ├── src/css.ts        # theme -> CSS generator (build-time + runtime)
│   │   ├── src/themes/*.ts   # one file per theme (source of truth for colors)
│   │   ├── scripts/build-css.mjs  # writes dist/themes.css
│   │   └── dist/             # index.js, *.d.ts, themes.css (generated)
│   └── react/                # @jseramn/omai
│       ├── src/index.ts      # public barrel (re-exports group barrels; do not edit per component)
│       ├── src/types.ts      # shared prop vocabulary (Size, Tone, Side, Align, KeyCombo, Orientation)
│       ├── src/utils/        # cn, focus trap, roving index, hooks, Portal
│       ├── src/theme/        # OmaiProvider, useOmaiTheme, init script
│       ├── src/primitives/   # Button IconButton Badge Kbd Card Separator Avatar Skeleton Tooltip
│       ├── src/forms/        # Input Textarea Select Checkbox Switch RadioGroup Slider FormField
│       ├── src/feedback/     # Alert Toast(ToastProvider,useToast) Dialog Drawer Popover DropdownMenu Progress
│       ├── src/navigation/   # Tabs Breadcrumb SidebarNav Pagination
│       ├── src/data/         # Table CodeBlock StatCard KeyValueList
│       ├── src/omai/      # Walker Waybar TilingGrid WindowPane Terminal ThemeSwitcher HotkeyBar PixelField
│       ├── src/styles/       # index.css (entry, imports each group css), theme.css
│       ├── src/test/setup.ts # jest-dom + jsdom shims
│       ├── vite.config.ts    # library build (ESM, preserveModules, "use client" banner)
│       ├── vitest.config.ts  # jsdom tests
│       └── scripts/build-css.mjs  # inlines src/styles/index.css -> dist/styles.css
└── apps/
    └── docs/                 # @jseramn/omai-docs: React 19 + Vite 8 + Tailwind v4 documentation site
        ├── index.html        # no-flash theme restore script
        ├── vite.config.ts    # react() + tailwindcss(), resolve.conditions ["source", ...]
        └── src/main.tsx, App.tsx, index.css
```

### 2.1 Ownership (parallel work without conflicts)

| Path | Owner | Notes |
|---|---|---|
| root configs, `tsconfig.base.json`, `ARCHITECTURE.md`, `packages/*/package.json`, `vite/vitest` configs | **architect** | Ask on the board before changing these. Need a new dependency? Ask. |
| `packages/tokens/css/*`, `src/types.ts`, `src/meta.ts`, `src/css.ts` | **architect** | Schema contract. |
| `packages/tokens/src/themes/*.ts` (15 remaining palettes + registry) | **tokens owner** (assigned by coordinator) | Follow `tokyo-night.ts`. |
| `packages/react/src/{index.ts,types.ts,utils/*,theme/*,styles/*}` | **architect** | Exception: core-ui-eng may add `utils/position.ts` and append **one** export line to `utils/index.ts`. |
| `packages/react/src/{primitives,forms,feedback,navigation,data}/**` | **core-ui-eng** | Includes each group's `index.ts` + `<group>.css`. |
| `packages/react/src/omai/**` | **os-ui-eng** | Includes `omai/index.ts` + `omai.css`. |
| `apps/docs/src/**` | **docs owner** (assigned by coordinator) | |

**Cross-group dependency rule:** `omai/*` may import from `primitives`, `forms`, `feedback`, `utils` and `theme`, always through the **group barrel** (`import { Kbd } from '../primitives'`). Core groups must **never** import from `omai/`. Until a core component lands, os-ui-eng codes against the contract in §7 (the signatures are frozen).

---

## 3. Token schema (`--omai-*`)

### 3.1 Theme activation contract

```html
<html data-omai-theme="tokyo-night" data-omai-mode="dark" data-omai-radius="sharp" data-omai-gaps="default">
```

| Attribute | Values | Effect | Set by |
|---|---|---|---|
| `data-omai-theme` | one of the 16 ids (§4) | Defines every color token and `color-scheme: dark\|light`. | user / `OmaiProvider` |
| `data-omai-mode` | `dark` \| `light` | Informational hook for CSS (`dark:` / `omai-light:` Tailwind variants). It must match the theme. | `OmaiProvider` / init script |
| `data-omai-radius` | `sharp` (default) \| `soft` | Radius scale (§3.8). | user / provider |
| `data-omai-gaps` | `default` \| `none` \| `wide` | Hyprland gaps (§3.8). | user / provider |

- Put the attributes on `<html>` for page-wide theming, **or on any element** to theme only that subtree (scoped themes nest correctly). With **no attribute**, `:root` falls back to **tokyo-night** and `sharp`.
- `color-scheme` is emitted inside each theme block, so native controls and scrollbars follow the theme.
- **Cascade rule:** any token whose value refers to another color token (e.g. `color-mix(… var(--omai-brand) …)`) is emitted **inside every theme block** and is never defined on a bare `:root`. That way scoped containers compute it again. Follow the same rule if you add derived tokens.

### 3.2 Surfaces, text, brand (per theme)

| Token | Role | tokyo-night |
|---|---|---|
| `--omai-bg-deep` | Deepest surface: odd sections, `<pre>`, Waybar opaque, code blocks | `#13141c` |
| `--omai-bg` | Page / app canvas | `#1a1b26` |
| `--omai-surface` | Cards, secondary buttons, inputs, table headers, panes | `#1f2230` |
| `--omai-surface-2` | Hover surfaces, inline `code` / `kbd`, active rows | `#24283b` |
| `--omai-border-subtle` | Dividers, card outlines | `#24283b` |
| `--omai-border-strong` | Interactive control borders, inactive window border | `#414868` |
| `--omai-text` | Primary text | `#c0caf5` |
| `--omai-text-secondary` | Prose, secondary labels | `#a9b1d6` |
| `--omai-text-muted` | Captions, placeholders, disabled | `#8b93b8` |
| `--omai-brand` | Primary accent: primary button, focus ring, active pane border, lit pixels | `#9ece6a` |
| `--omai-brand-soft` | Brand tint backgrounds (selected nav item, soft badge) | `#9ece6a1f` |
| `--omai-brand-hover` | Primary hover (dark: brand + 14% white; light: brand + 10% black) | derived |
| `--omai-brand-ink` | Text and icons **on** `--omai-brand` | `#0c0e10` |
| `--omai-selection` | `::selection`, selected list / Walker row | `#292e42` |
| `--omai-focus-ring` | Focus outline color (defaults to `var(--omai-brand)`) | derived |
| `--omai-cursor` | Terminal / caret color | `#c0caf5` |
| `--omai-elevation` | Resting ring. Dark: `0 0 0 1px oklch(100% 0 0/.07)`. Light: 3-layer soft shadow | derived by mode |
| `--omai-elevation-hover` | Hover ring. Dark: `0 0 0 1px oklch(100% 0 0/.13)` | derived by mode |
| `--omai-elevation-overlay` | Dialog / popover / Walker / toast | derived by mode |
| `--omai-backdrop` | Modal scrim | derived by mode |
| `--omai-scroll-thumb` | Scrollbar thumb | `#ffffff24` |
| `--omai-img-outline` | 1px inset outline on media | `#ffffff1a` |

### 3.3 Semantic status (per theme)

`--omai-success`, `--omai-warning`, `--omai-danger`, `--omai-info`, each with a `-soft` variant (a 14% `color-mix` toward transparent by default). Defaults come from ANSI green (2), yellow (3), red (1) and blue (4).

### 3.4 Hero pixel-field ramp (per theme)

`--omai-field-bg`, `--omai-field-dim`, `--omai-field-mid`, `--omai-field-lit`, `--omai-field-hover`, `--omai-field-crest`. tokyo-night uses the exact omarchy.org values (`#0e0e14 #39482e #678549 #9ece6a #bbdd97 #daecc6`). Other themes get them derived from `--omai-brand` unless overridden. In dark themes the ramp moves toward white; in light themes it moves toward black.

### 3.5 ANSI 16 (per theme)

`--omai-ansi-0` … `--omai-ansi-15` correspond to `color0` … `color15` in `colors.toml`. Use them for terminal output, btop meters, lazygit-style status and syntax accents. Never use them for surfaces.

### 3.6 Typography (`tokens.css`, theme-independent)

| Token | Value |
|---|---|
| `--omai-font-sans` | `"Geist Variable", "Geist", ui-sans-serif, system-ui, sans-serif` (headings h1–h6, `th`, display) |
| `--omai-font-mono` | `"JetBrains Mono Variable", "JetBrains Mono", "JetBrainsMono Nerd Font", ui-monospace, …` (**body**, UI controls, buttons, nav, code) |
| `--omai-text-2xs/xs/sm/base/lg/xl/2xl/3xl/4xl/6xl` | 11/12/14/16/18/20/24/30/36/60px |
| `--omai-text-prose` | 15px (prose body, with `--omai-leading-prose: 1.65`) |
| `--omai-leading-none/tight/snug/normal/relaxed/prose` | 1 / 1.25 / 1.375 / 1.5 / 1.625 / 1.65 |
| `--omai-tracking-tight/normal/wide/wider/widest` | -0.025em / 0 / 0.025em / 0.05em / 0.1em |
| `--omai-weight-regular/medium/semibold/bold` | 400 / 500 / 600 / 700 |

Conventions: the hero H1 is sans, 500 weight, tracking-tight, 30px. Section H2 is sans, 600, tracking-tight. Badges and pills are mono, 11px, 700, uppercase, `--omai-tracking-wider`. Default UI text is mono 14px.

### 3.7 Spacing, layout, motion, z-index (`tokens.css`)

- Spacing uses a 4px base: `--omai-space-{1,2,3,4,5,6,8,10,12,16}`.
- Layout: `--omai-topbar-height: 3.5rem`, `--omai-waybar-height: 26px`, `--omai-container-max: 72rem`, `--omai-measure: 48rem`.
- Control heights: `--omai-control-h-sm/md/lg` = 32/40/48px.
- Motion: `--omai-duration-fast/—/slow` = 100/150/200ms, `--omai-ease-out`, `--omai-ease-in-out`, `--omai-press-scale: 0.96`. Under `prefers-reduced-motion` all durations are 0 and press-scale is 1.
- Z-index: `--omai-z-sticky 100 · dropdown 1000 · overlay 1100 · modal 1200 · popover 1300 · toast 1400 · tooltip 1500`.

### 3.8 Geometry & Hyprland (`tokens.css`)

| Token | `sharp` (default) | `soft` |
|---|---|---|
| `--omai-radius-xs` | 0 | 2px |
| `--omai-radius-sm` | 0 | 4px |
| `--omai-radius-md` | 0 | 6px |
| `--omai-radius-lg` | 0 | 8px (Hyprland `rounding = 8`) |
| `--omai-radius-xl` | 0 | 12px |
| `--omai-radius-full` | 0 | 9999px |

| Token | Default | `gaps="none"` | `gaps="wide"` |
|---|---|---|---|
| `--omai-gap-in` | 5px (`gaps_in`) | 0 | 10px |
| `--omai-gap-out` | 10px (`gaps_out`) | 0 | 20px |

Also defined: `--omai-border-width: 1px`, `--omai-border-active-width: 2px` (border on the active pane or focused window), `--omai-focus-ring-width: 2px`, `--omai-focus-ring-offset: 2px`, `--omai-inactive-opacity: 0.96`.

Component size rule: small controls (buttons, inputs, badges) use `--omai-radius-sm`; cards, panes and menus use `--omai-radius-md`; dialogs, Walker and toasts use `--omai-radius-lg`; avatars and switch thumbs use `--omai-radius-full`.

---

## 4. Themes (16 official)

| id | Name | Mode | | id | Name | Mode |
|---|---|---|---|---|---|---|
| `tokyo-night` ★ default | Tokyo Night | dark | | `lumon` | Lumon | dark |
| `catppuccin` | Catppuccin | dark | | `matte-black` | Matte Black | dark |
| `catppuccin-latte` | Catppuccin Latte | **light** | | `nord` | Nord | dark |
| `ethereal` | Ethereal | dark | | `osaka-jade` | Osaka Jade | dark |
| `everforest` | Everforest | dark | | `ristretto` | Ristretto | dark |
| `flexoki-light` | Flexoki Light | **light** | | `rose-pine` | Rosé Pine | dark |
| `gruvbox` | Gruvbox | dark | | `rose-pine-dawn` | Rosé Pine Dawn | **light** |
| `hackerman` | Hackerman | dark | | `kanagawa` | Kanagawa | dark |

> [!NOTE]
> The requested list adds up to **13 dark + 3 light** (not 12 + 4). On omarchy.org the slug `rose-pine` currently points to the Dawn (light) palette. In this system `rose-pine` is the **dark** Rosé Pine and `rose-pine-dawn` is the light one. The order, names, modes and picker swatches are fixed in `packages/tokens/src/meta.ts`.

### 4.1 Authoring a theme (`packages/tokens/src/themes/<id>.ts`)

- Export `const <camelId>: OmaiTheme`, append it to `themes` in `themes/index.ts`, and use **`.js` suffixes** on relative imports (the package builds with NodeNext).
- Colors are hex (`#rrggbb` or `#rrggbbaa`) and are validated by `themes.test.ts`. When all 16 exist, change the `it.todo` completeness test into a real `it`.
- Take values in this order of priority. **(1)** The omarchy.org table for `bg`, `surface`, `text`, `brand`; these must equal the swatch in `meta.ts`. **(2)** Omarchy `colors.toml`: `bgDeep ← dark_background`, `surface2 ← lighter_background`, `selection ← selection`, `borderStrong ← muted`/`color8`, `textSecondary ← color7`, status ← `color1/2/3/4`, `ansi ← color0..15`. **(3)** Derive whatever is left. `borderSubtle` is usually `surface2`. `textMuted` must keep ≥ 4.5:1 contrast on `bg`. `brandInk` is near-black in dark themes (unless the brand color is dark) and the bg or white in light themes; check ≥ 4.5:1 on `brand`.
- `ethereal` and `hackerman` have no `colors.toml` in the research. Build them around the omarchy.org anchors in `meta.ts`.
- Only set `overrides` (brandSoft, field, elevation…) when the derived value looks wrong.

---

## 5. Styling architecture (Tailwind **or** plain CSS)

### 5.1 What ships

| Import | Contents | Required? |
|---|---|---|
| `@jseramn/omai-tokens/tokens.css` | Non-color tokens, radius and gap modes | **yes** |
| `@jseramn/omai-tokens/themes.css` | All 16 theme blocks (generated) | **yes** |
| `@jseramn/omai-tokens/base.css` | Element defaults (mono body, Geist headings, selection, focus, scrollbar) | optional |
| `@jseramn/omai/styles.css` | All component CSS (`omai-*` classes) | **yes** when using `@jseramn/omai` |
| `@jseramn/omai-tokens/tailwind.css` | Tailwind v4 bridge, which provides `bg-omai-surface`, `text-omai-text-muted`, `border-omai-border-strong`, `rounded-omai-md`, `shadow-omai`, `font-omai-mono`, `p-omai-gap-out`, `max-w-omai`, and re-points `font-sans`/`font-mono`/`rounded-*` at Omarchy tokens. Adds `dark:`, `omai-dark:` and `omai-light:` variants keyed on `data-omai-mode` | only with Tailwind |
| `@jseramn/omai-tokens` (JS) | `themeIds`, `themeMeta`, `themes`, `themeToCssVars()`, `buildThemesCss()`, types | optional |

Fonts are **not** bundled. Consumers install `@fontsource-variable/geist` and `@fontsource-variable/jetbrains-mono`, or self-host them.

### 5.2 Consumer setup

**Plain CSS (no Tailwind):**
```ts
import '@fontsource-variable/geist';
import '@fontsource-variable/jetbrains-mono';
import '@jseramn/omai-tokens/tokens.css';
import '@jseramn/omai-tokens/themes.css';
import '@jseramn/omai-tokens/base.css';      // optional
import '@jseramn/omai/styles.css';
```
To override, write any unlayered CSS (`.my-cta.omai-button { … }`) or redefine tokens (`:root { --omai-brand: hotpink }`).

**Tailwind v4:** the imports above, plus in your main CSS:
```css
@import "tailwindcss";
@import "@jseramn/omai-tokens/tailwind.css";
```
To override: `<Button className="w-full px-8 bg-omai-ansi-5">`. Utilities beat component CSS because of the layer order (§5.3).

### 5.3 CSS rules for `@jseramn/omai` (MANDATORY)

1. **Layers.** Every component CSS file wraps **all** rules in `@layer components { … }`. `styles/index.css` declares `@layer theme, base, components, utilities;`, which is the same order Tailwind v4 uses. Tokens live in `@layer theme` and base in `@layer base`. As a result, Tailwind utilities and any unlayered consumer CSS always override component styles, with no `!important`.
2. **Naming.** The root class is `omai-<component>` (kebab-case, e.g. `omai-icon-button`, `omai-dropdown-menu`). Parts use `omai-<component>__<part>` (e.g. `omai-dialog__title`). Variants and state go in **data attributes**, not modifier classes: `data-variant`, `data-size`, `data-tone`, `data-state="open|closed|checked|unchecked|on|off|active|inactive"`, `data-disabled`, `data-invalid`, `data-orientation`, `data-side`. The docs and tests rely on these names.
3. **Specificity.** One class, optionally plus attribute or pseudo selectors. No ids, no `!important`, nesting at most two levels deep, no element-type selectors at the root.
4. **Values.** Colors are `var(--omai-*)` only. Radius uses `var(--omai-radius-*)`, borders `var(--omai-border-width) solid var(--omai-border-*)`, fonts `var(--omai-font-*)`, motion `var(--omai-duration*) var(--omai-ease-out)`. Spacing may use `rem`/`px` literals on the 4px grid.
5. **Focus.** `:focus-visible { outline: var(--omai-focus-ring-width) solid var(--omai-focus-ring); outline-offset: var(--omai-focus-ring-offset); }`. Text inputs instead get `border-color: var(--omai-brand); box-shadow: 0 0 0 1px var(--omai-brand)` on `:focus-visible` / `:focus`.
6. **Press.** Pressable controls get `transition: transform var(--omai-duration) var(--omai-ease-out), background-color …; &:active { transform: scale(var(--omai-press-scale)) }`.
7. **Sizes.** `sm` / `md` / `lg` correspond to height `--omai-control-h-*` (32/40/48), horizontal padding 12/20/24px, and font `--omai-text-xs/sm/base`.
8. **Files.** CSS is per component (`Button.css`) or per group. The group file (`primitives/primitives.css`, etc.) `@import`s its component files with **relative** paths, and `scripts/build-css.mjs` inlines them. Never import CSS from TS/TSX.
9. **Overlays** (Dialog, Drawer, Popover, DropdownMenu, Tooltip, Toast viewport, Walker) render through `<Portal>` and spread `useOmaiPortalAttributes()` on their root, so a scoped theme carries over into the portal.

---

## 6. Component conventions (MANDATORY)

- **File layout:** `src/<group>/<Name>.tsx`, `src/<group>/<Name>.test.tsx`, `src/<group>/<Name>.css`. Export from `src/<group>/index.ts` as `export { Name, type NameProps } from './Name';` (and any sub-parts or hooks).
- **Named exports only.** No default exports. Each props interface is exported as `<Name>Props`.
- **React 19 refs:** `ref` is a normal prop. Use `ComponentPropsWithRef<'el'>` and destructure `{ ref, className, ...rest }`. **Do not use `forwardRef`.** Pass `ref` to the root DOM element, or to the native control for form inputs (see below).
- **className / style** always go on the **root** element, merged as `cn('omai-x', className)` with the component class first. For form controls (Input, Textarea, Select, Slider, Checkbox, Switch) every **other** native prop (`name`, `value`, `onChange`, `disabled`, `aria-*`, `ref`, …) goes to the native control.
- **Rest props** (`...rest`) are spread on the root, or on the native control for form components.
- **Controlled / uncontrolled:** each piece of state uses the triple `value`/`defaultValue`/`onValueChange`, `open`/`defaultOpen`/`onOpenChange`, `checked`/`defaultChecked`/`onCheckedChange`, or `page`/`defaultPage`/`onPageChange`. Implement it with `useControllableState`.
- **Vocabulary** from `src/types.ts`: `size: Size` (`'sm'|'md'|'lg'`, default `'md'`), `tone: Tone` (`'neutral'|'brand'|'success'|'warning'|'danger'|'info'`), `side: Side`, `align: Align`, `orientation: Orientation`, `shortcut/keys: KeyCombo` (e.g. `['Ctrl','K']`).
- **Icons:** `lucide-react` only, at `size={16}` (sm 14, lg 18) with `strokeWidth={1.75}` and `aria-hidden`.
- **SSR-safe:** no `window` or `document` access during render. Use effects. The library build adds a `"use client"` banner automatically.
- **Accessibility:** use the correct roles, label every icon-only control, connect `aria-describedby`/`aria-invalid` (FormField), make Escape close overlays, trap focus in modals, return focus on close, and follow WAI-ARIA keyboard patterns (menu, tabs, listbox/combobox, radiogroup, switch).
- **Tests** (Vitest + Testing Library, jsdom): each component covers rendering and role, `className` merging, `ref` forwarding, the main variants (via data attributes), and keyboard and controlled behaviour. `npm test` must stay green.

---

## 7. Component API contracts

Types prefixed `HTML…`/`ComponentPropsWithRef` come from React. `Size`, `Tone`, `Side`, `Align`, `Orientation`, `KeyCombo` come from `src/types.ts`. Defaults are shown as `= x`.

### 7.1 `src/theme/` — DONE (architect)

```ts
type OmaiRadius = 'sharp' | 'soft';
type OmaiGaps = 'default' | 'none' | 'wide';
interface OmaiProviderProps {
  children?: ReactNode;
  theme?: OmaiThemeId; defaultTheme?: OmaiThemeId /* = 'tokyo-night' */; onThemeChange?(id): void;
  radius?: OmaiRadius; defaultRadius?: OmaiRadius /* = 'sharp' */; onRadiusChange?(r): void;
  gaps?: OmaiGaps; defaultGaps?: OmaiGaps /* = 'default' */; onGapsChange?(g): void;
  target?: 'document' | 'scope';      // = 'document' (attrs on <html>); 'scope' renders <div class="omai-theme-scope" data-omai-*>
  storageKey?: string | null;         // = 'omai-theme' (+ ':radius', ':gaps'); null disables persistence
  transition?: 'none' | 'wipe';       // = 'none'; 'wipe' = diagonal View-Transition wipe (200ms)
  className?: string; style?: CSSProperties;  // scope wrapper only
}
function useOmaiTheme(): {
  theme: OmaiThemeId; mode: 'dark'|'light'; meta: OmaiThemeMeta; themes: readonly OmaiThemeMeta[];
  setTheme(id): void; cycleTheme(direction?: 1 | -1): void;
  radius: OmaiRadius; setRadius(r): void; gaps: OmaiGaps; setGaps(g): void; target: 'document'|'scope';
}                                       // throws outside provider
function useOptionalOmaiTheme(): ReturnType<typeof useOmaiTheme> | null;
function useOmaiPortalAttributes(): Record<string, string>;   // spread on portalled overlay roots
function getOmaiInitScript(opts?: { storageKey?: string; defaultTheme?: OmaiThemeId }): string; // no-flash <head> script
```

### 7.2 `src/primitives/` — core-ui-eng

```ts
interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; // = 'primary' (brand bg, brand-ink text; hover brand-hover)
  size?: Size;                 // = 'md' (40px, px-5, mono 14px, weight 500)
  loading?: boolean;           // shows spinner, sets aria-busy + disabled, keeps width
  leadingIcon?: ReactNode; trailingIcon?: ReactNode;
  fullWidth?: boolean;
}                              // type defaults to "button". secondary = surface bg + border-strong.
interface IconButtonProps extends Omit<ButtonProps, 'leadingIcon' | 'trailingIcon' | 'fullWidth' | 'children'> {
  icon: ReactNode; 'aria-label': string;   // required; square (width = height). variant default = 'ghost'
}
interface BadgeProps extends ComponentPropsWithRef<'span'> {
  tone?: Tone;                           // = 'neutral'
  variant?: 'soft' | 'solid' | 'outline';// = 'soft' (uses --omai-<tone>-soft bg + tone text)
  size?: 'sm' | 'md';                    // = 'md'; mono 11px 700 uppercase tracking-wider
  dot?: boolean;                         // leading status dot
}
interface KbdProps extends ComponentPropsWithRef<'kbd'> {
  keys?: KeyCombo;                       // renders each key as <kbd class="omai-kbd__key"> joined by "+"; else children
  size?: 'sm' | 'md';                    // = 'md'
}
interface CardProps extends ComponentPropsWithRef<'div'> {
  variant?: 'surface' | 'outline' | 'ghost';  // = 'surface' (surface bg + border-subtle + --omai-elevation)
  padding?: 'none' | 'sm' | 'md' | 'lg';      // = 'md'
  interactive?: boolean;                      // hover --omai-elevation-hover + surface-2; cursor pointer
}
// Parts: CardHeader (div), CardTitle (h3, sans 600), CardDescription (p, text-secondary), CardContent (div), CardFooter (div)
//   each `ComponentPropsWithRef<el>`, classes omai-card__header|title|description|content|footer.
interface SeparatorProps extends ComponentPropsWithRef<'div'> {
  orientation?: Orientation;  // = 'horizontal'
  decorative?: boolean;       // = true (role="none"); false -> role="separator" + aria-orientation
  label?: ReactNode;          // centered mono label: ──── label ────
}
interface AvatarProps extends ComponentPropsWithRef<'span'> {
  src?: string; alt?: string;
  name?: string;              // initials fallback (max 2 chars) when no/failed src
  size?: 'xs' | Size | 'xl';  // = 'md' (24/32/40/48/64px)
  shape?: 'square' | 'circle';// = 'square' ('circle' uses --omai-radius-full → still square in sharp mode)
  status?: 'online' | 'away' | 'busy' | 'offline';
}
interface SkeletonProps extends ComponentPropsWithRef<'div'> {
  variant?: 'block' | 'text' | 'pixel';  // = 'block'; 'pixel' = stepped blocky shimmer
  width?: number | string; height?: number | string;
  lines?: number;                        // text variant: n lines, last 60% wide
}                                        // aria-hidden; respects reduced motion
interface TooltipProps {
  content: ReactNode;
  children: ReactElement;      // trigger; receives aria-describedby, ref, pointer/focus handlers (cloneElement)
  side?: Side;                 // = 'top'
  align?: Align;               // = 'center'
  delay?: number;              // = 400ms open delay; closes immediately
  shortcut?: KeyCombo;         // rendered as <Kbd> after content
  open?: boolean; defaultOpen?: boolean; onOpenChange?(open: boolean): void;
  disabled?: boolean; className?: string;   // className -> tooltip bubble
}                              // role="tooltip", portalled, Esc closes, opens on hover+focus
```

### 7.3 `src/forms/` — core-ui-eng

All controls read the optional `FormField` context (`useFormField()`) to fill in `id`, `aria-describedby`, `aria-invalid`, `required` and `disabled` by default. `invalid` sets `aria-invalid` and `data-invalid` and switches the border to `--omai-danger`.

```ts
interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  size?: Size; invalid?: boolean;
  leadingIcon?: ReactNode; trailingIcon?: ReactNode;   // root becomes <span class="omai-input">, native input inside
}
interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  invalid?: boolean;
  resize?: 'none' | 'vertical' | 'both';   // = 'vertical'
  autoResize?: boolean;                    // grow with content
}
interface SelectOption { value: string; label: ReactNode; disabled?: boolean }
interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size'> {   // NATIVE <select>, custom chevron
  size?: Size; invalid?: boolean;
  options?: readonly SelectOption[];   // or pass <option> children
  placeholder?: string;                // disabled hidden first option
}
interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'size' | 'checked' | 'defaultChecked'> {
  checked?: boolean | 'indeterminate'; defaultChecked?: boolean;
  onCheckedChange?(checked: boolean): void;
  label?: ReactNode; description?: ReactNode;   // root is <label class="omai-checkbox">
  size?: 'sm' | 'md'; invalid?: boolean;
}
interface SwitchProps extends Omit<ComponentPropsWithRef<'button'>, 'onChange' | 'value' | 'defaultValue'> {
  checked?: boolean; defaultChecked?: boolean; onCheckedChange?(checked: boolean): void;
  label?: ReactNode;               // rendered next to the switch, clickable
  size?: 'sm' | 'md';
  name?: string; value?: string;   // hidden input for native forms
}                                  // <button role="switch" aria-checked>, data-state="on|off"
interface RadioOption { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean }
interface RadioGroupProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'> {
  options: readonly RadioOption[];
  value?: string; defaultValue?: string; onValueChange?(value: string): void;
  name?: string;                   // auto useId() when omitted; native radios (arrow keys native)
  orientation?: Orientation;       // = 'vertical'
  disabled?: boolean; invalid?: boolean; size?: 'sm' | 'md';
}                                  // role="radiogroup"
interface SliderProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size'> {
  value?: number; defaultValue?: number; onValueChange?(value: number): void;
  min?: number; max?: number; step?: number;     // = 0 / 100 / 1
  showValue?: boolean; formatValue?(value: number): string;
  size?: 'sm' | 'md';
}                                                 // native range; filled track = brand via --omai-slider-fill %
interface FormFieldProps extends ComponentPropsWithRef<'div'> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;          // when set → invalid, rendered in --omai-danger with role="alert"
  required?: boolean;         // label suffix "*"
  disabled?: boolean;
  id?: string;                // control id; default useId()
  orientation?: Orientation;  // = 'vertical'; horizontal = label column left
  children: ReactNode;
}
function useFormField(): { id: string; descriptionId?: string; errorId?: string; invalid: boolean; required: boolean; disabled: boolean } | null;
```

### 7.4 `src/feedback/` — core-ui-eng

```ts
interface AlertProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  tone?: Tone;                  // = 'info'; danger/warning → role="alert", else role="status"
  title?: ReactNode;
  icon?: ReactNode | false;     // default lucide icon per tone; false hides
  action?: ReactNode;
  onDismiss?(): void;           // shows close IconButton
}

// Toast — Mako-style stacked deck (top-right, 15px offset, 320px wide, 1px tone/brand border, mono 12px,
// collapsed: newest on top, others peek behind (translateY/scale); hover/focus-within fans the stack out;
// thin auto-dismiss progress line; pause on hover; numbered action buttons).
interface ToastAction { label: ReactNode; onClick(): void; shortcut?: string /* '1','2'… */ }
interface ToastOptions {
  id?: string; title: ReactNode; description?: ReactNode;
  tone?: Tone;                        // = 'neutral' (border = --omai-brand), else tone color
  icon?: ReactNode; appName?: string; timestamp?: Date | string;
  duration?: number | null;           // ms; = provider duration; null = sticky
  actions?: readonly ToastAction[];
  onDismiss?(): void;
}
interface ToastProviderProps {
  children?: ReactNode;
  placement?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'; // = 'top-right'
  duration?: number;   // = 5000
  max?: number;        // = 5 visible (older are dropped)
  offset?: number;     // = 15 (px)
}
function useToast(): {
  toast(options: ToastOptions): string;   // returns id
  update(id: string, options: Partial<ToastOptions>): void;
  dismiss(id?: string): void;             // no id = all
  toasts: readonly (ToastOptions & { id: string; createdAt: number })[];
};                                        // throws outside ToastProvider
interface ToastProps extends ToastOptions { onClose?(): void; className?: string }  // presentational card (docs/static)
// viewport: <ol aria-live="polite" class="omai-toast-viewport"> portalled; danger toasts use role="alert".

interface DialogProps {
  open?: boolean; defaultOpen?: boolean; onOpenChange?(open: boolean): void;
  trigger?: ReactElement;                 // optional; cloned with onClick → open, aria-haspopup="dialog"
  title: ReactNode; description?: ReactNode;
  children?: ReactNode; footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';   // = 'md' (24/32/40/48rem max-width)
  closeOnEscape?: boolean; closeOnOverlayClick?: boolean; showClose?: boolean;   // all = true
  initialFocus?: RefObject<HTMLElement | null>;
  className?: string;                     // → dialog panel
}                                         // role="dialog" aria-modal, focus trap, scroll lock, portal, backdrop --omai-backdrop
interface DrawerProps extends Omit<DialogProps, 'size'> {
  side?: Side;                            // = 'right'
  size?: 'sm' | 'md' | 'lg' | 'full';     // = 'md' (20/28/40rem or full)
}
interface PopoverProps {
  trigger: ReactElement;                  // gets aria-expanded, aria-controls, aria-haspopup="dialog"
  children: ReactNode;                    // content
  open?: boolean; defaultOpen?: boolean; onOpenChange?(open: boolean): void;
  side?: Side; align?: Align; offset?: number;   // = 'bottom' / 'start' / 6
  closeOnEscape?: boolean; closeOnOutsideClick?: boolean;   // = true
  className?: string; 'aria-label'?: string;
}                                         // portal, flip on collision, focus moves into content, returns on close
type DropdownMenuEntry =
  | { type?: 'item'; id: string; label: ReactNode; icon?: ReactNode; shortcut?: KeyCombo; disabled?: boolean; danger?: boolean; onSelect?(): void }
  | { type: 'checkbox'; id: string; label: ReactNode; checked: boolean; onCheckedChange(checked: boolean): void; disabled?: boolean }
  | { type: 'label'; label: ReactNode }
  | { type: 'separator' };
interface DropdownMenuProps {
  trigger: ReactElement;                  // aria-haspopup="menu", aria-expanded; ArrowDown/Enter/Space opens
  items: readonly DropdownMenuEntry[];
  open?: boolean; defaultOpen?: boolean; onOpenChange?(open: boolean): void;
  side?: Side; align?: Align;             // = 'bottom' / 'start'
  className?: string; 'aria-label'?: string;
}                                         // role="menu"/"menuitem"/"menuitemcheckbox", roving focus, typeahead, Home/End, Esc
interface ProgressProps extends ComponentPropsWithRef<'div'> {
  value?: number | null;                  // null/undefined = indeterminate
  max?: number;                           // = 100
  tone?: Tone;                            // = 'brand'
  size?: Size;                            // = 'md' (2/4/8px bar)
  variant?: 'bar' | 'blocks';             // = 'bar'; 'blocks' = btop-style █▓▒░ segments
  segments?: number;                      // = 20 (blocks)
  label?: ReactNode; showValue?: boolean;
}                                         // role="progressbar" aria-valuenow/min/max
```

Shared positioning: core-ui-eng owns `src/utils/position.ts` (`computePosition(anchorRect, floatingSize, { side, align, offset }) → { top, left, side }` with viewport flip, plus `useFloatingPosition`). os-ui-eng may import it.

### 7.5 `src/navigation/` — core-ui-eng

```ts
interface TabItem { value: string; label: ReactNode; icon?: ReactNode; badge?: ReactNode; content?: ReactNode; disabled?: boolean }
interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  items: readonly TabItem[];
  value?: string; defaultValue?: string; onValueChange?(value: string): void;   // default = first enabled
  variant?: 'underline' | 'boxed';        // = 'underline' (2px brand indicator)
  orientation?: Orientation;              // = 'horizontal'
  activation?: 'automatic' | 'manual';    // = 'automatic'
  size?: Size; listClassName?: string; 'aria-label'?: string;
}                                         // role tablist/tab/tabpanel, arrows/Home/End, panels only for items with content
interface BreadcrumbItem { label: ReactNode; href?: string; onClick?(e: MouseEvent): void; icon?: ReactNode }
interface BreadcrumbProps extends ComponentPropsWithRef<'nav'> {
  items: readonly BreadcrumbItem[];
  separator?: ReactNode;                  // = '/'
  maxItems?: number;                      // collapse middle into '…'
  renderLink?(item: BreadcrumbItem, props: { className: string; children: ReactNode }): ReactNode; // router integration
}                                         // aria-label="Breadcrumb", last item aria-current="page"
interface SidebarNavItem { id: string; label: ReactNode; href?: string; icon?: ReactNode; badge?: ReactNode; shortcut?: KeyCombo; disabled?: boolean; items?: readonly SidebarNavItem[] }
interface SidebarNavSection { id?: string; title?: ReactNode; items: readonly SidebarNavItem[] }
interface SidebarNavProps extends Omit<ComponentPropsWithRef<'nav'>, 'onSelect'> {
  sections: readonly SidebarNavSection[];
  activeId?: string;                      // aria-current="page"; brand-soft bg + 2px brand left bar
  onNavigate?(item: SidebarNavItem, event: MouseEvent): void;
  renderLink?(item: SidebarNavItem, props: { className: string; children: ReactNode; 'aria-current'?: 'page' }): ReactNode;
  collapsed?: boolean;                    // icon-only rail (labels → tooltips)
  header?: ReactNode; footer?: ReactNode;
}                                         // nested items: one level, collapsible (aria-expanded)
interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'onChange'> {
  pageCount: number;
  page?: number; defaultPage?: number; onPageChange?(page: number): void;   // 1-based, default 1
  siblingCount?: number; boundaryCount?: number;   // = 1 / 1
  showPrevNext?: boolean; showFirstLast?: boolean; // = true / false
  size?: Size; disabled?: boolean;
}                                         // aria-label="Pagination", current aria-current="page"
```

### 7.6 `src/data/` — core-ui-eng

```ts
interface TableColumn<T> {
  key: string; header: ReactNode;
  accessor?: keyof T | ((row: T) => ReactNode);
  cell?(row: T, rowIndex: number): ReactNode;      // overrides accessor
  align?: 'left' | 'center' | 'right'; width?: number | string;
  sortable?: boolean; sortValue?(row: T): string | number;
  mono?: boolean;                                  // tabular-nums mono cell (default true for numbers)
}
type TableSort = { key: string; direction: 'asc' | 'desc' } | null;
interface TableProps<T> extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  columns: readonly TableColumn<T>[]; data: readonly T[];
  getRowKey?(row: T, index: number): string | number;
  sort?: TableSort; defaultSort?: TableSort; onSortChange?(sort: TableSort): void;  // uncontrolled sorts client-side
  density?: 'compact' | 'normal';   // = 'normal'
  striped?: boolean; stickyHeader?: boolean;
  caption?: ReactNode; emptyState?: ReactNode;
  onRowClick?(row: T, index: number): void;
  selectedKeys?: readonly (string | number)[];     // selection bg
}                                                  // root div scroll container > <table>; aria-sort on headers
declare function Table<T>(props: TableProps<T>): ReactElement;
interface CodeBlockProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  code: string;
  language?: string;            // label only (no highlighter dep)
  title?: ReactNode;            // filename tab
  showLineNumbers?: boolean; highlightLines?: readonly number[];
  copyable?: boolean;           // = true (navigator.clipboard, Check icon 2s)
  wrap?: boolean; maxHeight?: number | string;
}                               // bg --omai-bg-deep, border-subtle, mono 13-14px
interface StatCardProps extends ComponentPropsWithRef<'div'> {
  label: ReactNode; value: ReactNode; unit?: ReactNode;
  delta?: { value: ReactNode; direction: 'up' | 'down' | 'flat'; tone?: Tone };
  icon?: ReactNode; description?: ReactNode;
  tone?: Tone;                  // = 'brand' (meter/sparkline color)
  meter?: number;               // 0–100 btop-style bar
  sparkline?: readonly number[];// rendered as ▁▂▃▄▅▆▇█
}
interface KeyValueItem { key: string; label: ReactNode; value: ReactNode; mono?: boolean; copyable?: boolean }
interface KeyValueListProps extends ComponentPropsWithRef<'dl'> {
  items: readonly KeyValueItem[];
  layout?: 'horizontal' | 'stacked';   // = 'horizontal'
  dense?: boolean; divided?: boolean;  // divided = true
  labelWidth?: string;                 // = '10rem'
}
```

### 7.7 `src/omai/` — os-ui-eng

```ts
// ── Walker (command palette) ─────────────────────────────────────────────
interface WalkerItem {
  id: string; label: string; description?: string; group?: string;
  icon?: ReactNode; shortcut?: KeyCombo; keywords?: readonly string[];
  disabled?: boolean; onSelect?(): void; closeOnSelect?: boolean;   // = true
}
interface WalkerProps {
  items: readonly WalkerItem[];
  open?: boolean; defaultOpen?: boolean; onOpenChange?(open: boolean): void;
  query?: string; defaultQuery?: string; onQueryChange?(q: string): void;
  onSelect?(item: WalkerItem): void;
  hotkey?: string | false;              // = 'mod+k' (Ctrl+K / ⌘K) toggles; uses useHotkey
  placeholder?: string;                 // = 'Search…'
  filter?(item: WalkerItem, query: string): number | null;   // score; default fuzzyMatch on label+keywords
  maxResults?: number;                  // = 50
  emptyState?: ReactNode; loading?: boolean; title?: ReactNode;
  footer?: ReactNode | false;           // default HotkeyBar: ↑↓ Navigate · ↵ Select · Esc Close
  className?: string;
}   // centered modal ~40rem, --omai-radius-lg, 1px border-strong, bg --omai-bg-deep; combobox + listbox ARIA
    // (aria-activedescendant), 36px rows, matched chars bold brand, selected row --omai-selection,
    // grouped headings, ↑/↓/Home/End/PageUp/PageDown/Enter/Esc, focus trap, portal.
function fuzzyMatch(query: string, text: string): { score: number; indices: number[] } | null;
function useHotkey(combo: string | readonly string[], handler: (e: KeyboardEvent) => void,
  options?: { enabled?: boolean; preventDefault?: boolean /* = true */; target?: 'document' | RefObject<HTMLElement | null>; ignoreInputs?: boolean /* = true */ }): void;
// combo grammar: 'mod+k', 'ctrl+shift+p', 'alt+enter', '?' ; mod = Meta on Apple, Ctrl elsewhere.

// ── Waybar (OS status bar) ──────────────────────────────────────────────
interface WaybarProps extends ComponentPropsWithRef<'header'> {
  left?: ReactNode; center?: ReactNode; right?: ReactNode;
  variant?: 'opaque' | 'glassy' | 'clear';   // = 'opaque' (--omai-bg-deep, 1px bottom border)
  position?: 'top' | 'bottom';               // = 'top'
  sticky?: boolean;                          // position: sticky
  height?: number;                           // = 26 (px) mono 12px
}
interface WaybarModuleProps extends ComponentPropsWithRef<'button'> { icon?: ReactNode; label?: ReactNode; tooltip?: ReactNode; active?: boolean; tone?: Tone }
interface WaybarWorkspacesProps extends Omit<ComponentPropsWithRef<'div'>, 'onSelect'> {
  count?: number;                     // = 5 (max 10)
  active: number;                     // 1-based
  occupied?: readonly number[]; urgent?: readonly number[];
  onSelect?(workspace: number): void;
}                                     // active: surface-2 bg + brand text + 2px bottom indicator
interface WaybarClockProps extends ComponentPropsWithRef<'time'> { hour12?: boolean /* = false */; showDate?: boolean /* = true */; now?: Date /* freeze for tests/docs */ }
interface WaybarLogoProps extends ComponentPropsWithRef<'button'> {}          // pixel "O" glyph (Omarchy menu)
interface WaybarLayoutIndicatorProps extends ComponentPropsWithRef<'span'> { layout: 'dwindle' | 'scrolling' | 'floating' } // ■ ● ▲
interface WaybarStatProps extends ComponentPropsWithRef<'div'> { icon?: ReactNode; value: ReactNode; label?: string; tone?: Tone; meter?: number }

// ── TilingGrid + WindowPane (Hyprland) ──────────────────────────────────
interface TilingGridProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;                     // WindowPane elements
  layout?: 'dwindle' | 'master' | 'columns' | 'rows' | 'grid';   // = 'dwindle' (alternating binary split)
  activeId?: string; defaultActiveId?: string; onActiveChange?(id: string): void;
  gaps?: 'inherit' | 'none' | number;      // = 'inherit' → --omai-gap-in between panes, --omai-gap-out padding
  masterRatio?: number;                    // = 0.5 (master layout)
  keyboard?: boolean;                      // = true: Alt+Arrow moves focus between panes (spatial)
  height?: number | string;                // = 480
}
interface WindowPaneProps extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
  id: string;
  title?: ReactNode; icon?: ReactNode; actions?: ReactNode;
  active?: boolean;                        // default from TilingGrid context
  floating?: boolean;
  showChrome?: boolean;                    // = true (titlebar)
  padding?: 'none' | 'sm' | 'md';          // = 'md'
  onClose?(): void;
}   // inactive: 1px border-strong, opacity --omai-inactive-opacity; active: --omai-border-active-width solid --omai-brand.
    // data-state="active|inactive". Click/focus → onActiveChange.

// ── Terminal (Ghostty/Foot block) ───────────────────────────────────────
type TerminalLine =
  | { type: 'command'; text: string; prompt?: ReactNode }
  | { type: 'output'; text: ReactNode; color?: AnsiColor }   // AnsiColor = 0..15
  | { type: 'blank' };
interface TerminalProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  title?: ReactNode;                      // = 'ghostty'
  lines?: readonly TerminalLine[]; children?: ReactNode;   // children appended after lines
  prompt?: ReactNode;                     // = '❯' in --omai-brand (with optional user@host cwd)
  user?: string; host?: string; cwd?: string;
  showChrome?: boolean;                   // = true
  cursor?: 'block' | 'beam' | 'underline' | false;   // = 'block', color --omai-cursor, blinks
  typing?: boolean; typingSpeed?: number; // animate commands (ms/char = 30); off under reduced motion
  maxHeight?: number | string; copyable?: boolean;
}                                          // bg --omai-bg-deep, padding 10px 12px, mono 14px/1.5
type AnsiColor = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15;
interface AnsiProps extends ComponentPropsWithRef<'span'> { color?: AnsiColor; bg?: AnsiColor; bold?: boolean; dim?: boolean }
function ansiToReact(text: string): ReactNode;   // parses SGR 0/1/2/30-37/90-97/40-47/100-107

// ── ThemeSwitcher ───────────────────────────────────────────────────────
interface ThemeSwitcherProps extends Omit<ComponentPropsWithRef<'div'>, 'onSelect'> {
  variant?: 'grid' | 'list' | 'select' | 'compact';   // = 'grid' (swatch tiles bg/surface/text/brand)
  themes?: readonly OmaiThemeId[];                 // subset / order; default all 16
  columns?: number;                                   // grid; = 4
  showRadiusToggle?: boolean; showModeLabel?: boolean;
  onSelect?(id: OmaiThemeId): void;
}   // requires OmaiProvider; role="radiogroup" + roving arrows; active tile 2px brand border + check

// ── HotkeyBar ───────────────────────────────────────────────────────────
interface HotkeyItem { keys: KeyCombo; label: ReactNode; onTrigger?(): void; combo?: string /* registers useHotkey when set */ }
interface HotkeyBarProps extends ComponentPropsWithRef<'div'> {
  items: readonly HotkeyItem[];
  position?: 'inline' | 'top' | 'bottom';   // = 'inline'; top/bottom = fixed edge bar
  separator?: ReactNode;                    // = '·'
  size?: 'sm' | 'md';
}

// ── PixelField (omarchy.org hero) ───────────────────────────────────────
interface PixelFieldProps extends ComponentPropsWithRef<'div'> {
  pattern?: 'wave' | 'rain' | 'noise' | 'logo' | 'static';   // = 'wave'
  cellSize?: number; gap?: number;          // = 10 / 2 (px); cols/rows auto-fit
  speed?: number;                           // = 1
  interactive?: boolean;                    // = true: hover → --omai-field-hover, crest near pointer
  paused?: boolean;
  height?: number | string;                 // = 320
  children?: ReactNode;                     // overlay content (hero copy), centered
}   // <canvas aria-hidden>; colors read from computed --omai-field-* and re-read when data-omai-theme
    // changes (MutationObserver on <html> + closest scope); static frame under reduced motion; DPR-aware.
```

Barrel: `src/omai/index.ts` exports every component and props type above, plus `fuzzyMatch`, `useHotkey`, `Ansi`, `ansiToReact`, `WaybarModule`, `WaybarWorkspaces`, `WaybarClock`, `WaybarLogo`, `WaybarLayoutIndicator` and `WaybarStat`.

---

## 8. Shared utilities — DONE (architect), `src/utils/`

| Export | Purpose |
|---|---|
| `cn(...classes)` | `clsx` + `tailwind-merge`. Use as `cn('omai-x', className)` |
| `useControllableState({ value, defaultValue, onChange })` | Controlled/uncontrolled state |
| `useFocusTrap(ref, { enabled, initialFocus?, restoreFocus? })` | Modal focus management |
| `getFocusableElements`, `focusFirst`, `trapTabKey` | Low-level focus helpers |
| `getNextIndex(current, delta, length, { loop, isDisabled })`, `getNavigationDelta(key, orientation)` | Roving index for menus, lists, tabs, radios |
| `useEscapeKey(handler, enabled)`, `useOnClickOutside(refs, handler, enabled)` | Dismissal |
| `useScrollLock(enabled)` | Body scroll lock (ref-counted) |
| `mergeRefs(...refs)` | Combine refs |
| `usePrefersReducedMotion()` | Motion preference |
| `useIsomorphicLayoutEffect` | SSR-safe layout effect |
| `<Portal container?>` | SSR-safe portal (to `[data-omai-portal-root]` or `body`) |

---

## 9. Build, dev, test

| Command (repo root) | What it does |
|---|---|
| `npm install` | Installs all workspaces (links `@omai/*`) |
| `npm run dev` | Builds tokens (needed for the generated `themes.css`), then starts the docs Vite dev server at http://localhost:5173 |
| `npm run build` | `build:tokens` → `build:react` → `build:docs` |
| `npm run build:tokens` | `tsc` (NodeNext) → `dist/*.js/.d.ts`, then `dist/themes.css` |
| `npm run build:react` | `vite build` (ESM, preserveModules, `"use client"`) + `tsc` declarations + `dist/styles.css` |
| `npm run build:docs` | type-check + `vite build` → `apps/docs/dist` |
| `npm run typecheck` | `tsc --noEmit` in tokens, react, docs |
| `npm test` | Vitest: tokens (node) + react (jsdom) |
| `npm run test:watch -w @jseramn/omai` | Watch mode |

**Source condition.** Each package's `exports` includes a `"source"` condition that points at `src/`. `tsconfig.base.json` (`customConditions: ["source"]`), the docs `vite.config.ts` and the react `vitest.config.ts` all resolve it. As a result, docs and tests use live TypeScript and CSS with **no prebuild** (the one exception is tokens `themes.css`). The library build tsconfigs reset `customConditions: []`, so published artifacts point only to `dist/`.

**Imports.** In `packages/react/src`, relative imports have no extension (bundler resolution). In `packages/tokens/src`, relative imports **must** end in `.js` (NodeNext).

---

## 10. Decisions & notes

- **No headless-UI dependency (Radix etc.)**. Behaviour is built in-house on `src/utils`, which keeps the bundle small and the styling 100% `omai-*`. Select and Slider use native elements for robustness.
- **No syntax highlighter** in `CodeBlock`. Consumers can pass pre-highlighted children later if needed.
- **Active border is 2px** (omarchy.org showcase). The OS default is 1px; set `--omai-border-active-width: 1px` to match the OS exactly.
- **Sans is reserved for headings**, as on omarchy.org. Body and UI text are mono.
- **TypeScript 7 (native)** is the current npm `latest`. If a tool breaks on it, pin `typescript@^5` at the root. No source changes would be needed.
