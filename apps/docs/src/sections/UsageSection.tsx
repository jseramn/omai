import { getOmaiInitScript } from '@jseramn/omai';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CodeBlock,
  KeyValueList,
} from '@jseramn/omai';
import { BookOpen, Code2, FileCode, Palette, Sparkles } from 'lucide-react';

const PLAIN_HTML_SNIPPET = `<!doctype html>
<html
  lang="en"
  data-omai-theme="tokyo-night"
  data-omai-mode="dark"
  data-omai-radius="sharp"
  data-omai-gaps="default"
>
  <head>
    <link rel="stylesheet" href="/node_modules/@jseramn/omai-tokens/dist/tokens.css" />
    <link rel="stylesheet" href="/node_modules/@jseramn/omai-tokens/dist/themes.css" />
    <link rel="stylesheet" href="/node_modules/@jseramn/omai-tokens/dist/base.css" />
  </head>
  <body style="background: var(--omai-bg); color: var(--omai-text); font-family: var(--omai-font-mono)">
    <section style="border: 1px solid var(--omai-border-subtle); background: var(--omai-surface); padding: 1.5rem">
      <h1 style="font-family: var(--omai-font-sans); color: var(--omai-brand)">OMAI Tokens</h1>
      <p>Switch themes at runtime by setting data-omai-theme on &lt;html&gt; or any subtree.</p>
    </section>
  </body>
</html>`;

const TAILWIND_V4_SNIPPET = `/* src/index.css */
@import "tailwindcss";
@import "@jseramn/omai-tokens/tailwind.css";

/* Consumer TSX using OMAI-bridged Tailwind v4 utilities: */
export function MetricBanner() {
  return (
    <div className="border border-omai-border-strong bg-omai-surface p-4 text-omai-text shadow-omai rounded-omai-md">
      <h2 className="font-sans text-lg font-semibold text-omai-brand">
        Tailwind v4 + OMAI @theme inline Bridge
      </h2>
      <p className="mt-1 font-mono text-xs text-omai-text-secondary omai-light:text-omai-text">
        Utilities sit in @layer utilities and cleanly override @layer components without !important.
      </p>
    </div>
  );
}`;

const REACT_TS_SNIPPET = `import '@fontsource-variable/geist';
import '@fontsource-variable/jetbrains-mono';
import '@jseramn/omai-tokens/tokens.css';
import '@jseramn/omai-tokens/themes.css';
import '@jseramn/omai-tokens/base.css';
import '@jseramn/omai/styles.css';

import {
  OmaiProvider,
  ToastProvider,
  getOmaiInitScript,
  useOmaiTheme,
  Button,
} from '@jseramn/omai';

// In SSR <head> or index.html to prevent theme/radius flash before hydration:
const headInitScript = getOmaiInitScript({
  storageKey: 'omai-theme',
  defaultTheme: 'tokyo-night',
});

export function RootApp() {
  return (
    <OmaiProvider defaultTheme="tokyo-night" defaultRadius="sharp" transition="wipe">
      <ToastProvider placement="top-right" max={5}>
        <Workspace />
      </ToastProvider>
    </OmaiProvider>
  );
}`;

const CUSTOM_THEME_SNIPPET = `import { type OmaiTheme, themeToCss, themeToCssVars } from '@jseramn/omai-tokens';

// Map your Omarchy ~/.config/omarchy/current/theme/colors.toml values:
export const customCyberTheme: OmaiTheme = {
  id: 'tokyo-night', // or register a custom theme block
  name: 'Custom Cyber',
  mode: 'dark',
  colors: {
    bgDeep: '#090a0f',
    bg: '#0e1017',
    surface: '#151824',
    surface2: '#1c2030',
    borderSubtle: '#1c2030',
    borderStrong: '#343b58',
    text: '#d5daf0',
    textSecondary: '#9aa5ce',
    textMuted: '#7882a8',
    brand: '#00f0ff',
    brandInk: '#090a0f',
    selection: '#22283e',
    success: '#73daca',
    warning: '#e0af68',
    danger: '#f7768e',
    info: '#7aa2f7',
    ansi: [
      '#10121a', '#f7768e', '#73daca', '#e0af68',
      '#7aa2f7', '#bb9af7', '#00f0ff', '#a9b1d6',
      '#414868', '#ff899d', '#7fe0d0', '#f0bf78',
      '#8ab2ff', '#c9aaff', '#55f6ff', '#d5daf0',
    ],
  },
};

// Generate a CSS rule block or inline CSS custom property map:
const cssBlock = themeToCss(customCyberTheme, '[data-omai-theme="custom-cyber"]');
const inlineVars = themeToCssVars(customCyberTheme);`;

