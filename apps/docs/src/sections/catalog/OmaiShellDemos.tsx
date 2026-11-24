import { useState } from 'react';
import {
  Ansi,
  ansiToReact,
  Badge,
  Button,
  fuzzyMatch,
  HotkeyBar,
  Input,
  Kbd,
  PixelField,
  type PixelFieldProps,
  Terminal,
  type TerminalLine,
  ThemeSwitcher,
  TilingGrid,
  type TilingLayout,
  useOmaiTheme,
  useToast,
  Walker,
  type WalkerItem,
  Waybar,
  WaybarClock,
  WaybarLayoutIndicator,
  WaybarLogo,
  WaybarModule,
  WaybarStat,
  WaybarWorkspaces,
  WindowPane,
} from '@jseramn/omai';
import {
  Command,
  Cpu,
  LayoutGrid,
  Palette,
  Plus,
  RotateCcw,
  Sparkles,
  Terminal as TerminalIcon,
  Volume2,
  Wifi,
} from 'lucide-react';
import { DemoCard } from './DemoCard';

const GHOSTTY_DEMO_LINES: readonly TerminalLine[] = [
  { type: 'command', text: 'omai-fetch --palette --ansi' },
  {
    type: 'output',
    text: '\u001b[1;32m  ██████╗ ███╗   ███╗\u001b[0m  \u001b[1mOS:\u001b[0m OMAI Agent Shell x86_64',
  },
  {
    type: 'output',
    text: '\u001b[1;32m ██╔═══██╗████╗ ████║\u001b[0m  \u001b[1mWM:\u001b[0m Hyprland 0.48.0 (Wayland)',
  },
  {
    type: 'output',
    text: '\u001b[1;32m ██║   ██║██╔████╔██║\u001b[0m  \u001b[1mTerminal:\u001b[0m ghostty 1.1.2',
  },
  {
    type: 'output',
    text: '\u001b[1;32m ╚██████╔╝██║ ╚═╝ ██║\u001b[0m  \u001b[1mFont:\u001b[0m JetBrainsMono Nerd Font 14px',
  },
  { type: 'blank' },
  { type: 'command', text: 'npm test --workspaces' },
  {
    type: 'output',
    text: '\u001b[32m✓\u001b[0m @jseramn/omai-tokens (16 themes verified)  \u001b[32m✓\u001b[0m @jseramn/omai (40 components passed)',
  },
];

const TILING_LAYOUTS: readonly TilingLayout[] = ['dwindle', 'master', 'columns', 'rows', 'grid'];

