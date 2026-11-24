# @jseramn/omai-tokens

> Design tokens, 16 curated themes, and Tailwind CSS v4 bridge for **OMAI (Omarchy Based Agent Interface)** by [jseramn](https://github.com/jseramn/omai).

[![npm version](https://img.shields.io/badge/npm-0.1.0-blue.svg)](https://www.npmjs.com/package/@jseramn/omai-tokens)
[![license](https://img.shields.io/badge/license-Source--Available-orange.svg)](https://github.com/jseramn/omai/blob/main/LICENSE)

`@jseramn/omai-tokens` is the foundational design token package powering **OMAI (Omarchy Based Agent Interface)**. Inspired by the visual aesthetic of [omarchy.org](https://omarchy.org) (Geist headings, JetBrains Mono body, razor-sharp 0px borders, 1px hairlines) and the desktop ergonomics of [Omarchy OS](https://learn.omarchy.org) (MIT License — Hyprland tiling geometry, Waybar status bar, Walker launcher, Mako notification deck, Ghostty terminal, and 16-color ANSI palettes).

Every token is published as a CSS custom property (`--omai-*`) scoped cleanly within CSS `@layer theme`. It requires **zero JavaScript** at runtime to activate or style, while providing a rich TypeScript API for dynamic theming and compilation.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [1. Plain CSS / Framework Agnostic](#1-plain-css--framework-agnostic)
  - [2. Tailwind CSS v4](#2-tailwind-css-v4)
- [Theme Activation & Data Attributes](#theme-activation--data-attributes)
  - [Root Configuration](#root-configuration)
  - [Scoped Themes](#scoped-themes)
  - [Radius & Gap Modes](#radius--gap-modes)
- [Official Themes (16 Palettes)](#official-themes-16-palettes)
- [Tailwind CSS v4 Bridge](#tailwind-css-v4-bridge)
- [JavaScript / TypeScript API](#javascript--typescript-api)
  - [Theme Registry & Metadata](#theme-registry--metadata)
  - [CSS Generation & Dynamic Themes](#css-generation--dynamic-themes)
  - [Authoring Custom Themes](#authoring-custom-themes)
- [CSS Custom Properties Reference](#css-custom-properties-reference)
  - [Surfaces & Backgrounds](#surfaces--backgrounds)
  - [Text & Prose](#text--prose)
  - [Brand & Interactive Accents](#brand--interactive-accents)
  - [Semantic Status](#semantic-status)
  - [Hero Pixel-Field Ramp](#hero-pixel-field-ramp)
  - [ANSI 16-Color Terminal Palette](#ansi-16-color-terminal-palette)
  - [Typography](#typography)
  - [Spacing & Layout](#spacing--layout)
  - [Geometry & Hyprland Modes](#geometry--hyprland-modes)
  - [Elevation & Overlays](#elevation--overlays)
  - [Motion & Interaction](#motion--interaction)
  - [Z-Index Scale](#z-index-scale)
- [License](#license)

---

## Features

- **Tokens First**: Every color, font, spacing unit, radius, gap, and transition duration is an `--omai-*` CSS custom property.
- **16 Authentic Omarchy Themes**: 13 dark and 3 light palettes extracted directly from Omarchy OS `colors.toml` and omarchy.org.
- **Zero Runtime Overhead**: Pure CSS custom properties delivered inside `@layer theme`. Themes activate instantly via HTML data attributes.
- **Sharp by Default**: Emulates omarchy.org with `0px` razor-sharp corners by default; toggle to Hyprland `4px/6px/8px` curvature with `data-omai-radius="soft"`.
- **First-Class Tailwind CSS v4 Bridge**: Exposes live `--color-omai-*` tokens via `@theme inline` and custom variants (`dark:`, `omai-dark:`, `omai-light:`).
- **Full TypeScript SDK**: Includes metadata, validators, swatch finders, and runtime/build-time CSS generators.

---

## Installation

```bash
npm install @jseramn/omai-tokens
```

Recommended companion font packages:

```bash
npm install @fontsource-variable/geist @fontsource-variable/jetbrains-mono
```

---

## Quick Start

### 1. Plain CSS / Framework Agnostic

Import the required CSS bundles into your entry point:

```typescript
// Fonts
import '@fontsource-variable/geist';
import '@fontsource-variable/jetbrains-mono';

// Mandatory Omarchy token layers
import '@jseramn/omai-tokens/tokens.css'; // Structural tokens (typography, sizing, geometry)
import '@jseramn/omai-tokens/themes.css'; // All 16 color themes

// Optional: Element defaults (mono body, Geist headings, custom scrollbars, selection)
import '@jseramn/omai-tokens/base.css';
```

Activate a theme on your `<html>` element:

```html
<!DOCTYPE html>
<html lang="en" data-omai-theme="tokyo-night" data-omai-mode="dark" data-omai-radius="sharp">
  <head>
    <meta charset="UTF-8" />
    <title>Omarchy App</title>
  </head>
  <body>
    <div class="panel">
      <h1>Hello Omarchy</h1>
      <p>Razor-sharp styling powered by CSS custom properties.</p>
    </div>
  </body>
</html>
```

Style elements directly with `--omai-*` properties:

```css
.panel {
  background-color: var(--omai-surface);
  color: var(--omai-text);
  border: var(--omai-border-width) solid var(--omai-border-subtle);
  border-radius: var(--omai-radius-md);
  padding: var(--omai-space-6);
  box-shadow: var(--omai-elevation);
}

.panel h1 {
  font-family: var(--omai-font-sans);
  color: var(--omai-brand);
  font-size: var(--omai-text-2xl);
  font-weight: var(--omai-weight-semibold);
}
```

### 2. Tailwind CSS v4

Import `@jseramn/omai-tokens/tailwind.css` directly after `tailwindcss`:

```css
/* app.css */
@import "tailwindcss";
@import "@jseramn/omai-tokens/tokens.css";
@import "@jseramn/omai-tokens/themes.css";
@import "@jseramn/omai-tokens/tailwind.css";
```

Now use standard Tailwind classes backed dynamically by Omarchy tokens:

```html
<div class="-omai-surface border -omai-border-subtle -omai-md -omai-6 -omai-text">
  <h2 class="font-sans font-semibold -omai-brand text-2xl">Tailwind + Omarchy</h2>
  <p class="font-mono -omai-text-muted text-sm mt-2">
    The bridge seamlessly connects Tailwind v4 utilities with live CSS custom properties.
  </p>
  <button class="mt-4 px-4 py-2 -omai-brand -omai-brand-ink font-mono font-medium -omai-sm">
    Execute
  </button>
</div>
```

---

## Theme Activation & Data Attributes

### Root Configuration

Themes are activated declaratively via HTML data attributes on the `<html>` or `<body>` tag:

| Attribute | Accepted Values | Default | Description |
|---|---|---|---|
| `data-omai-theme` | Any of the 16 theme IDs | `tokyo-night` | Sets all palette variables and native `color-scheme` |
| `data-omai-mode` | `dark` \| `light` | `dark` | Matches the active theme mode; enables CSS & Tailwind mode variants |
| `data-omai-radius` | `sharp` \| `soft` | `sharp` | `sharp` enforces `0px` radius; `soft` enables `2px-12px` Hyprland rounding |
| `data-omai-gaps` | `default` \| `none` \| `wide` | `default` | Configures Hyprland tiling layout gaps (`5px/10px`, `0px`, `10px/20px`) |

> [!NOTE]
> When no `data-omai-theme` attribute is specified, the tokens stylesheet falls back automatically to `:root` values matching **Tokyo Night** in **sharp** mode.

### Scoped Themes

Because theme tokens are bound to attribute selectors (`[data-omai-theme="..."]`), themes can be nested on any HTML subtree:

```html
<html data-omai-theme="tokyo-night" data-omai-mode="dark">
  <body>
    <!-- Dark Tokyo Night context -->
    <main class="main-content">
      ...
      <!-- Light nested preview pane -->
      <aside data-omai-theme="catppuccin-latte" data-omai-mode="light" class="preview-card">
        <h3>Light Mode Widget</h3>
        <p>All child elements inherit the Catppuccin Latte palette automatically.</p>
      </aside>
    </main>
  </body>
</html>
```

### Radius & Gap Modes

Omarchy provides two distinct corner philosophies and three gap presets:

```html
<!-- Omarchy.org razor aesthetic -->
<html data-omai-radius="sharp" data-omai-gaps="default">

<!-- Hyprland rounded window aesthetic -->
<html data-omai-radius="soft" data-omai-gaps="wide">
```

- **`data-omai-radius="sharp"`**: All radius variables (`--omai-radius-xs` through `--omai-radius-full`) resolve to `0px`.
- **`data-omai-radius="soft"`**:
  - `--omai-radius-xs`: `2px`
  - `--omai-radius-sm`: `4px`
  - `--omai-radius-md`: `6px`
  - `--omai-radius-lg`: `8px` (standard Hyprland window rounding)
  - `--omai-radius-xl`: `12px`
  - `--omai-radius-full`: `9999px`
- **`data-omai-gaps`**:
  - `default`: `--omai-gap-in: 5px`, `--omai-gap-out: 10px` (Hyprland defaults)
  - `none`: `--omai-gap-in: 0px`, `--omai-gap-out: 0px` (monocle / gapless tiling)
  - `wide`: `--omai-gap-in: 10px`, `--omai-gap-out: 20px` (spacious presentation)

---

## Official Themes (16 Palettes)

Omarchy includes 16 production-tested themes (13 dark, 3 light):

| ID | Display Name | Mode | Preview Swatches (`bg` / `surface` / `text` / `brand`) |
|---|---|:---:|---|
| `tokyo-night` ★ | Tokyo Night (Default) | Dark | `#1a1b26` &nbsp; `#1f2230` &nbsp; `#c0caf5` &nbsp; `#9ece6a` |
| `catppuccin` | Catppuccin Mocha | Dark | `#1e1e2e` &nbsp; `#282839` &nbsp; `#cdd6f4` &nbsp; `#89b4fa` |
| `catppuccin-latte` | Catppuccin Latte | **Light** | `#eff1f5` &nbsp; `#f8f9fb` &nbsp; `#4c4f69` &nbsp; `#1e66f5` |
| `ethereal` | Ethereal | Dark | `#060b1e` &nbsp; `#0c122c` &nbsp; `#ffcead` &nbsp; `#7d82d9` |
| `everforest` | Everforest | Dark | `#2d353b` &nbsp; `#303a40` &nbsp; `#d3c6aa` &nbsp; `#7fbbb3` |
| `flexoki-light` | Flexoki Light | **Light** | `#fffcf0` &nbsp; `#f9f6ea` &nbsp; `#100f0f` &nbsp; `#205ea6` |
| `gruvbox` | Gruvbox | Dark | `#282828` &nbsp; `#32302f` &nbsp; `#d4be98` &nbsp; `#7daea3` |
| `hackerman` | Hackerman | Dark | `#0b0c16` &nbsp; `#10121f` &nbsp; `#ddf7ff` &nbsp; `#82fb9c` |
| `kanagawa` | Kanagawa | Dark | `#1f1f28` &nbsp; `#202838` &nbsp; `#dcd7ba` &nbsp; `#dcd7ba` |
| `lumon` | Lumon (Severance) | Dark | `#16242d` &nbsp; `#182836` &nbsp; `#f2fcff` &nbsp; `#8bc9eb` |
| `matte-black` | Matte Black | Dark | `#121212` &nbsp; `#181818` &nbsp; `#eaeaea` &nbsp; `#e68e0d` |
| `nord` | Nord | Dark | `#2e3440` &nbsp; `#343b49` &nbsp; `#d8dee9` &nbsp; `#81a1c1` |
| `osaka-jade` | Osaka Jade | Dark | `#111c18` &nbsp; `#1a2a22` &nbsp; `#f7e8b2` &nbsp; `#509475` |
| `ristretto` | Ristretto | Dark | `#2c2525` &nbsp; `#342a28` &nbsp; `#e6d9db` &nbsp; `#f38d70` |
| `rose-pine` | Rosé Pine | Dark | `#191724` &nbsp; `#1f1d2e` &nbsp; `#e0def4` &nbsp; `#9ccfd8` |
| `rose-pine-dawn` | Rosé Pine Dawn | **Light** | `#faf4ed` &nbsp; `#fffaf3` &nbsp; `#575279` &nbsp; `#56949f` |

---

## Tailwind CSS v4 Bridge

When importing `@jseramn/omai-tokens/tailwind.css`, the bridge leverages `@theme inline` so that utilities resolve to dynamic CSS custom properties rather than static pre-computed hex values.

### Utility Classes

- **Surfaces & Text**:
  - `-omai-bg-deep`, `-omai-bg`, `-omai-surface`, `-omai-surface-2`
  - `-omai-text`, `-omai-text-secondary`, `-omai-text-muted`
  - `-omai-brand-ink` (ink color for use on brand backgrounds)
- **Borders & Rings**:
  - `-omai-border-subtle`, `-omai-border-strong`
  - `-omai-brand`, `-omai-brand`, `-omai-focus-ring`
- **Brand & Accents**:
  - `-omai-brand`, `-omai-brand`, `-omai-brand-soft`, `-omai-brand-hover`
- **Semantic Status**:
  - `-omai-success`, `-omai-success`, `-omai-success-soft`
  - `-omai-warning`, `-omai-warning`, `-omai-warning-soft`
  - `-omai-danger`, `-omai-danger`, `-omai-danger-soft`
  - `-omai-info`, `-omai-info`, `-omai-info-soft`
- **ANSI Terminal Colors**:
  - `-omai-ansi-0` through `-omai-ansi-15`
  - `-omai-ansi-0` through `-omai-ansi-15`
- **Radius & Typography**:
  - `-omai-xs`, `-omai-sm`, `-omai-md`, `-omai-lg`, `-omai-xl`, `-omai-full`
  - Default `rounded-*` and `font-mono` / `font-sans` utilities automatically redirect to Omarchy tokens.
- **Custom Variants**:
  - `omai-dark:` triggers when `data-omai-mode="dark"`
  - `omai-light:` triggers when `data-omai-mode="light"`
  - `dark:` is mapped to `data-omai-mode="dark"` for standard Tailwind compatibility

---

## JavaScript / TypeScript API

`@jseramn/omai-tokens` exports pure ESM modules and comprehensive TypeScript type definitions.

### Theme Registry & Metadata

```typescript
import {
  themeIds,
  DEFAULT_THEME_ID,
  themeMeta,
  getThemeMeta,
  isThemeId,
  themes,
  getTheme,
  tokyoNight,
  catppuccinLatte,
  type OmaiThemeId,
  type OmaiThemeMeta,
  type OmaiTheme,
} from '@jseramn/omai-tokens';

// Validate user input
if (isThemeId(userInput)) {
  console.log(`Theme verified: ${userInput}`);
}

// Retrieve lightweight metadata (ideal for Theme Switchers)
const meta = getThemeMeta('everforest');
console.log(meta.name); // "Everforest"
console.log(meta.mode); // "dark"
console.log(meta.swatch.brand); // "#7fbbb3"

// Access full authored palette
const fullTheme = getTheme('nord');
console.log(fullTheme?.colors.bg); // "#2e3440"
console.log(fullTheme?.colors.ansi[1]); // red
```

### CSS Generation & Dynamic Themes

You can generate CSS custom property maps and stylesheet blocks at runtime or during custom build pipelines:

```typescript
import {
  themeToCssVars,
  themeToCss,
  buildThemesCss,
  deriveDefaults,
} from '@jseramn/omai-tokens';

// Generate a record of CSS variables for inline styles:
const vars = themeToCssVars(tokyoNight);
// { "--omai-bg": "#1a1b26", "--omai-brand": "#9ece6a", "color-scheme": "dark", ... }

// Generate a CSS string block for a specific theme:
const cssString = themeToCss(tokyoNight, '.my-custom-container');

// Compile an entire themes.css stylesheet containing multiple themes:
const bundle = buildThemesCss(themes, 'tokyo-night');
```

### Authoring Custom Themes

Create custom themes satisfying the `OmaiTheme` interface:

```typescript
import {
  type OmaiTheme,
  themeToCss,
} from '@jseramn/omai-tokens';

export const cyberpunkNeon: OmaiTheme = {
  id: 'cyberpunk-neon' as any,
  name: 'Cyberpunk Neon',
  mode: 'dark',
  colors: {
    bgDeep: '#050508',
    bg: '#0a0a10',
    surface: '#12121c',
    surface2: '#1a1a28',
    borderSubtle: '#222234',
    borderStrong: '#3c3c58',
    text: '#e0e4f0',
    textSecondary: '#a0a8c0',
    textMuted: '#687088',
    brand: '#00ffcc',
    brandInk: '#04100c',
    selection: '#252840',
    success: '#00ff66',
    warning: '#ffcc00',
    danger: '#ff0055',
    info: '#00ccff',
    ansi: [
      '#0a0a10', '#ff0055', '#00ff66', '#ffcc00',
      '#00ccff', '#ff00cc', '#00ffcc', '#e0e4f0',
      '#687088', '#ff3377', '#33ff88', '#ffdd33',
      '#33ddff', '#ff33dd', '#33ffdd', '#ffffff',
    ],
  },
  // Optional: override computed fallbacks
  overrides: {
    focusRing: '#00ffcc',
  },
};

// Generate CSS for injection:
const customThemeCss = themeToCss(cyberpunkNeon);
```

---

## CSS Custom Properties Reference

### Surfaces & Backgrounds

| Token | Description | Tokyo Night Default |
|---|---|---|
| `--omai-bg-deep` | Deepest surface: odd sections, code blocks, Waybar bar | `#13141c` |
| `--omai-bg` | Main application / page background canvas | `#1a1b26` |
| `--omai-surface` | Primary elevated surface: cards, secondary buttons, inputs, table headers | `#1f2230` |
| `--omai-surface-2` | Secondary elevated surface: hover states, active rows, inline code/kbd | `#24283b` |
| `--omai-border-subtle` | Subdued borders: dividers, card outlines, table grids | `#24283b` |
| `--omai-border-strong` | Strong borders: interactive inputs, inactive window panes | `#414868` |
| `--omai-selection` | Selection background: `::selection`, selected Walker / table rows | `#292e42` |
| `--omai-backdrop` | Modal and drawer overlay scrim | `oklch(0% 0 0 / .6)` (dark) |

### Text & Prose

| Token | Description | Tokyo Night Default |
|---|---|---|
| `--omai-text` | Primary foreground text | `#c0caf5` |
| `--omai-text-secondary` | Secondary prose, labels, descriptions | `#a9b1d6` |
| `--omai-text-muted` | Muted text: captions, placeholders, disabled items (≥ 4.5:1 contrast) | `#8b93b8` |
| `--omai-cursor` | Terminal and input text cursor color | `#c0caf5` |

### Brand & Interactive Accents

| Token | Description | Tokyo Night Default |
|---|---|---|
| `--omai-brand` | Primary brand accent: buttons, active pane borders, lit pixels | `#9ece6a` |
| `--omai-brand-soft` | Soft brand tint for pill badges and active nav backgrounds | `color-mix(in oklch, var(--omai-brand) 12%, transparent)` |
| `--omai-brand-hover` | Hover state for primary interactive elements | Derived (lightened 14% in dark mode) |
| `--omai-brand-ink` | Contrasting text/icon color placed **on** `--omai-brand` | `#0c0e10` |
| `--omai-focus-ring` | Focus ring outline color | `var(--omai-brand)` |

### Semantic Status

| Token | Soft Variant Token | Description | Tokyo Night Default |
|---|---|---|---|
| `--omai-success` | `--omai-success-soft` | Success status, passing tests | ANSI Green (`#9ece6a`) |
| `--omai-warning` | `--omai-warning-soft` | Warning status, cautions | ANSI Yellow (`#e0af68`) |
| `--omai-danger` | `--omai-danger-soft` | Error status, destructives | ANSI Red (`#f7768e`) |
| `--omai-info` | `--omai-info-soft` | Informational status, tips | ANSI Blue (`#7aa2f7`) |

### Hero Pixel-Field Ramp

Directly powers the omarchy.org canvas hero pixel field (`PixelField` component):

| Token | Description | Tokyo Night Default |
|---|---|---|
| `--omai-field-bg` | Grid background cell color | `#0e0e14` |
| `--omai-field-dim` | Dim level pixel activation | `#39482e` |
| `--omai-field-mid` | Mid level pixel activation | `#678549` |
| `--omai-field-lit` | Lit level pixel activation | `#9ece6a` |
| `--omai-field-hover` | Hover state near pointer | `#bbdd97` |
| `--omai-field-crest` | Crest of wave animation | `#daecc6` |

### ANSI 16-Color Terminal Palette

Authentic 16-color ANSI palettes for terminals, log viewers, and `btop`-style visualizers:

| Token Range | Description | Tokyo Night Defaults |
|---|---|---|
| `--omai-ansi-0` .. `--omai-ansi-7` | Standard black, red, green, yellow, blue, magenta, cyan, white | `#15161e`, `#f7768e`, `#9ece6a`, `#e0af68`, `#7aa2f7`, `#bb9af7`, `#7dcfff`, `#a9b1d6` |
| `--omai-ansi-8` .. `--omai-ansi-15` | High-intensity / bright counterparts | `#414868`, `#f7768e`, `#9ece6a`, `#e0af68`, `#7aa2f7`, `#bb9af7`, `#7dcfff`, `#c0caf5` |

### Typography

| Token | Value | Role |
|---|---|---|
| `--omai-font-sans` | `"Geist Variable", "Geist", system-ui, sans-serif` | Headings (`h1`–`h6`), table headers (`th`), display metrics |
| `--omai-font-mono` | `"JetBrains Mono Variable", "JetBrains Mono", monospace` | Body copy, UI labels, buttons, navigation, code, inputs |
| `--omai-text-2xs` | `0.6875rem` (11px) | Badges, status pills, Waybar indicators |
| `--omai-text-xs` | `0.75rem` (12px) | Captions, toast details, secondary metrics |
| `--omai-text-sm` | `0.875rem` (14px) | Default UI controls, button labels, table body |
| `--omai-text-base` | `1rem` (16px) | Standard reading size |
| `--omai-text-lg` | `1.125rem` (18px) | Subheadings, card titles |
| `--omai-text-xl` | `1.25rem` (20px) | Modal headers, dialog titles |
| `--omai-text-2xl` | `1.5rem` (24px) | Section headings (`h2`) |
| `--omai-text-3xl` | `1.875rem` (30px) | Hero titles (`h1`), display metrics |
| `--omai-text-4xl` | `2.25rem` (36px) | Page display titles |
| `--omai-text-6xl` | `3.75rem` (60px) | Giant hero display banners |
| `--omai-text-prose` | `0.9375rem` (15px) | Optimized prose reading size (line-height 1.65) |
| `--omai-leading-*` | `none (1)`, `tight (1.25)`, `snug (1.375)`, `normal (1.5)`, `relaxed (1.625)`, `prose (1.65)` | Line-height scale |
| `--omai-tracking-*`| `tight (-0.025em)`, `normal (0)`, `wide (0.025em)`, `wider (0.05em)`, `widest (0.1em)` | Letter-spacing scale |
| `--omai-weight-*`  | `regular (400)`, `medium (500)`, `semibold (600)`, `bold (700)` | Font weight scale |

### Spacing & Layout

- **Grid Unit**: `--omai-space-unit: 0.25rem` (4px base grid).
- **Scale**: `--omai-space-1` (4px), `--omai-space-2` (8px), `--omai-space-3` (12px), `--omai-space-4` (16px), `--omai-space-5` (20px), `--omai-space-6` (24px), `--omai-space-8` (32px), `--omai-space-10` (40px), `--omai-space-12` (48px), `--omai-space-16` (64px).
- **Control Heights**:
  - `--omai-control-h-sm`: `2rem` (32px)
  - `--omai-control-h-md`: `2.5rem` (40px)
  - `--omai-control-h-lg`: `3rem` (48px)
- **Application Heights**:
  - `--omai-topbar-height`: `3.5rem` (56px)
  - `--omai-waybar-height`: `26px` (exact Omarchy OS Waybar height)
  - `--omai-container-max`: `72rem` (1152px)
  - `--omai-measure`: `48rem` (768px reading line measure)

### Geometry & Hyprland Modes

| Token | Default (`sharp`) | `soft` Mode |
|---|:---:|:---:|
| `--omai-radius-xs` | `0px` | `2px` |
| `--omai-radius-sm` | `0px` | `4px` |
| `--omai-radius-md` | `0px` | `6px` |
| `--omai-radius-lg` | `0px` | `8px` |
| `--omai-radius-xl` | `0px` | `12px` |
| `--omai-radius-full` | `0px` | `9999px` |

| Token | Default (`default`) | `none` Mode | `wide` Mode |
|---|:---:|:---:|:---:|
| `--omai-gap-in` | `5px` | `0px` | `10px` |
| `--omai-gap-out` | `10px` | `0px` | `20px` |

- `--omai-border-width`: `1px` (razor hairline)
- `--omai-border-active-width`: `2px` (active Hyprland window border / focused pane)
- `--omai-inactive-opacity`: `0.96` (subtle dimming on unfocused Hyprland window panes)

### Elevation & Overlays

| Token | Dark Mode Default | Light Mode Default |
|---|---|---|
| `--omai-elevation` | `0 0 0 1px oklch(100% 0 0 / .07)` | Luminous hairline + soft ambient drop shadow |
| `--omai-elevation-hover` | `0 0 0 1px oklch(100% 0 0 / .13)` | Luminous hairline + elevated drop shadow |
| `--omai-elevation-overlay` | `0 0 0 1px oklch(100% 0 0 / .1), 0 16px 48px -12px oklch(0% 0 0 / .7)` | High-contrast floating elevation for Dialogs, Walker, Toasts |

### Motion & Interaction

- `--omai-duration-fast`: `100ms`
- `--omai-duration`: `150ms` (standard transition duration)
- `--omai-duration-slow`: `200ms`
- `--omai-ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)`
- `--omai-ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)`
- `--omai-press-scale`: `0.96` (tactile button press feedback)
- *Respects `prefers-reduced-motion`*: automatically collapses durations to `0ms` and press scale to `1`.

### Z-Index Scale

- `--omai-z-sticky`: `100`
- `--omai-z-dropdown`: `1000`
- `--omai-z-overlay`: `1100`
- `--omai-z-modal`: `1200`
- `--omai-z-popover`: `1300`
- `--omai-z-toast`: `1400`
- `--omai-z-tooltip`: `1500`

---

## License

OMAI Personal Non-Commercial Source-Available License (v1.0) © 2026 [jseramn](https://github.com/jseramn/omai).

Free for personal, non-commercial use. No commercial use or redistribution without permission. See [LICENSE](./LICENSE) and [NOTICE.md](./NOTICE.md) for upstream MIT attributions to Omarchy.
