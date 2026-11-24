import { useState } from 'react';
import { getTheme, type OmaiThemeId, themeToCssVars, tokyoNight } from '@jseramn/omai-tokens';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CodeBlock,
  Input,
  OmaiProvider,
  type OmaiGaps,
  type OmaiRadius,
  Progress,
  Select,
  Switch,
  ThemeSwitcher,
  useOmaiTheme,
} from '@jseramn/omai';
import { Check, Copy, Layers, Palette, Sliders, Terminal as TerminalIcon, Type } from 'lucide-react';
import {
  ANSI_LABELS,
  DEFAULT_SCOPED_THEMES,
  FIELD_TOKENS,
  STATUS_TOKENS,
  SURFACE_TOKENS,
} from '../data/catalogMeta';

function ScopedPreviewCard({
  scopeIndex,
  selectedTheme,
  onSelectTheme,
}: {
  scopeIndex: number;
  selectedTheme: OmaiThemeId;
  onSelectTheme: (id: OmaiThemeId) => void;
}) {
  const { themes } = useOmaiTheme();
  const [scopeRadius, setScopeRadius] = useState<OmaiRadius>(
    scopeIndex === 1 ? 'soft' : 'sharp',
  );
  const [notificationsOn, setNotificationsOn] = useState(true);
  const themeObj = getTheme(selectedTheme) ?? tokyoNight;

  return (
    <OmaiProvider
      target="scope"
      storageKey={null}
      theme={selectedTheme}
      radius={scopeRadius}
      className="border border-omai-border-strong bg-omai-bg p-4 rounded-omai-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-omai-border-subtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="brand" size="sm" dot>
              Scope #{scopeIndex + 1}
            </Badge>
            <Badge tone={themeObj.mode === 'light' ? 'warning' : 'info'} variant="outline" size="sm">
              {themeObj.mode}
            </Badge>
          </div>
          <h4 className="mt-1 font-sans text-base font-semibold text-omai-text">
            {themeObj.name}
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          <Select
            size="sm"
            aria-label={`Select theme for scope ${scopeIndex + 1}`}
            value={selectedTheme}
            onChange={(e) => onSelectTheme(e.target.value as OmaiThemeId)}
            options={themes.map((t) => ({
              value: t.id,
              label: `${t.name} (${t.mode})`,
            }))}
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setScopeRadius((r) => (r === 'sharp' ? 'soft' : 'sharp'))}
          >
            {scopeRadius}
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div className="border border-omai-border-subtle bg-omai-surface p-3 rounded-omai-md">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-omai-text-secondary">
              data-omai-theme=&quot;{selectedTheme}&quot;
            </span>
            <span className="font-mono text-omai-brand">{themeObj.colors.brand}</span>
          </div>
          <div className="mt-2.5">
            <Input
              size="sm"
              defaultValue={`hyprctl dispatch workspace ${scopeIndex + 1}`}
              aria-label={`Command input in scope ${scopeIndex + 1}`}
            />
          </div>
          <div className="mt-2.5">
            <Progress
              variant="blocks"
              segments={16}
              value={62 + scopeIndex * 14}
              tone="brand"
              label="VRAM Allocation"
              showValue
            />
          </div>
        </div>

        <Alert
          tone={scopeIndex === 0 ? 'brand' : scopeIndex === 1 ? 'info' : 'success'}
          title="Isolated CSS Cascade"
        >
          Derived <code className="text-omai-text">color-mix()</code> tokens recompute inside this
          subtree.
        </Alert>

        <div className="flex items-center justify-between pt-1">
          <Switch
            size="sm"
            checked={notificationsOn}
            onCheckedChange={setNotificationsOn}
            label="Mako Daemon"
          />
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="ghost">
              Inspect
            </Button>
            <Button size="sm" variant="primary">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </OmaiProvider>
  );
}