export function OmaiShellDemos({ onOpenGlobalWalker }: { onOpenGlobalWalker: () => void }) {
  const { meta, cycleTheme, radius, setRadius, gaps, setGaps } = useOmaiTheme();
  const { toast } = useToast();

  // 33. Walker Demo state
  const [localWalkerOpen, setLocalWalkerOpen] = useState(false);
  const [fuzzyQuery, setFuzzyQuery] = useState('hypr');
  const fuzzyTarget = 'hyprland-workspace-dwindle';
  const fuzzyHit = fuzzyMatch(fuzzyQuery, fuzzyTarget);

  // 34. Waybar Demo state
  const [waybarVariant, setWaybarVariant] = useState<'opaque' | 'glassy' | 'clear'>('opaque');
  const [waybarWs, setWaybarWs] = useState(2);

  // 35 & 36. TilingGrid & WindowPane Demo state
  const [tilingLayout, setTilingLayout] = useState<TilingLayout>('dwindle');
  const [tilingGaps, setTilingGaps] = useState<'inherit' | 'none' | number>('inherit');
  const [activePaneId, setActivePaneId] = useState('pane-editor');
  const [panes, setPanes] = useState([
    { id: 'pane-editor', title: 'nvim // packages/react/src/index.ts', kind: 'editor' },
    { id: 'pane-term', title: 'ghostty // zsh ~/omai', kind: 'terminal' },
    { id: 'pane-btop', title: 'btop // system monitor', kind: 'btop' },
    { id: 'pane-logs', title: 'journalctl -u hyprland', kind: 'logs' },
  ]);

  // 37. Terminal Demo state
  const [cursorStyle, setCursorStyle] = useState<'block' | 'beam' | 'underline' | false>('block');
  const [typingAnim, setTypingAnim] = useState(false);
  const [typingRunKey, setTypingRunKey] = useState(0);

  // 38. ThemeSwitcher Demo state
  const [switcherVariant, setSwitcherVariant] = useState<'grid' | 'list' | 'compact' | 'select'>('compact');

  // 40. PixelField Demo state
  const [pfPattern, setPfPattern] = useState<NonNullable<PixelFieldProps['pattern']>>('logo');
  const [pfCellSize, setPfCellSize] = useState(10);

  const localWalkerItems: readonly WalkerItem[] = [
    {
      id: 'w-cycle',
      label: 'Cycle Next OMAI Theme',
      description: `Current: ${meta.name}`,
      group: 'Theme Actions',
      icon: <Palette size={15} strokeWidth={1.75} aria-hidden />,
      shortcut: ['Shift', 'T'],
      onSelect: () => cycleTheme(1),
    },
    {
      id: 'w-radius',
      label: `Toggle Corner Radius (currently ${radius})`,
      description: 'Switch between sharp 0px and Hyprland soft rounding',
      group: 'Theme Actions',
      shortcut: ['Shift', 'R'],
      onSelect: () => setRadius(radius === 'sharp' ? 'soft' : 'sharp'),
    },
    {
      id: 'w-toast',
      label: 'Send Test Mako Notification',
      group: 'System',
      shortcut: ['Shift', 'M'],
      onSelect: () =>
        toast({
          appName: 'walker',
          title: 'Command Executed from Walker Demo',
          tone: 'brand',
        }),
    },
  ];

  const resetPanes = () => {
    setPanes([
      { id: 'pane-editor', title: 'nvim // packages/react/src/index.ts', kind: 'editor' },
      { id: 'pane-term', title: 'ghostty // zsh ~/omai', kind: 'terminal' },
      { id: 'pane-btop', title: 'btop // system monitor', kind: 'btop' },
      { id: 'pane-logs', title: 'journalctl -u hyprland', kind: 'logs' },
    ]);
    setActivePaneId('pane-editor');
  };

  return (
    <div id="omai-os" className="scroll-mt-16 space-y-6">
      {/* 33. Walker Command Palette */}
      <DemoCard
        id="comp-walker"
        name="Walker"
        category="omai"
        cssClass=".omai-walker"
        tagline="OMAI Shell application & command launcher modal with fuzzyMatch scoring, bold brand character highlights, and HotkeyBar footer."
        defaultShowCode
        code={`<Walker
  open={open}
  onOpenChange={setOpen}
  hotkey="mod+k"
  placeholder="Type a command, component, or theme..."
  items={WALKER_ITEMS}
/>`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              leadingIcon={<Command size={16} strokeWidth={1.75} aria-hidden />}
              trailingIcon={<Kbd keys={['Ctrl', 'K']} size="sm" />}
              onClick={onOpenGlobalWalker}
            >
              Launch Global Docs Walker
            </Button>
            <Button
              variant="secondary"
              onClick={() => setLocalWalkerOpen(true)}
            >
              Open Sandbox Walker Modal
            </Button>
          </div>

          <Walker
            open={localWalkerOpen}
            onOpenChange={setLocalWalkerOpen}
            hotkey={false}
            title="Walker Sandbox Palette"
            placeholder="Filter sandbox commands..."
            items={localWalkerItems}
          />

          {/* Interactive fuzzyMatch() tester */}
          <div className="border border-omai-border-subtle bg-omai-surface p-3.5 rounded-omai-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-omai-text">
                Exported <code>fuzzyMatch(query, text)</code> Live Tester:
              </span>
              <Badge tone={fuzzyHit ? 'success' : 'danger'} size="sm">
                {fuzzyHit ? `Score: ${fuzzyHit.score}` : 'No Match'}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="w-56">
                <Input
                  size="sm"
                  aria-label="Fuzzy match query"
                  value={fuzzyQuery}
                  onChange={(e) => setFuzzyQuery(e.target.value)}
                  placeholder="Type query..."
                />
              </div>
              <div className="font-mono text-xs text-omai-text-secondary">
                Target: <code className="bg-omai-surface-2 px-2 py-1 text-omai-text">{fuzzyTarget}</code>{' '}
                → Matched indices:{' '}
                <code className="text-omai-brand">
                  [{fuzzyHit ? fuzzyHit.indices.join(', ') : ''}]
                </code>
              </div>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* 34. Waybar */}
      <DemoCard
        id="comp-waybar"
        name="Waybar"
        category="omai"
        cssClass=".omai-waybar"
        tagline="26px Linux status bar with WaybarLogo, WaybarWorkspaces, WaybarLayoutIndicator, WaybarModule, WaybarStat, and WaybarClock."
        defaultShowCode
        code={`<Waybar
  variant="opaque"
  left={<><WaybarLogo /><WaybarWorkspaces count={5} active={2} occupied={[1, 2, 3]} /><WaybarLayoutIndicator layout="dwindle" /></>}
  center={<WaybarClock />}
  right={<><WaybarStat label="CPU" value="18%" meter={18} /><WaybarModule label={meta.name} active /></>}
/>`}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-omai-text-secondary">WAYBAR VARIANT:</span>
            {(['opaque', 'glassy', 'clear'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setWaybarVariant(v)}
                aria-pressed={waybarVariant === v}
                className="border border-omai-border-subtle bg-omai-surface px-2.5 py-0.5 font-mono text-xs text-omai-text hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
              >
                {v}
              </button>
            ))}
          </div>

          <div className="border border-omai-border-strong bg-omai-bg-deep p-3 rounded-omai-md">
            <Waybar
              variant={waybarVariant}
              left={
                <>
                  <WaybarLogo onClick={onOpenGlobalWalker} />
                  <WaybarWorkspaces
                    count={6}
                    active={waybarWs}
                    occupied={[1, 2, 3, 5]}
                    urgent={[6]}
                    onSelect={setWaybarWs}
                  />
                  <WaybarLayoutIndicator layout="dwindle" />
                </>
              }
              center={<WaybarClock />}
              right={
                <>
                  <WaybarStat
                    icon={<Cpu size={12} strokeWidth={1.75} aria-hidden />}
                    label="CPU"
                    value="24%"
                    meter={24}
                    tone="brand"
                  />
                  <WaybarModule
                    icon={<Wifi size={12} strokeWidth={1.75} aria-hidden />}
                    label="wlan0"
                    tooltip="Connected: omai-5g (-42 dBm)"
                  />
                  <WaybarModule
                    icon={<Volume2 size={12} strokeWidth={1.75} aria-hidden />}
                    label="78%"
                    tooltip="PipeWire Sink: Pro Audio DAC"
                  />
                  <WaybarModule
                    active
                    tone="brand"
                    label={meta.name}
                    tooltip="Click to cycle next theme"
                    onClick={() => cycleTheme(1)}
                  />
                </>
              }
            />
          </div>
        </div>
      </DemoCard>

      {/* 35 & 36. TilingGrid + WindowPane */}
      <DemoCard
        id="comp-tiling-grid"
        name="TilingGrid & WindowPane"
        category="omai"
        cssClass=".omai-tiling-grid / .omai-window-pane"
        tagline="Hyprland window manager grid supporting dwindle, master, columns, rows, and grid layouts with 2px brand active borders and Alt+Arrow spatial keyboard navigation."
        defaultShowCode
        code={`<TilingGrid layout={layout} activeId={activeId} onActiveChange={setActiveId} height={360}>
  <WindowPane id="editor" title="nvim // App.tsx">...</WindowPane>
  <WindowPane id="term" title="ghostty // zsh">...</WindowPane>
  <WindowPane id="btop" title="btop // telemetry">...</WindowPane>
</TilingGrid>`}
      >
        <div id="comp-window-pane" className="space-y-3">
          {/* Interactive Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border border-omai-border-subtle bg-omai-surface p-2.5 rounded-omai-md">
            <div className="flex flex-wrap items-center gap-1.5">
              <LayoutGrid size={14} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
              <span className="font-mono text-xs text-omai-text-secondary">LAYOUT:</span>
              {TILING_LAYOUTS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setTilingLayout(l)}
                  aria-pressed={tilingLayout === l}
                  className="border border-omai-border-subtle bg-omai-bg px-2 py-0.5 font-mono text-xs text-omai-text uppercase hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-xs text-omai-text-secondary">GAPS:</span>
              {(
                [
                  ['inherit', 'inherit'],
                  ['none', '0px'],
                  [12, '12px'],
                ] as const
              ).map(([gVal, gLabel]) => (
                <button
                  key={String(gVal)}
                  type="button"
                  onClick={() => setTilingGaps(gVal)}
                  aria-pressed={tilingGaps === gVal}
                  className="border border-omai-border-subtle bg-omai-bg px-2 py-0.5 font-mono text-xs text-omai-text hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
                >
                  {gLabel}
                </button>
              ))}

              <Button
                size="sm"
                variant="secondary"
                leadingIcon={<Plus size={13} strokeWidth={1.75} aria-hidden />}
                disabled={panes.length >= 6}
                onClick={() => {
                  const nextId = `pane-${panes.length + 1}`;
                  setPanes((prev) => [
                    ...prev,
                    { id: nextId, title: `ghostty // pane #${prev.length + 1}`, kind: 'extra' },
                  ]);
                  setActivePaneId(nextId);
                }}
              >
                Spawn Pane
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leadingIcon={<RotateCcw size={13} strokeWidth={1.75} aria-hidden />}
                onClick={resetPanes}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="font-mono text-xs text-omai-text-muted">
            Active Pane: <strong className="text-omai-brand">{activePaneId}</strong> · Click any pane
            or press <Kbd keys={['Alt', '←/↑/↓/→']} size="sm" /> while focused inside the grid to
            move focus spatially!
          </div>

          <TilingGrid
            layout={tilingLayout}
            gaps={tilingGaps}
            activeId={activePaneId}
            onActiveChange={setActivePaneId}
            height={360}
          >
            {panes.map((p) => (
              <WindowPane
                key={p.id}
                id={p.id}
                title={p.title}
                icon={<TerminalIcon size={13} strokeWidth={1.75} aria-hidden />}
                padding="sm"
                onClose={
                  panes.length > 1
                    ? () => setPanes((prev) => prev.filter((item) => item.id !== p.id))
                    : undefined
                }
              >
                <div className="flex h-full flex-col justify-between font-mono text-xs">
                  <div>
                    <div className="flex items-center justify-between text-omai-text-muted">
                      <span>id: {p.id}</span>
                      <Badge
                        tone={activePaneId === p.id ? 'brand' : 'neutral'}
                        size="sm"
                      >
                        {activePaneId === p.id ? 'FOCUSED (2px brand)' : 'INACTIVE (1px)'}
                      </Badge>
                    </div>
                    {p.kind === 'editor' && (
                      <pre className="mt-2 overflow-x-auto text-[11px] text-omai-text-secondary">
                        <code>{`export * from './theme';\nexport * from './primitives';\nexport * from './omai';`}</code>
                      </pre>
                    )}
                    {p.kind === 'terminal' && (
                      <div className="mt-2 space-y-1 text-[11px]">
                        <div>
                          <span className="text-omai-brand">❯</span> hyprctl activewindow
                        </div>
                        <div className="text-omai-text-secondary">
                          Window {p.id} -&gt; layout: {tilingLayout}
                        </div>
                      </div>
                    )}
                    {p.kind === 'btop' && (
                      <div className="mt-2 space-y-1 text-[11px] text-omai-text-secondary">
                        <div>CPU: ███████░░░░░ 58%</div>
                        <div>MEM: █████░░░░░░░ 41%</div>
                      </div>
                    )}
                    {(p.kind === 'logs' || p.kind === 'extra') && (
                      <div className="mt-2 text-[11px] text-omai-text-secondary">
                        [hyprland] Window rule matched: border_size=2
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-omai-text-muted">
                    Click to focus · Alt+Arrow to navigate
                  </div>
                </div>
              </WindowPane>
            ))}
          </TilingGrid>
        </div>
      </DemoCard>

      {/* 37. Terminal (Ghostty + ANSI 16 + ansiToReact) */}
      <DemoCard
        id="comp-terminal"
        name="Terminal"
        category="omai"
        cssClass=".omai-terminal"
        tagline="Ghostty terminal block with 16 ANSI colors (--omai-ansi-0..15), SGR escape sequence parser (ansiToReact), and optional typing animation."
        defaultShowCode
        code={`<Terminal
  title="ghostty — jseramn@omai"
  user="jseramn"
  host="omai"
  cwd="~/omai"
  cursor="block"
  copyable
  lines={GHOSTTY_DEMO_LINES}
/>`}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-xs text-omai-text-secondary">CURSOR:</span>
              {(['block', 'beam', 'underline', false] as const).map((c) => (
                <button
                  key={String(c)}
                  type="button"
                  onClick={() => setCursorStyle(c)}
                  aria-pressed={cursorStyle === c}
                  className="border border-omai-border-subtle bg-omai-surface px-2 py-0.5 font-mono text-xs text-omai-text hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
                >
                  {c === false ? 'hidden' : c}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setTypingAnim(true);
                setTypingRunKey((k) => k + 1);
              }}
            >
              Replay Typing Animation
            </Button>
          </div>

          <Terminal
            key={typingRunKey}
            title="ghostty — dhh@omai: ~/omai"
            user="jseramn"
            host="omai"
            cwd="~/omai"
            cursor={cursorStyle}
            typing={typingAnim}
            typingSpeed={18}
            copyable
            lines={GHOSTTY_DEMO_LINES}
          >
            <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-omai-border-subtle pt-2">
              <span className="font-mono text-xs text-omai-text-muted">ANSI 0..15 Spans:</span>
              {Array.from({ length: 16 }, (_, i) => (
                <Ansi
                  key={i}
                  color={i as 0}
                  bold={i >= 8}
                  className="border border-omai-border-subtle bg-omai-surface px-1 text-[11px]"
                >
                  c{i}
                </Ansi>
              ))}
              <span className="ml-2 text-xs">
                {ansiToReact('\u001b[1;35mSGR Parsed\u001b[0m')}
              </span>
            </div>
          </Terminal>
        </div>
      </DemoCard>

      {/* 38. ThemeSwitcher */}
      <DemoCard
        id="comp-theme-switcher"
        name="ThemeSwitcher"
        category="omai"
        cssClass=".omai-theme-switcher"
        tagline="Roving radiogroup theme picker supporting grid, list, compact, and native select variants with All/Dark/Light filters."
        code={`<ThemeSwitcher variant="grid" columns={4} showRadiusToggle showModeLabel />
<ThemeSwitcher variant="compact" showRadiusToggle />
<ThemeSwitcher variant="select" />`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-omai-text-secondary">SWITCHER VARIANT:</span>
            {(['compact', 'select', 'list', 'grid'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSwitcherVariant(v)}
                aria-pressed={switcherVariant === v}
                className="border border-omai-border-subtle bg-omai-surface px-2.5 py-0.5 font-mono text-xs text-omai-text hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
              >
                {v}
              </button>
            ))}
          </div>

          <div className="border border-omai-border-subtle bg-omai-surface p-4 rounded-omai-md">
            <ThemeSwitcher
              variant={switcherVariant}
              columns={4}
              showRadiusToggle
              showModeLabel
            />
          </div>
        </div>
      </DemoCard>

      {/* 39. HotkeyBar */}
      <DemoCard
        id="comp-hotkey-bar"
        name="HotkeyBar"
        category="omai"
        cssClass=".omai-hotkey-bar"
        tagline="Keybinding bar supporting inline or edge-docked placement and optional live useHotkey listeners."
        code={`<HotkeyBar
  items={[
    { keys: ['Ctrl', 'K'], label: 'Walker', onTrigger: openWalker },
    { keys: ['Shift', 'T'], label: 'Cycle Theme', onTrigger: () => cycleTheme(1) },
    { keys: ['Shift', 'R'], label: 'Toggle Radius', onTrigger: toggleRadius },
  ]}
/>`}
      >
        <div className="border border-omai-border-subtle bg-omai-surface p-3 rounded-omai-md">
          <HotkeyBar
            position="inline"
            items={[
              {
                keys: ['Ctrl', 'K'],
                label: 'Open Walker',
                onTrigger: onOpenGlobalWalker,
              },
              {
                keys: ['Shift', 'T'],
                label: `Cycle Theme (${meta.name})`,
                onTrigger: () => cycleTheme(1),
              },
              {
                keys: ['Shift', 'R'],
                label: `Radius (${radius})`,
                onTrigger: () => setRadius(radius === 'sharp' ? 'soft' : 'sharp'),
              },
              {
                keys: ['Shift', 'G'],
                label: `Gaps (${gaps})`,
                onTrigger: () =>
                  setGaps(gaps === 'default' ? 'wide' : gaps === 'wide' ? 'none' : 'default'),
              },
            ]}
          />
        </div>
      </DemoCard>

      {/* 40. PixelField */}
      <DemoCard
        id="comp-pixel-field"
        name="PixelField"
        category="omai"
        cssClass=".omai-pixel-field"
        tagline="DPR-aware HTML5 canvas reading --omai-field-* tokens with MutationObserver theme reactivity, 5 procedural patterns, and pointer wave crest."
        code={`<PixelField pattern="logo" cellSize={10} gap={2} height={220} interactive>
  <Badge tone="brand">OMAI PIXEL CANVAS</Badge>
</PixelField>`}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Sparkles size={14} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
              <span className="font-mono text-xs text-omai-text-secondary">PATTERN:</span>
              {(['logo', 'wave', 'rain', 'noise', 'static'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPfPattern(p)}
                  aria-pressed={pfPattern === p}
                  className="border border-omai-border-subtle bg-omai-surface px-2 py-0.5 font-mono text-xs text-omai-text uppercase hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-omai-text-secondary">CELL SIZE:</span>
              {[8, 10, 14].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setPfCellSize(sz)}
                  aria-pressed={pfCellSize === sz}
                  className="border border-omai-border-subtle bg-omai-surface px-2 py-0.5 font-mono text-xs text-omai-text hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:text-omai-brand rounded-omai-sm"
                >
                  {sz}px
                </button>
              ))}
            </div>
          </div>

          <PixelField
            pattern={pfPattern}
            cellSize={pfCellSize}
            gap={2}
            height={200}
            interactive
            className="border border-omai-border-strong"
          >
            <div className="border border-omai-border-strong bg-omai-bg-deep/90 px-4 py-2 text-center">
              <div className="font-mono text-xs font-bold tracking-widest text-omai-brand uppercase">
                --omai-field-* Reactive Canvas
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-omai-text-secondary">
                Move cursor across cells · Switch themes to see live palette re-sampling
              </div>
            </div>
          </PixelField>
        </div>
      </DemoCard>
    </div>
  );
}