export function UsageSection() {
  const initScriptString = getOmaiInitScript();

  return (
    <section
      id="usage"
      aria-labelledby="usage-heading"
      className="border-b border-omai-border-subtle bg-omai-bg-deep py-14"
    >
      <div className="mx-auto max-w-omai px-4 sm:px-6">
        {/* Section Header */}
        <div className="border-b border-omai-border-subtle pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand" size="sm">
              SECTION 06 // INTEGRATION &amp; USAGE GUIDE
            </Badge>
            <Badge tone="neutral" variant="outline" size="sm">
              Plain CSS · Tailwind v4 · React 19 · Custom Themes
            </Badge>
          </div>
          <h2
            id="usage-heading"
            className="mt-2 font-sans text-2xl font-semibold tracking-tight text-omai-text sm:text-3xl"
          >
            Getting Started &amp; Consumer Integration
          </h2>
          <p className="mt-1 max-w-3xl font-mono text-xs text-omai-text-secondary sm:text-sm">
            Adopt <code className="text-omai-brand">@jseramn/omai-tokens</code> standalone in any web stack
            or pair it with <code className="text-omai-brand">@jseramn/omai</code> and optional
            Tailwind CSS v4 utilities.
          </p>
        </div>

        {/* 4 Integration Guides Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 1. Plain HTML/CSS */}
          <Card variant="surface" padding="md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge tone="brand" size="sm">
                  01 // PLAIN HTML &amp; CSS
                </Badge>
                <FileCode size={16} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
              </div>
              <CardTitle className="mt-2 text-base">
                Standalone CSS Custom Properties (@jseramn/omai-tokens)
              </CardTitle>
              <CardDescription>
                Zero JavaScript required. Import <code className="text-omai-text">tokens.css</code>{' '}
                and <code className="text-omai-text">themes.css</code>, then set{' '}
                <code className="text-omai-text">data-omai-theme</code> on{' '}
                <code className="text-omai-text">&lt;html&gt;</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-3">
              <CodeBlock
                title="index.html"
                language="html"
                code={PLAIN_HTML_SNIPPET}
                showLineNumbers
                highlightLines={[4, 5, 6, 10, 11]}
              />
            </CardContent>
          </Card>

          {/* 2. Tailwind CSS v4 */}
          <Card variant="surface" padding="md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge tone="info" size="sm">
                  02 // TAILWIND CSS V4
                </Badge>
                <Sparkles size={16} strokeWidth={1.75} className="text-omai-info" aria-hidden />
              </div>
              <CardTitle className="mt-2 text-base">
                Tailwind v4 Bridge (@jseramn/omai-tokens/tailwind.css)
              </CardTitle>
              <CardDescription>
                Maps <code className="text-omai-text">--omai-*</code> variables via{' '}
                <code className="text-omai-text">@theme inline</code> and registers{' '}
                <code className="text-omai-text">omai-dark:</code> /{' '}
                <code className="text-omai-text">omai-light:</code> attribute variants.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-3">
              <CodeBlock
                title="src/index.css + MetricBanner.tsx"
                language="tsx"
                code={TAILWIND_V4_SNIPPET}
                showLineNumbers
                highlightLines={[2, 3, 8]}
              />
            </CardContent>
          </Card>

          {/* 3. React 19 + TypeScript + getOmaiInitScript */}
          <Card variant="surface" padding="md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge tone="success" size="sm">
                  03 // REACT 19 + TYPESCRIPT
                </Badge>
                <Code2 size={16} strokeWidth={1.75} className="text-omai-success" aria-hidden />
              </div>
              <CardTitle className="mt-2 text-base">
                React Provider &amp; No-Flash Init Script (@jseramn/omai)
              </CardTitle>
              <CardDescription>
                Wrap your tree in <code className="text-omai-text">&lt;OmaiProvider&gt;</code> and{' '}
                <code className="text-omai-text">&lt;ToastProvider&gt;</code>, and inject{' '}
                <code className="text-omai-text">getOmaiInitScript()</code> in{' '}
                <code className="text-omai-text">&lt;head&gt;</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-3 space-y-3">
              <CodeBlock
                title="src/App.tsx"
                language="tsx"
                code={REACT_TS_SNIPPET}
                showLineNumbers
                highlightLines={[17, 18, 24, 25]}
              />
              <CodeBlock
                title="getOmaiInitScript() output"
                language="javascript"
                code={initScriptString}
                wrap
              />
            </CardContent>
          </Card>

          {/* 4. Custom colors.toml Theme Creation */}
          <Card variant="surface" padding="md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge tone="warning" size="sm">
                  04 // CUSTOM COLORS.TOML THEME
                </Badge>
                <Palette size={16} strokeWidth={1.75} className="text-omai-warning" aria-hidden />
              </div>
              <CardTitle className="mt-2 text-base">
                Authoring Custom Themes with themeToCss()
              </CardTitle>
              <CardDescription>
                Author an <code className="text-omai-text">OmaiTheme</code> palette from any
                Omarchy <code className="text-omai-text">colors.toml</code> and compile all derived{' '}
                <code className="text-omai-text">color-mix()</code> variables automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-3">
              <CodeBlock
                title="customTheme.ts"
                language="ts"
                code={CUSTOM_THEME_SNIPPET}
                showLineNumbers
                highlightLines={[4, 34, 35]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Package Exports Reference Card */}
        <Card variant="surface" padding="md" className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen size={16} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
              Published Package Entrypoints &amp; CSS Layer Order
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-3">
            <KeyValueList
              items={[
                {
                  key: 'layer-order',
                  label: 'CSS Cascade Layers',
                  value: '@layer theme, base, components, utilities;',
                  mono: true,
                  copyable: true,
                },
                {
                  key: 'pkg-tokens',
                  label: '@jseramn/omai-tokens',
                  value: 'tokens.css · themes.css · base.css · tailwind.css · themeToCss()',
                  mono: true,
                  copyable: true,
                },
                {
                  key: 'pkg-react',
                  label: '@jseramn/omai',
                  value: 'styles.css · 40 Components · OmaiProvider · useOmaiTheme · useToast',
                  mono: true,
                  copyable: true,
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
