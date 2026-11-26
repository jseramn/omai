import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CodeBlock,
  Kbd,
  PixelField,
  type PixelFieldProps,
  useOmaiTheme,
  useToast,
} from '@jseramn/omai';
import {
  Bell,
  Code2,
  Command,
  Layers,
  LayoutGrid,
  Palette,
  Pause,
  Play,
  Sparkles,
  Terminal as TerminalIcon,
} from 'lucide-react';
import type { DocsSectionId } from '../data/catalogMeta';

export interface HeroSectionProps {
  onNavigateSection: (section: DocsSectionId) => void;
  onOpenWalker: () => void;
}

const QUICK_START_SNIPPET = `import '@fontsource-variable/geist';
import '@fontsource-variable/jetbrains-mono';
import '@jseramn/omai-tokens/tokens.css';
import '@jseramn/omai-tokens/themes.css';
import '@jseramn/omai-tokens/base.css';
import '@jseramn/omai/styles.css';

import { OmaiProvider, ToastProvider, Button, Waybar, TilingGrid, WindowPane } from '@jseramn/omai';`;

const PATTERNS: readonly NonNullable<PixelFieldProps['pattern']>[] = [
  'wave',
  'rain',
  'noise',
  'logo',
  'static',
];

export function HeroSection({ onNavigateSection, onOpenWalker }: HeroSectionProps) {
  const { theme, meta, themes, setTheme, radius, setRadius, gaps, setGaps } = useOmaiTheme();
  const { toast } = useToast();
  const [pattern, setPattern] = useState<NonNullable<PixelFieldProps['pattern']>>('wave');
  const [paused, setPaused] = useState(false);

  const fireWelcomeToast = () => {
    toast({
      appName: 'omai-notify',
      title: `Active theme: ${meta.name}`,
      description: `Mode: ${meta.mode} · Radius: ${radius} · Gaps: ${gaps}`,
      tone: 'brand',
      timestamp: new Date(),
      actions: [
        {
          label: 'Toggle Radius',
          shortcut: '1',
          onClick: () => setRadius(radius === 'sharp' ? 'soft' : 'sharp'),
        },
        {
          label: 'Explore Themes',
          shortcut: '2',
          onClick: () => onNavigateSection('foundations'),
        },
      ],
    });
  };

  return (
    <section
      id="overview"
      aria-labelledby="hero-heading"
      className="border-b border-omai-border-subtle bg-omai-bg-deep"
    >
      {/* Interactive PixelField Hero Canvas */}
      <div className="relative border-b border-omai-border-subtle">
        <PixelField
          pattern={pattern}
          paused={paused}
          height="auto"
          style={{ minHeight: '420px' }}
          cellSize={10}
          gap={2}
          interactive
          className="w-full"
        >
          <div className="mx-auto flex w-full max-w-omai flex-col items-center px-4 py-8 text-center sm:px-6">
            {/* Stepped Pixel Wordmark Banner */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 border border-omai-border-strong bg-omai-bg-deep/90 px-3 py-1.5 backdrop-blur-xs">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 bg-omai-brand"
              />
              <span className="font-mono text-xs font-bold tracking-widest text-omai-brand uppercase">
                OMAI // OMARCHY BASED AGENT INTERFACE // V0.1.0
              </span>
              <Badge tone="neutral" variant="outline" size="sm">
                {meta.name} ({meta.mode})
              </Badge>
            </div>

            <h1
              id="hero-heading"
              className="mt-5 max-w-3xl border border-omai-border-subtle bg-omai-bg-deep/92 px-5 py-4 font-sans text-2xl font-semibold tracking-tight text-omai-text sm:text-4xl"
            >
              Unix Tiling Precision Meets Modern Web Architecture.
            </h1>

            <p className="mt-3 max-w-2xl border border-omai-border-subtle bg-omai-bg-deep/90 px-4 py-2.5 font-mono text-xs leading-relaxed text-omai-text-secondary sm:text-sm">
              Inspired by <span className="text-omai-brand">omarchy.org</span> &amp;{' '}
              <span className="text-omai-text">Omarchy OS (MIT)</span>. Geist headings, JetBrains Mono UI,
              razor 0px corners, 1px hairline borders, 16 official <code className="text-omai-brand">colors.toml</code>{' '}
              palettes, and 40 keyboard-first React 19 components.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 font-mono text-sm">
              <a className="text-omai-brand underline underline-offset-4" href="https://github.com/jseramn/omai">View source on GitHub</a>
              <a className="text-omai-brand underline underline-offset-4" href="https://www.npmjs.com/package/@jseramn/omai">Install React components</a>
            </div>

            {/* Primary CTA Row */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <Button
                variant="primary"
                size="md"
                leadingIcon={<LayoutGrid size={16} strokeWidth={1.75} aria-hidden />}
                onClick={() => onNavigateSection('components')}
              >
                Browse 40 Components
              </Button>
              <Button
                variant="secondary"
                size="md"
                leadingIcon={<Command size={16} strokeWidth={1.75} aria-hidden />}
                trailingIcon={<Kbd keys={['Ctrl', 'K']} size="sm" />}
                onClick={onOpenWalker}
              >
                Walker Palette
              </Button>
              <Button
                variant="secondary"
                size="md"
                leadingIcon={<TerminalIcon size={16} strokeWidth={1.75} aria-hidden />}
                onClick={() => onNavigateSection('templates')}
              >
                Live Templates
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="border-omai-border-strong bg-omai-surface/95"
                leadingIcon={<Bell size={16} strokeWidth={1.75} aria-hidden />}
                onClick={fireWelcomeToast}
              >
                Test Mako Toast
              </Button>
            </div>
          </div>
        </PixelField>

        {/* PixelField Canvas Controls Bar */}
        <div className="border-t border-omai-border-subtle bg-omai-bg/95 px-4 py-2 sm:px-6">
          <div className="mx-auto flex max-w-omai flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-omai-text-muted">PIXELFIELD PATTERN:</span>
              {PATTERNS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPattern(p)}
                  aria-pressed={pattern === p}
                  className="border border-omai-border-subtle bg-omai-surface px-2 py-0.5 font-mono text-xs text-omai-text-secondary uppercase transition-colors hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                aria-pressed={paused}
                className="inline-flex items-center gap-1 border border-omai-border-subtle bg-omai-surface px-2 py-0.5 font-mono text-xs text-omai-text-secondary hover:bg-omai-surface-2 aria-pressed:border-omai-warning aria-pressed:text-omai-warning rounded-omai-sm"
              >
                {paused ? (
                  <>
                    <Play size={12} strokeWidth={1.75} aria-hidden /> Resume
                  </>
                ) : (
                  <>
                    <Pause size={12} strokeWidth={1.75} aria-hidden /> Pause
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRadius(radius === 'sharp' ? 'soft' : 'sharp')}
                className="border border-omai-border-strong bg-omai-surface px-2.5 py-0.5 font-mono text-xs text-omai-text hover:bg-omai-surface-2 rounded-omai-sm"
              >
                radius: <span className="text-omai-brand">{radius}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setGaps(gaps === 'default' ? 'wide' : gaps === 'wide' ? 'none' : 'default')
                }
                className="border border-omai-border-strong bg-omai-surface px-2.5 py-0.5 font-mono text-xs text-omai-text hover:bg-omai-surface-2 rounded-omai-sm"
              >
                gaps: <span className="text-omai-brand">{gaps}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live 16-Theme Quick-Switch Strip */}
      <div className="border-b border-omai-border-subtle bg-omai-bg px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-omai">
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Palette size={15} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
              <span className="font-mono text-xs font-bold tracking-wider text-omai-text uppercase">
                Instant 16-Theme Switcher (13 Dark · 3 Light)
              </span>
            </div>
            <span className="font-mono text-xs text-omai-text-muted">
              Zero runtime JS CSS rewrite — switches via{' '}
              <code className="bg-omai-surface-2 px-1 text-omai-text">
                data-omai-theme=&quot;{theme}&quot;
              </code>
            </span>
          </div>

          <div
            role="group"
            aria-label="Quick 16-theme switcher strip"
            className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 md:grid-cols-8"
          >
            {themes.map((t) => {
              const active = t.id === theme;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  aria-pressed={active}
                  className="group flex items-center justify-between gap-1.5 border border-omai-border-subtle bg-omai-surface px-2.5 py-1.5 text-left font-mono text-xs text-omai-text transition-colors hover:border-omai-border-strong hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft rounded-omai-sm"
                >
                  <span className="truncate font-medium">{t.name}</span>
                  <span
                    className="flex shrink-0 items-center gap-0.5 border border-omai-border-subtle p-0.5"
                    style={{ backgroundColor: t.swatch.bg }}
                    aria-hidden="true"
                  >
                    <span
                      className="inline-block h-2.5 w-2.5"
                      style={{ backgroundColor: t.swatch.brand }}
                    />
                    <span
                      className="inline-block h-2.5 w-2.5"
                      style={{ backgroundColor: t.swatch.text }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick-Start CodeBlock + Architecture Cards */}
      <div className="mx-auto max-w-omai px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-bold tracking-wider text-omai-text-secondary uppercase">
                Quick Start Installation
              </span>
              <Badge tone="brand" variant="soft" size="sm" dot>
                React 19 · Vite 8 · Tailwind v4 Optional
              </Badge>
            </div>
            <CodeBlock
              title="src/main.tsx"
              language="tsx"
              code={QUICK_START_SNIPPET}
              showLineNumbers
              highlightLines={[3, 4, 6, 8]}
            />
          </div>

          <div className="min-w-0 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-6">
            <Card variant="surface" padding="md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge tone="brand" size="sm">
                    01 // TOKENS
                  </Badge>
                  <Sparkles size={16} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
                </div>
                <CardTitle className="mt-2 text-base">@jseramn/omai-tokens</CardTitle>
                <CardDescription>
                  Every surface, semantic status, pixel-field ramp, and 16-color ANSI palette maps to
                  live <code className="text-omai-text">--omai-*</code> CSS custom properties.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="surface" padding="md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge tone="info" size="sm">
                    02 // CSS LAYERS
                  </Badge>
                  <Layers size={16} strokeWidth={1.75} className="text-omai-info" aria-hidden />
                </div>
                <CardTitle className="mt-2 text-base">Zero-Conflict Layers</CardTitle>
                <CardDescription>
                  Ships standalone <code className="text-omai-text">.omai-*</code> classes in{' '}
                  <code className="text-omai-text">@layer components</code>. Works with plain CSS or
                  Tailwind v4 utilities with zero <code className="text-omai-text">!important</code>.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="surface" padding="md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge tone="success" size="sm">
                    03 // HYPRLAND
                  </Badge>
                  <LayoutGrid size={16} strokeWidth={1.75} className="text-omai-success" aria-hidden />
                </div>
                <CardTitle className="mt-2 text-base">Tiling &amp; OS Chrome</CardTitle>
                <CardDescription>
                  First-class <code className="text-omai-text">Waybar</code>,{' '}
                  <code className="text-omai-text">Walker</code> command palette,{' '}
                  <code className="text-omai-text">TilingGrid</code> panes, Mako toasts, and Ghostty
                  ANSI terminals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="surface" padding="md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge tone="warning" size="sm">
                    04 // SCOPED
                  </Badge>
                  <Code2 size={16} strokeWidth={1.75} className="text-omai-warning" aria-hidden />
                </div>
                <CardTitle className="mt-2 text-base">Subtree Theme Nesting</CardTitle>
                <CardDescription>
                  Derived tokens recompute inside every theme block so{' '}
                  <code className="text-omai-text">&lt;OmaiProvider target=&quot;scope&quot;&gt;</code>{' '}
                  renders any theme inside another.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigateSection('foundations')}
                  className="font-mono text-xs font-medium text-omai-brand underline-offset-4 hover:underline"
                >
                  Inspect scoped theme nesting →
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
