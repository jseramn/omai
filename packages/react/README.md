# @jseramn/omai

> **OMAI (Omarchy Based Agent Interface)** — Razor-sharp, keyboard-first React 19 component library created by [jseramn](https://github.com/jseramn/omai), inspired by [omarchy.org](https://omarchy.org) and [Omarchy OS](https://learn.omarchy.org) (MIT License).

[![npm version](https://img.shields.io/badge/npm-0.1.0-blue.svg)](https://www.npmjs.com/package/@jseramn/omai)
[![peer dependencies](https://img.shields.io/badge/react-19.x-61dafb.svg)](https://react.dev)
[![license](https://img.shields.io/badge/license-Source--Available-orange.svg)](https://github.com/jseramn/omai/blob/main/LICENSE)

`@jseramn/omai` delivers 40 authentic, accessible, and robust UI components built on modern React 19 primitives. Inspired by the Omarchy visual language (Geist sans headings, JetBrains Mono body typography, razor-sharp `0px` borders, 1px hairlines) and desktop ergonomics (Hyprland tiling grids, 26px Waybars, Walker command palettes, Mako toast decks, and Ghostty terminals).

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Theme Provider & SSR Setup](#theme-provider--ssr-setup)
  - [OmaiProvider](#omaiprovider)
  - [useOmaiTheme Hook](#useomaitheme-hook)
  - [SSR / Zero-Flash Script](#ssr--zero-flash-script)
  - [Scoped Themes](#scoped-themes)
- [Component Catalog (40 Components)](#component-catalog-40-components)
  - [1. Theme & Provider](#1-theme--provider)
  - [2. Primitives (9)](#2-primitives-9)
  - [3. Forms (8)](#3-forms-8)
  - [4. Feedback & Overlays (7)](#4-feedback--overlays-7)
  - [5. Navigation (4)](#5-navigation-4)
  - [6. Data Display (4)](#6-data-display-4)
  - [7. OMAI Desktop Signature (8)](#7-omai-desktop-signature-8)
- [Styling Model & Customization](#styling-model--customization)
  - [CSS Layer Architecture](#css-layer-architecture)
  - [Tailwind CSS v4 Integration](#tailwind-css-v4-integration)
- [Keyboard & Accessibility Guarantees](#keyboard--accessibility-guarantees)
- [License](#license)

---

## Features

- **Built for React 19**: Clean native `ref` forwarding (no `forwardRef` wrappers), modern event handling, and full SSR compatibility (`"use client"` bundle banner).
- **Zero Headless bloat**: Implemented cleanly from first principles using native HTML elements (`<select>`, `<input type="range">`) and lightweight internal focus/floating utilities.
- **Razor Sharp by Default**: Follows omarchy.org with `0px` corner radius by default; switches seamlessly to soft rounded corners with `data-omai-radius="soft"`.
- **Omarchy OS Desktop Signature**: Includes Hyprland `TilingGrid` & `WindowPane`, `Waybar`, `Walker` launcher, `Terminal` with ANSI parsing, `Mako`-style stacked `Toast`, and the omarchy.org canvas `PixelField`.
- **CSS Layers**: All classes are emitted inside `@layer components`, allowing Tailwind v4 utilities or custom unlayered CSS to override styles effortlessly with zero `!important`.
- **Keyboard-First & Accessible**: Comprehensive WAI-ARIA compliance, roving tabindex, focus trapping, Escape dismissals, and visible high-contrast `:focus-visible` rings.

---

## Installation

```bash
npm install @jseramn/omai @jseramn/omai-tokens
```

Peer dependencies:
```bash
npm install react@^19.0.0 react-dom@^19.0.0
```

Recommended typography fonts:
```bash
npm install @fontsource-variable/geist @fontsource-variable/jetbrains-mono
```

---

## Quick Start

Import the required stylesheets into your application root (`main.tsx` or `App.tsx`):

```typescript
// 1. Recommended Fonts
import '@fontsource-variable/geist';
import '@fontsource-variable/jetbrains-mono';

// 2. Token & Component Styles
import '@jseramn/omai-tokens/tokens.css';
import '@jseramn/omai-tokens/themes.css';
import '@jseramn/omai/styles.css';

// 3. Optional element base defaults
import '@jseramn/omai-tokens/base.css';
```

Wrap your application in `OmaiProvider` and start using components:

```tsx
import React from 'react';
import { OmaiProvider, Button, Card, CardHeader, CardTitle, CardContent } from '@jseramn/omai';

export function App() {
  return (
    <OmaiProvider defaultTheme="tokyo-night" defaultRadius="sharp">
      <main className="p-8 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to OMAI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Razor-sharp design system built for speed, density, and precision.
            </p>
            <Button variant="primary">Get Started</Button>
          </CardContent>
        </Card>
      </main>
    </OmaiProvider>
  );
}
```

---

## Theme Provider & SSR Setup

### OmaiProvider

`OmaiProvider` manages active themes, radius modes, gap presets, and optional persistence to `localStorage`.

```tsx
<OmaiProvider
  theme="tokyo-night"          // Controlled theme id
  defaultTheme="tokyo-night"   // Initial theme (default: 'tokyo-night')
  onThemeChange={(id) => {}}   // Callback on theme change
  radius="sharp"               // Controlled radius ('sharp' | 'soft')
  defaultRadius="sharp"        // Initial radius (default: 'sharp')
  gaps="default"               // Controlled gaps ('default' | 'none' | 'wide')
  defaultGaps="default"        // Initial gaps (default: 'default')
  target="document"            // 'document' sets attrs on <html>; 'scope' wraps children in a <div>
  storageKey="omai-theme"   // localStorage key prefix (null disables persistence)
  transition="wipe"            // 'wipe' enables omarchy.org diagonal View Transition; 'none' is instant
>
  {children}
</OmaiProvider>
```

### useOmaiTheme Hook

Access or mutate the active theme anywhere in the component tree:

```tsx
import { useOmaiTheme } from '@jseramn/omai';

function ThemeControls() {
  const {
    theme,           // Current theme id (e.g. 'tokyo-night')
    mode,            // 'dark' | 'light'
    meta,            // OmaiThemeMeta (name, swatch, etc.)
    themes,          // List of all 16 theme metas
    setTheme,        // (id: OmaiThemeId) => void
    cycleTheme,      // (direction?: 1 | -1) => void
    radius,          // 'sharp' | 'soft'
    setRadius,       // (r: OmaiRadius) => void
    gaps,            // 'default' | 'none' | 'wide'
    setGaps,         // (g: OmaiGaps) => void
  } = useOmaiTheme();

  return (
    <div className="flex gap-2">
      <button onClick={() => cycleTheme(1)}>Next Theme ({meta.name})</button>
      <button onClick={() => setRadius(radius === 'sharp' ? 'soft' : 'sharp')}>
        Toggle Radius ({radius})
      </button>
    </div>
  );
}
```

*Note: Use `useOptionalOmaiTheme()` when consuming the context in components that might render outside a provider.*

### SSR / Zero-Flash Script

To prevent light/dark theme flashing on Next.js, Remix, Astro, or static HTML pages, render the inline initialization script inside your HTML `<head>`:

```tsx
import { getOmaiInitScript } from '@jseramn/omai';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: getOmaiInitScript({
              storageKey: 'omai-theme',
              defaultTheme: 'tokyo-night',
            }),
          }}
        />
      </head>
      <body>...</body>
    </html>
  );
}
```

### Scoped Themes

Isolate a theme to a specific card or section using `target="scope"`:

```tsx
<OmaiProvider target="scope" theme="flexoki-light">
  <div className="p-4 border">
    This box renders in light Flexoki mode, regardless of page-level dark theme.
  </div>
</OmaiProvider>
```

When rendering overlays (such as Dialog, Drawer, Tooltip, or DropdownMenu) through portals from inside a scoped container, portalled roots automatically receive `useOmaiPortalAttributes()`, preserving the scoped theme!

---

## Component Catalog (40 Components)

All components share common vocabulary props:
- `size`: `'sm' | 'md' | 'lg'` (default `'md'`)
- `tone`: `'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'`
- Standard HTML props (`className`, `style`, `ref`, etc.)

### 1. Theme & Provider

| Component | Description |
|---|---|
| `OmaiProvider` | Root or scoped context provider managing theme, radius, gaps, and persistence |
| `useOmaiTheme` | Context hook for reading and mutating theme state |
| `getOmaiInitScript` | Pre-paint no-flash inline script generator |

---

### 2. Primitives (9)

#### `Button`
Pressable action control with 5 variants, icon slots, and animated spinner loading state.
```tsx
import { Button } from '@jseramn/omai';
import { ArrowRight, Trash2 } from 'lucide-react';

<Button variant="primary" size="md">Save Changes</Button>
<Button variant="secondary" leadingIcon={<ArrowRight size={16} />}>Proceed</Button>
<Button variant="danger" leadingIcon={<Trash2 size={16} />}>Delete</Button>
<Button variant="outline" loading>Deploying</Button>
<Button variant="ghost">Cancel</Button>
```

#### `IconButton`
Square icon-only action button with required `aria-label`.
```tsx
import { IconButton } from '@jseramn/omai';
import { Settings } from 'lucide-react';

<IconButton icon={<Settings size={16} />} aria-label="Settings" variant="ghost" />
```

#### `Badge`
Compact status badge or tag with optional leading status dot.
```tsx
import { Badge } from '@jseramn/omai';

<Badge tone="success" variant="soft" dot>Online</Badge>
<Badge tone="warning" variant="solid">Warning</Badge>
<Badge tone="neutral" variant="outline">v0.1.0</Badge>
```

#### `Kbd`
Keyboard shortcut indicator.
```tsx
import { Kbd } from '@jseramn/omai';

<Kbd keys={['Ctrl', 'Shift', 'P']} />
<Kbd>Esc</Kbd>
```

#### `Card`
Surface container with optional elevation and structured sub-parts (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '@jseramn/omai';

<Card variant="surface" interactive>
  <CardHeader>
    <CardTitle>Cluster Alpha</CardTitle>
    <CardDescription>us-east-1 production cluster</CardDescription>
  </CardHeader>
  <CardContent>All 16 nodes healthy.</CardContent>
  <CardFooter>
    <Button size="sm">Manage</Button>
  </CardFooter>
</Card>
```

#### `Separator`
Hairline divider with optional decorative mono label.
```tsx
import { Separator } from '@jseramn/omai';

<Separator orientation="horizontal" />
<Separator label="OR CONTINUE WITH" />
```

#### `Avatar`
User/entity avatar with image loading, fallback initials, size scale (`xs` to `xl`), and status indicator.
```tsx
import { Avatar } from '@jseramn/omai';

<Avatar name="David Heinemeier" src="/dhh.png" size="md" status="online" />
<Avatar name="Linus Torvalds" size="lg" shape="circle" status="busy" />
```

#### `Skeleton`
Stepped block, text, or pixel-shimmer placeholder.
```tsx
import { Skeleton } from '@jseramn/omai';

<Skeleton variant="text" lines={3} />
<Skeleton variant="block" width="100%" height={200} />
<Skeleton variant="pixel" width={64} height={64} />
```

#### `Tooltip`
Portalled hover/focus balloon with shortcut badge support and collision awareness.
```tsx
import { Tooltip, IconButton } from '@jseramn/omai';
import { Copy } from 'lucide-react';

<Tooltip content="Copy command" shortcut={['Ctrl', 'C']} side="top">
  <IconButton icon={<Copy size={16} />} aria-label="Copy" />
</Tooltip>
```

---

### 3. Forms (8)

#### `FormField` & `Label`
Form control wrapper managing accessible labelling, helper descriptions, error alerts, and field IDs via context.
```tsx
import { FormField, Input } from '@jseramn/omai';

<FormField label="Cluster Host" description="Fully qualified domain name" error={errors.host} required>
  <Input placeholder="node1.omai.local" />
</FormField>
```

#### `Input`
Styled text input with optional leading/trailing icon adornments and error states.
```tsx
import { Input } from '@jseramn/omai';
import { Search } from 'lucide-react';

<Input leadingIcon={<Search size={16} />} placeholder="Search repositories..." size="md" />
```

#### `Textarea`
Multi-line text input supporting optional automatic vertical resizing.
```tsx
import { Textarea } from '@jseramn/omai';

<Textarea autoResize placeholder="Enter release notes..." rows={4} />
```

#### `Select`
Custom-styled native dropdown selector with custom chevron.
```tsx
import { Select } from '@jseramn/omai';

<Select
  options={[
    { value: 'us-east', label: 'US East (N. Virginia)' },
    { value: 'eu-central', label: 'EU (Frankfurt)' },
  ]}
  placeholder="Select region..."
/>
```

#### `Checkbox`
Accessible checkbox supporting checked, unchecked, and indeterminate states.
```tsx
import { Checkbox } from '@jseramn/omai';

<Checkbox label="Enable Hyprland tiling" description="Auto-split active panes" defaultChecked />
```

#### `Switch`
Accessible toggle switch with optional label.
```tsx
import { Switch } from '@jseramn/omai';

<Switch label="Reduced Motion" defaultChecked={false} />
```

#### `RadioGroup` & `RadioGroupItem`
Keyboard-navigable radio button group with full arrow key navigation.
```tsx
import { RadioGroup } from '@jseramn/omai';

<RadioGroup
  name="layout-mode"
  value={mode}
  onValueChange={setMode}
  options={[
    { value: 'dwindle', label: 'Dwindle', description: 'Spiral binary tree split' },
    { value: 'master', label: 'Master', description: 'Primary window on left' },
  ]}
/>
```

#### `Slider`
Range slider control with fill percentage indicator and value formatting.
```tsx
import { Slider } from '@jseramn/omai';

<Slider min={0} max={100} step={5} defaultValue={40} showValue formatValue={(v) => `${v}%`} />
```

---

### 4. Feedback & Overlays (7)

#### `Alert`
Notification banner supporting neutral, brand, success, warning, danger, and info tones with optional dismiss action.
```tsx
import { Alert } from '@jseramn/omai';

<Alert tone="danger" title="Deployment Failed" onDismiss={() => {}}>
  Container returned exit code 137 (OOMKilled).
</Alert>
```

#### `Toast` & `ToastProvider` (`useToast`)
Mako-inspired stacked toast deck with auto-dismiss progress, pause on hover, numbered action buttons, and keyboard shortcuts.
```tsx
import { ToastProvider, useToast, Button } from '@jseramn/omai';

function ActionButton() {
  const { toast } = useToast();

  const trigger = () => {
    toast({
      title: 'Build finished',
      description: 'Artifact uploaded to registry',
      tone: 'success',
      actions: [
        { label: 'View Logs', shortcut: '1', onClick: () => console.log('Logs') },
      ],
    });
  };

  return <Button onClick={trigger}>Trigger Notification</Button>;
}

// Wrap application inside ToastProvider:
<ToastProvider placement="top-right" duration={5000} max={5}>
  <ActionButton />
</ToastProvider>
```

#### `Dialog`
Modal dialog with focus trap, Esc-key handling, scroll locking, and portalled backdrop.
```tsx
import { Dialog, Button } from '@jseramn/omai';

<Dialog
  title="Purge Database"
  description="This operation cannot be undone."
  trigger={<Button variant="danger">Purge</Button>}
  footer={<Button variant="danger">Confirm Deletion</Button>}
>
  <p>All active sessions and cache records will be deleted immediately.</p>
</Dialog>
```

#### `Drawer`
Slide-out modal drawer supporting left, right, top, and bottom attachments.
```tsx
import { Drawer, Button } from '@jseramn/omai';

<Drawer side="right" title="System Monitor" trigger={<Button>Inspect</Button>}>
  <p>Real-time telemetry feeds...</p>
</Drawer>
```

#### `Popover`
Floating context card anchored to a trigger with collision detection and focus return.
```tsx
import { Popover, Button } from '@jseramn/omai';

<Popover trigger={<Button variant="secondary">Info</Button>}>
  <div className="p-3 text-sm">Detailed telemetry breakdown.</div>
</Popover>
```

#### `DropdownMenu`
WAI-ARIA compliant action menu supporting nested items, checkboxes, separators, keyboard navigation, and shortcuts.
```tsx
import { DropdownMenu, Button } from '@jseramn/omai';
import { Copy, Trash, Download } from 'lucide-react';

<DropdownMenu
  trigger={<Button>Options</Button>}
  items={[
    { id: 'copy', label: 'Copy ID', icon: <Copy size={14} />, shortcut: ['Ctrl', 'C'] },
    { id: 'download', label: 'Export JSON', icon: <Download size={14} /> },
    { type: 'separator' },
    { id: 'delete', label: 'Delete Record', icon: <Trash size={14} />, danger: true },
  ]}
/>
```

#### `Progress`
Progress indicator supporting continuous percentage bar or btop-style segmented blocks (`█▓▒░`).
```tsx
import { Progress } from '@jseramn/omai';

<Progress value={75} tone="brand" size="md" showValue />
<Progress variant="blocks" value={60} segments={20} tone="warning" label="CPU" showValue />
```

---

### 5. Navigation (4)

#### `Tabs`
Underline or boxed tab switcher with full keyboard arrow and Home/End support.
```tsx
import { Tabs } from '@jseramn/omai';

<Tabs
  variant="underline"
  defaultValue="overview"
  items={[
    { value: 'overview', label: 'Overview', content: <div>System stats</div> },
    { value: 'metrics', label: 'Metrics', content: <div>Performance graphs</div> },
    { value: 'logs', label: 'Logs', content: <div>Console log stream</div> },
  ]}
/>
```

#### `Breadcrumb`
Semantic path breadcrumb supporting middle-item collapsing and router link integration.
```tsx
import { Breadcrumb } from '@jseramn/omai';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Clusters', href: '/clusters' },
    { label: 'Cluster-01' },
  ]}
/>
```

#### `SidebarNav`
Multi-section navigation menu supporting active state indicators, badges, and icon-only rail collapse mode.
```tsx
import { SidebarNav } from '@jseramn/omai';
import { LayoutGrid, Cpu, HardDrive, TerminalSquare } from 'lucide-react';

<SidebarNav
  activeId="workspaces"
  sections={[
    {
      title: 'Environment',
      items: [
        { id: 'workspaces', label: 'Workspaces', icon: <LayoutGrid size={16} /> },
        { id: 'terminal', label: 'Terminals', icon: <TerminalSquare size={16} />, badge: '3' },
      ],
    },
    {
      title: 'Resources',
      items: [
        { id: 'compute', label: 'Compute', icon: <Cpu size={16} /> },
        { id: 'storage', label: 'Storage', icon: <HardDrive size={16} /> },
      ],
    },
  ]}
/>
```

#### `Pagination`
Accessible pagination control with configurable sibling and boundary counts.
```tsx
import { Pagination } from '@jseramn/omai';

<Pagination pageCount={24} page={currentPage} onPageChange={setCurrentPage} />
```

---

### 6. Data Display (4)

#### `Table`
Sortable tabular data grid supporting custom cell rendering, row selection, zebra striping, and compact density.
```tsx
import { Table, type TableColumn } from '@jseramn/omai';

interface Node { id: string; name: string; cpu: number; memory: string; status: string }

const columns: TableColumn<Node>[] = [
  { key: 'name', header: 'Node', sortable: true },
  { key: 'cpu', header: 'CPU %', sortable: true, mono: true },
  { key: 'memory', header: 'Memory', mono: true },
  { key: 'status', header: 'Status' },
];

<Table columns={columns} data={nodes} density="compact" striped />
```

#### `CodeBlock`
Code block container with filename header tab, line highlighting, and one-click copy button.
```tsx
import { CodeBlock } from '@jseramn/omai';

<CodeBlock
  title="config.toml"
  language="toml"
  code={`[hyprland]\ngaps_in = 5\ngaps_out = 10\nrounding = 0`}
  showLineNumbers
  highlightLines={[2, 3]}
/>
```

#### `StatCard`
Metric KPI card with delta direction, `btop`-style meter bar, and unicode sparklines (`▁▂▃▄▅▆▇█`).
```tsx
import { StatCard } from '@jseramn/omai';

<StatCard
  label="Memory Used"
  value="12.4"
  unit="GB"
  meter={78}
  delta={{ value: '+4.2%', direction: 'up', tone: 'warning' }}
  sparkline={[20, 35, 45, 52, 60, 68, 75, 78]}
/>
```

#### `KeyValueList`
Description list (`<dl>`) in horizontal or stacked layout with optional copy-to-clipboard buttons.
```tsx
import { KeyValueList } from '@jseramn/omai';

<KeyValueList
  items={[
    { key: 'host', label: 'Hostname', value: 'gateway.omai.internal', copyable: true },
    { key: 'ip', label: 'IPv4 Address', value: '10.0.4.15', mono: true, copyable: true },
    { key: 'uptime', label: 'Uptime', value: '42 days, 11 hours' },
  ]}
  divided
/>
```

---

### 7. OMAI Desktop Signature (8)

#### `Walker`
Omarchy OS Walker command palette (`Super+Space` / `Ctrl+K`) with fuzzy searching, grouped items, keyboard navigation, and custom action execution.
```tsx
import { Walker, useHotkey } from '@jseramn/omai';
import { Terminal, Settings, SunMoon } from 'lucide-react';

function Launcher() {
  const [open, setOpen] = useState(false);
  useHotkey('mod+k', () => setOpen((prev) => !prev));

  return (
    <Walker
      open={open}
      onOpenChange={setOpen}
      items={[
        { id: 'term', label: 'Open Terminal', group: 'Apps', icon: <Terminal size={16} /> },
        { id: 'settings', label: 'Open Settings', group: 'System', icon: <Settings size={16} /> },
        { id: 'theme', label: 'Switch Theme', group: 'Appearance', icon: <SunMoon size={16} /> },
      ]}
      onSelect={(item) => console.log('Selected:', item.id)}
    />
  );
}
```

#### `Waybar`
Authentic 26px Omarchy OS top status bar with modular sub-components:
- `WaybarLogo`: Pixel "O" glyph triggering the Omarchy menu
- `WaybarWorkspaces`: 1-10 workspace selector with active indicator
- `WaybarClock`: Monospace system clock with live updating date
- `WaybarLayoutIndicator`: Hyprland tiling layout icon (`■` dwindle, `●` scrolling, `▲` floating)
- `WaybarStat`: Audio, battery, memory, or network status module
- `WaybarModule`: Custom button module

```tsx
import {
  Waybar,
  WaybarLogo,
  WaybarWorkspaces,
  WaybarClock,
  WaybarLayoutIndicator,
  WaybarStat,
} from '@jseramn/omai';
import { Cpu, Wifi } from 'lucide-react';

<Waybar
  variant="opaque"
  left={
    <>
      <WaybarLogo />
      <WaybarWorkspaces active={1} occupied={[1, 2, 3]} />
    </>
  }
  center={<WaybarClock />}
  right={
    <>
      <WaybarStat icon={<Cpu size={12} />} value="24%" />
      <WaybarStat icon={<Wifi size={12} />} value="omai-5g" />
      <WaybarLayoutIndicator layout="dwindle" />
    </>
  }
/>
```

#### `TilingGrid` & `WindowPane`
Hyprland tiling window manager simulation supporting `dwindle`, `master`, `columns`, `rows`, and `grid` layouts. Panes feature 1px/2px active border highlighting, close actions, and keyboard navigation (`Alt+Arrows`).
```tsx
import { TilingGrid, WindowPane } from '@jseramn/omai';

<TilingGrid layout="dwindle" height={500} keyboard>
  <WindowPane id="editor" title="src/main.rs">
    <p>Code Editor Pane</p>
  </WindowPane>
  <WindowPane id="term" title="Ghostty Terminal">
    <p>Shell output</p>
  </WindowPane>
  <WindowPane id="monitor" title="btop">
    <p>Activity Monitor</p>
  </WindowPane>
</TilingGrid>
```

#### `Terminal`
Ghostty / Foot styled terminal window with command prompts, blinking cursors, typing animation, and SGR ANSI color parser.
```tsx
import { Terminal, type TerminalLine } from '@jseramn/omai';

const lines: TerminalLine[] = [
  { type: 'command', text: 'omai version' },
  { type: 'output', text: 'OMAI Agent Shell v0.1.0 (x86_64-linux)' },
  { type: 'command', text: 'cargo test' },
  { type: 'output', text: 'test result: ok. 48 passed; 0 failed;' },
];

<Terminal user="omai" host="workstation" cwd="~/projects/engine" lines={lines} typing />
```

#### `ThemeSwitcher`
Interactive theme picker displaying authentic live color swatches (background, surface, text, brand).
```tsx
import { ThemeSwitcher } from '@jseramn/omai';

<ThemeSwitcher variant="grid" columns={4} showRadiusToggle showModeLabel />
```

#### `HotkeyBar`
Monospace keyboard shortcut helper bar for footers or headers.
```tsx
import { HotkeyBar } from '@jseramn/omai';

<HotkeyBar
  items={[
    { keys: ['↑', '↓'], label: 'Navigate' },
    { keys: ['↵'], label: 'Select' },
    { keys: ['Esc'], label: 'Close' },
  ]}
/>
```

#### `PixelField`
Interactive hero canvas animation from [omarchy.org](https://omarchy.org), rendering wave, rain, or noise animations powered by the active theme's `--omai-field-*` tokens.
```tsx
import { PixelField } from '@jseramn/omai';

<PixelField pattern="wave" interactive height={320}>
  <div className="text-center">
    <h1 className="text-3xl font-sans font-semibold">OMAI</h1>
    <p className="text-sm font-mono text-om-text-secondary mt-2">
      Fast, dense, and beautiful Linux desktop experience.
    </p>
  </div>
</PixelField>
```

---

## Styling Model & Customization

### CSS Layer Architecture

All `@jseramn/omai` components emit plain CSS classes with the `omai-` prefix (`omai-button`, `omai-card`, `omai-dialog`, etc.).

All component rules are wrapped inside `@layer components`:

```css
@layer theme, base, components, utilities;

@layer components {
  .omai-button { ... }
}
```

This guarantees that:
1. **No specificity wars**: Any unlayered consumer CSS or utility class automatically overrides component styling without requiring `!important`.
2. **Predictable theming**: Every color rule is strictly bound to `var(--omai-*)` tokens.
3. **Data attributes for state**: Variants and states are driven by standard data attributes (`data-variant`, `data-size`, `data-tone`, `data-state="open|closed"`, `data-disabled`, `data-invalid`).

### Tailwind CSS v4 Integration

When used alongside Tailwind CSS v4 and `@jseramn/omai-tokens/tailwind.css`, you can apply Tailwind utility classes directly to any `@jseramn/omai` component:

```tsx
<Button className="w-full py-6 uppercase tracking-widest bg-om-ansi-5">
  Full Width Custom Action
</Button>
```

Because utilities live in `@layer utilities`, they override `.omai-button` rules seamlessly.

---

## Keyboard & Accessibility Guarantees

Every component in `@jseramn/omai` is built according to strict WAI-ARIA standards:

- **Visible Focus**: All interactive controls present high-contrast focus rings (`var(--omai-focus-ring)`) via `:focus-visible`.
- **Keyboard Navigation**:
  - `Walker` & `DropdownMenu`: Arrow Up / Arrow Down / Home / End / Enter / Escape.
  - `Tabs`: Arrow Left / Arrow Right (or Up / Down for vertical) with automatic or manual activation.
  - `RadioGroup`: Arrow navigation between options with value selection.
  - `Dialog` & `Drawer`: Traps Tab key within modal, closes on Escape, and returns focus to trigger element on close.
- **Portalled Themes**: Overlays render through `<Portal>` while automatically preserving the closest scoped theme via `useOmaiPortalAttributes()`.
- **Reduced Motion**: Automatically disables CSS transitions and transforms when `prefers-reduced-motion: reduce` is enabled.

---

## License

OMAI Personal Non-Commercial Source-Available License (v1.0) © 2026 [jseramn](https://github.com/jseramn/omai).

Free for personal, non-commercial use. No commercial use or redistribution without permission. See [LICENSE](./LICENSE) and [NOTICE.md](./NOTICE.md) for upstream MIT attributions to Omarchy.