export function FoundationsSection() {
  const { theme, meta, radius, setRadius, gaps, setGaps } = useOmaiTheme();
  const activeThemeObj = getTheme(theme) ?? tokyoNight;
  const activeCssVars = themeToCssVars(activeThemeObj);

  const [scopedThemes, setScopedThemes] = useState<[OmaiThemeId, OmaiThemeId, OmaiThemeId]>([
    DEFAULT_SCOPED_THEMES[0],
    DEFAULT_SCOPED_THEMES[1],
    DEFAULT_SCOPED_THEMES[2],
  ]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyTokenName = (token: string) => {
    void navigator.clipboard?.writeText(`var(${token})`);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken((curr) => (curr === token ? null : curr)), 1600);
  };

  const updateScopedTheme = (idx: 0 | 1 | 2, nextId: OmaiThemeId) => {
    setScopedThemes((prev) => {
      const copy: [OmaiThemeId, OmaiThemeId, OmaiThemeId] = [prev[0], prev[1], prev[2]];
      copy[idx] = nextId;
      return copy;
    });
  };

  return (
    <section
      id="foundations"
      aria-labelledby="foundations-heading"
      className="border-b border-omai-border-subtle bg-omai-bg py-14"
    >
      <div className="mx-auto max-w-omai px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-omai-border-subtle pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="brand" size="sm">
                SECTION 02 // FOUNDATIONS &amp; THEMES
              </Badge>
              <Badge tone="neutral" variant="outline" size="sm">
                13 Dark · 3 Light · CSS Custom Properties
              </Badge>
            </div>
            <h2
              id="foundations-heading"
              className="mt-2 font-sans text-2xl font-semibold tracking-tight text-omai-text sm:text-3xl"
            >
              16 Official Themes &amp; Token Architecture
            </h2>
            <p className="mt-1 max-w-2xl font-mono text-xs text-omai-text-secondary sm:text-sm">
              Every OMAI theme originates from an authentic <code className="text-omai-brand">colors.toml</code>{' '}
              palette and compiles to pure CSS custom properties under{' '}
              <code className="text-omai-text">[data-omai-theme]</code>.
            </p>
          </div>

          {/* Geometry & Hyprland Gap Mode Controls */}
          <div className="flex flex-wrap items-center gap-2 border border-omai-border-subtle bg-omai-surface p-2 rounded-omai-md">
            <div className="flex items-center gap-1 pr-2">
              <Sliders size={14} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
              <span className="font-mono text-xs text-omai-text-secondary">Radius:</span>
              {(['sharp', 'soft'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  aria-pressed={radius === r}
                  className="border border-omai-border-subtle bg-omai-bg px-2 py-0.5 font-mono text-xs text-omai-text hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border-l border-omai-border-subtle pl-2">
              <span className="font-mono text-xs text-omai-text-secondary">Gaps:</span>
              {(['default', 'none', 'wide'] as readonly OmaiGaps[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGaps(g)}
                  aria-pressed={gaps === g}
                  className="border border-omai-border-subtle bg-omai-bg px-2 py-0.5 font-mono text-xs text-omai-text hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. Full 16-Theme Gallery (<ThemeSwitcher />) */}
        <div className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Palette size={16} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
              <h3 className="font-sans text-lg font-semibold text-omai-text">
                Interactive 16-Theme Gallery
              </h3>
            </div>
            <span className="font-mono text-xs text-omai-text-muted">
              Active: <strong className="text-omai-brand">{meta.name}</strong> ({meta.id}) · Use Arrow
              keys or click any tile
            </span>
          </div>

          <Card variant="surface" padding="md">
            <ThemeSwitcher
              variant="grid"
              columns={4}
              showRadiusToggle
              showModeLabel
            />
          </Card>
        </div>

        {/* 2. Live Scoped Nesting Demo (<OmaiProvider target="scope">) */}
        <div className="mt-12 border-t border-omai-border-subtle pt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers size={16} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
                <h3 className="font-sans text-lg font-semibold text-omai-text">
                  Scoped Subtree Theme Nesting (3 Themes Side-by-Side)
                </h3>
              </div>
              <p className="mt-1 font-mono text-xs text-omai-text-secondary">
                Each column below wraps its children in{' '}
                <code className="bg-omai-surface-2 px-1 text-omai-brand">
                  &lt;OmaiProvider target=&quot;scope&quot;&gt;
                </code>
                . Dark and light themes coexist on the same page with zero global leak.
              </p>
            </div>
            <Badge tone="info" variant="soft" size="sm">
              Simultaneous Multi-Theme Rendering
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {([0, 1, 2] as const).map((idx) => (
              <ScopedPreviewCard
                key={idx}
                scopeIndex={idx}
                selectedTheme={scopedThemes[idx]}
                onSelectTheme={(nextId) => updateScopedTheme(idx, nextId)}
              />
            ))}
          </div>

          <div className="mt-4">
            <CodeBlock
              title="ScopedThemeNesting.tsx"
              language="tsx"
              code={`<div className="grid grid-cols-3 gap-4">
  <OmaiProvider target="scope" theme="tokyo-night" storageKey={null}>
    <WorkspaceCard />
  </OmaiProvider>
  <OmaiProvider target="scope" theme="catppuccin-latte" radius="soft" storageKey={null}>
    <WorkspaceCard />
  </OmaiProvider>
  <OmaiProvider target="scope" theme="matte-black" storageKey={null}>
    <WorkspaceCard />
  </OmaiProvider>
</div>`}
            />
          </div>
        </div>

        {/* 3. Live Token Swatches (Surfaces, Text, Brand, Status, PixelField, ANSI 16) */}
        <div className="mt-12 border-t border-omai-border-subtle pt-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="font-sans text-lg font-semibold text-omai-text">
                Live Token Inspector — {activeThemeObj.name} ({activeThemeObj.mode})
              </h3>
              <p className="mt-0.5 font-mono text-xs text-omai-text-secondary">
                Click any token row to copy <code className="text-omai-brand">var(--omai-*)</code> to
                your clipboard. All swatches reflect the active theme live.
              </p>
            </div>
            {copiedToken ? (
              <Badge tone="success" variant="solid" size="sm">
                Copied var({copiedToken})
              </Badge>
            ) : (
              <Badge tone="neutral" variant="outline" size="sm">
                Click any swatch to copy CSS var
              </Badge>
            )}
          </div>

          {/* Surface / Text / Brand Grid */}
          <div className="mb-8">
            <h4 className="mb-3 font-mono text-xs font-bold tracking-wider text-omai-text-secondary uppercase">
              3.1 Surfaces, Borders, Text &amp; Brand Accents
            </h4>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {SURFACE_TOKENS.map(({ token, role }) => {
                const rawVal = activeCssVars[token] ?? '';
                const isCopied = copiedToken === token;
                return (
                  <button
                    key={token}
                    type="button"
                    onClick={() => copyTokenName(token)}
                    className="group flex items-center gap-3 border border-omai-border-subtle bg-omai-surface p-2.5 text-left transition-colors hover:border-omai-border-strong hover:bg-omai-surface-2 rounded-omai-md"
                  >
                    <span
                      className="h-10 w-10 shrink-0 border border-omai-border-strong rounded-omai-sm"
                      style={{ background: `var(${token})` }}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-1">
                        <code className="truncate font-mono text-xs font-bold text-omai-text">
                          {token}
                        </code>
                        <span className="font-mono text-[11px] text-omai-brand">
                          {isCopied ? (
                            <Check size={12} strokeWidth={1.75} aria-hidden />
                          ) : (
                            <Copy
                              size={12}
                              strokeWidth={1.75}
                              className="opacity-50 group-hover:opacity-100"
                              aria-hidden
                            />
                          )}
                        </span>
                      </span>
                      <span className="block truncate font-mono text-[11px] text-omai-text-muted">
                        {rawVal}
                      </span>
                      <span className="mt-0.5 block truncate font-mono text-[11px] text-omai-text-secondary">
                        {role}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Semantic Status & PixelField Ramp */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h4 className="mb-3 font-mono text-xs font-bold tracking-wider text-omai-text-secondary uppercase">
                3.2 Semantic Status &amp; Soft Tints
              </h4>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {STATUS_TOKENS.map(({ token, softToken, label }) => (
                  <div
                    key={token}
                    className="border border-omai-border-subtle bg-omai-surface p-3 rounded-omai-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-omai-text">{label}</span>
                      <code className="font-mono text-[11px] text-omai-text-muted">
                        {activeCssVars[token]}
                      </code>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => copyTokenName(token)}
                        className="flex h-9 items-center justify-center border border-omai-border-strong px-2 font-mono text-[11px] font-bold text-omai-brand-ink rounded-omai-sm"
                        style={{ background: `var(${token})` }}
                      >
                        {token.replace('--omai-', '')}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyTokenName(softToken)}
                        className="flex h-9 items-center justify-center border border-omai-border-subtle px-2 font-mono text-[11px] font-bold rounded-omai-sm"
                        style={{
                          background: `var(${softToken})`,
                          color: `var(${token})`,
                        }}
                      >
                        {softToken.replace('--omai-', '')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-mono text-xs font-bold tracking-wider text-omai-text-secondary uppercase">
                3.3 Hero Pixel-Field Ramp (--omai-field-*)
              </h4>
              <div className="border border-omai-border-subtle bg-omai-surface p-3.5 rounded-omai-md">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
                  {FIELD_TOKENS.map(({ token, label }) => (
                    <button
                      key={token}
                      type="button"
                      onClick={() => copyTokenName(token)}
                      className="group flex flex-col border border-omai-border-subtle bg-omai-bg p-1.5 text-left hover:border-omai-brand rounded-omai-sm"
                    >
                      <span
                        className="h-10 w-full border border-omai-border-subtle"
                        style={{ background: `var(${token})` }}
                        aria-hidden="true"
                      />
                      <span className="mt-1.5 truncate font-mono text-[11px] font-bold text-omai-text">
                        {token.replace('--omai-field-', '')}
                      </span>
                      <span className="truncate font-mono text-[10px] text-omai-text-muted">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2.5 font-mono text-[11px] text-omai-text-secondary">
                  Used by <code className="text-omai-brand">&lt;PixelField /&gt;</code> via{' '}
                  <code className="text-omai-text">getComputedStyle()</code> +{' '}
                  <code className="text-omai-text">MutationObserver</code> on theme change.
                </p>
              </div>
            </div>
          </div>

          {/* ANSI 16-Color Terminal Grid */}
          <div className="mb-8">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TerminalIcon size={15} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
                <h4 className="font-mono text-xs font-bold tracking-wider text-omai-text-secondary uppercase">
                  3.4 ANSI 16-Color Terminal Palette (colors.toml color0..color15)
                </h4>
              </div>
              <span className="font-mono text-xs text-omai-text-muted">
                Powers Ghostty Terminal, btop meters &amp; syntax accents
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-8">
              {activeThemeObj.colors.ansi.map((hex, idx) => {
                const token = `--omai-ansi-${idx}`;
                return (
                  <button
                    key={token}
                    type="button"
                    onClick={() => copyTokenName(token)}
                    className="group flex flex-col border border-omai-border-subtle bg-omai-surface p-2 text-left transition-colors hover:border-omai-brand rounded-omai-sm"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="h-6 w-full border border-omai-border-subtle"
                        style={{ backgroundColor: `var(${token})` }}
                        aria-hidden="true"
                      />
                    </div>
                    <code className="mt-1.5 font-mono text-[11px] font-bold text-omai-text">
                      {token}
                    </code>
                    <div className="flex items-center justify-between font-mono text-[10px] text-omai-text-muted">
                      <span>{ANSI_LABELS[idx]}</span>
                      <span className="text-omai-text-secondary">{hex}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Scale & Geometry / Elevation */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card variant="surface" padding="md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Type size={16} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
                    3.5 Typography Pairing
                  </CardTitle>
                  <Badge tone="brand" size="sm">
                    Geist + JetBrains Mono
                  </Badge>
                </div>
                <CardDescription>
                  <code className="text-omai-text">--omai-font-sans</code> is reserved strictly for
                  headings &amp; display. Body copy, controls, badges, and tables use{' '}
                  <code className="text-omai-text">--omai-font-mono</code>.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-4 space-y-3 border-t border-omai-border-subtle pt-4">
                <div className="flex items-baseline justify-between gap-4 border-b border-omai-border-subtle pb-2">
                  <span className="font-mono text-xs text-omai-text-muted">--omai-text-3xl (30px)</span>
                  <span className="font-sans text-2xl font-medium tracking-tight text-omai-text sm:text-3xl">
                    Geist Display Heading
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-omai-border-subtle pb-2">
                  <span className="font-mono text-xs text-omai-text-muted">--omai-text-xl (20px)</span>
                  <span className="font-sans text-xl font-semibold tracking-tight text-omai-text">
                    Section Title H2 / H3
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-omai-border-subtle pb-2">
                  <span className="font-mono text-xs text-omai-text-muted">--omai-text-sm (14px)</span>
                  <span className="font-mono text-sm text-omai-text">
                    JetBrains Mono default UI control &amp; body
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs text-omai-text-muted">--omai-text-2xs (11px)</span>
                  <span className="font-mono text-[11px] font-bold tracking-wider text-omai-brand uppercase">
                    WAYBAR MODULE · STATUS BADGE · PILL
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card variant="surface" padding="md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sliders size={16} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
                    3.6 Geometry, Radius &amp; Hyprland Gaps
                  </CardTitle>
                  <Badge tone="info" size="sm">
                    {radius} · gaps: {gaps}
                  </Badge>
                </div>
                <CardDescription>
                  Default <code className="text-omai-text">sharp</code> sets all radii to{' '}
                  <code className="text-omai-brand">0px</code>. Switching to{' '}
                  <code className="text-omai-text">soft</code> activates Hyprland 2/4/6/8/12px
                  rounding.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-4 space-y-4 border-t border-omai-border-subtle pt-4">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {(
                    [
                      ['xs', '2px', 'rounded-omai-xs'],
                      ['sm', '4px', 'rounded-omai-sm'],
                      ['md', '6px', 'rounded-omai-md'],
                      ['lg', '8px', 'rounded-omai-lg'],
                      ['xl', '12px', 'rounded-omai-xl'],
                      ['full', '9999px', 'rounded-omai-full'],
                    ] as const
                  ).map(([scale, softPx, cls]) => (
                    <div
                      key={scale}
                      className={`flex flex-col items-center justify-center border border-omai-brand bg-omai-surface-2 p-2.5 text-center ${cls}`}
                    >
                      <code className="font-mono text-xs font-bold text-omai-text">{scale}</code>
                      <span className="font-mono text-[10px] text-omai-text-muted">
                        {radius === 'sharp' ? '0px' : softPx}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Live Hyprland gap box visualizer */}
                <div
                  className="border border-omai-border-strong bg-omai-bg-deep"
                  style={{ padding: 'var(--omai-gap-out)' }}
                >
                  <div
                    className="grid grid-cols-3"
                    style={{ gap: 'var(--omai-gap-in)' }}
                  >
                    <div className="border-2 border-omai-brand bg-omai-surface p-2 font-mono text-[11px] text-omai-brand rounded-omai-sm">
                      active (2px brand)
                    </div>
                    <div className="border border-omai-border-strong bg-omai-surface p-2 font-mono text-[11px] text-omai-text-secondary rounded-omai-sm">
                      gap_in: var(--omai-gap-in)
                    </div>
                    <div className="border border-omai-border-strong bg-omai-surface p-2 font-mono text-[11px] text-omai-text-secondary rounded-omai-sm">
                      gap_out: var(--omai-gap-out)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
