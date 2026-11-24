import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  IconButton,
  Kbd,
  Separator,
  Skeleton,
  Tooltip,
} from '@jseramn/omai';
import {
  ArrowRight,
  Copy,
  Download,
  Heart,
  RefreshCw,
  Settings,
  Terminal as TerminalIcon,
  Trash2,
  Zap,
} from 'lucide-react';
import { DemoCard } from './DemoCard';

export function PrimitivesDemos() {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [favCount, setFavCount] = useState(42);
  const [selectedCard, setSelectedCard] = useState<'hypr' | 'ghostty'>('hypr');
  const [skeletonLoaded, setSkeletonLoaded] = useState(false);

  const triggerLoading = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 1200);
  };

  return (
    <div className="space-y-6">
      {/* 1. Button */}
      <DemoCard
        id="comp-button"
        name="Button"
        category="primitives"
        cssClass=".omai-button"
        tagline="Tactile button with 5 variants, 3 control heights (32/40/48px), icon slots, and aria-busy loading spinner."
        defaultShowCode
        code={`<Button variant="primary" leadingIcon={<Zap size={16} />}>Deploy Workspace</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger" trailingIcon={<Trash2 size={16} />}>Kill Pane</Button>
<Button loading={loading} onClick={triggerLoading}>Compile Kernel</Button>`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              leadingIcon={<Zap size={16} strokeWidth={1.75} aria-hidden />}
            >
              Primary Action
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button
              variant="danger"
              leadingIcon={<Trash2 size={16} strokeWidth={1.75} aria-hidden />}
            >
              Danger
            </Button>
            <Button
              variant="primary"
              loading={loadingBtn}
              onClick={triggerLoading}
              leadingIcon={<RefreshCw size={16} strokeWidth={1.75} aria-hidden />}
            >
              {loadingBtn ? 'Compiling...' : 'Click to Test Loading'}
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 border-t border-omai-border-subtle pt-3">
            <span className="font-mono text-xs text-omai-text-muted">SIZES:</span>
            <Button size="sm" variant="secondary">
              Small (32px)
            </Button>
            <Button size="md" variant="secondary">
              Medium (40px)
            </Button>
            <Button
              size="lg"
              variant="primary"
              trailingIcon={<ArrowRight size={18} strokeWidth={1.75} aria-hidden />}
            >
              Large (48px)
            </Button>
          </div>
        </div>
      </DemoCard>

      {/* 2. IconButton */}
      <DemoCard
        id="comp-icon-button"
        name="IconButton"
        category="primitives"
        cssClass=".omai-icon-button"
        tagline="Square icon-only button requiring an accessible aria-label across all variants and sizes."
        code={`<IconButton aria-label="Terminal" variant="primary" icon={<TerminalIcon size={16} />} />
<IconButton aria-label="Settings" variant="secondary" icon={<Settings size={16} />} />
<IconButton aria-label="Copy" variant="outline" icon={<Copy size={16} />} />
<IconButton aria-label="Delete" variant="danger" icon={<Trash2 size={16} />} />`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <IconButton
            aria-label="Launch terminal"
            variant="primary"
            icon={<TerminalIcon size={16} strokeWidth={1.75} aria-hidden />}
          />
          <IconButton
            aria-label="Open settings"
            variant="secondary"
            icon={<Settings size={16} strokeWidth={1.75} aria-hidden />}
          />
          <IconButton
            aria-label="Copy configuration"
            variant="outline"
            icon={<Copy size={16} strokeWidth={1.75} aria-hidden />}
          />
          <IconButton
            aria-label="Download snapshot"
            variant="ghost"
            icon={<Download size={16} strokeWidth={1.75} aria-hidden />}
          />
          <IconButton
            aria-label="Remove item"
            variant="danger"
            icon={<Trash2 size={16} strokeWidth={1.75} aria-hidden />}
          />
          <Separator orientation="vertical" className="h-6" />
          <IconButton
            size="sm"
            aria-label="Small favorite button"
            variant="secondary"
            onClick={() => setFavCount((c) => c + 1)}
            icon={<Heart size={14} strokeWidth={1.75} aria-hidden />}
          />
          <IconButton
            size="lg"
            aria-label="Large favorite button"
            variant="outline"
            onClick={() => setFavCount((c) => c + 1)}
            icon={<Heart size={18} strokeWidth={1.75} aria-hidden />}
          />
          <span className="font-mono text-xs text-omai-text-secondary">
            Clicks: <strong className="text-omai-brand">{favCount}</strong>
          </span>
        </div>
      </DemoCard>

      {/* 3. Badge */}
      <DemoCard
        id="comp-badge"
        name="Badge"
        category="primitives"
        cssClass=".omai-badge"
        tagline="11px uppercase monospace status badge in soft, solid, and outline variants across 6 semantic tones."
        code={`<Badge tone="brand" variant="soft" dot>HYPRLAND 0.48</Badge>
<Badge tone="success" variant="solid">ONLINE</Badge>
<Badge tone="warning" variant="outline">DEGRADED</Badge>
<Badge tone="danger" dot>PANIC</Badge>`}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-mono text-xs text-omai-text-muted">SOFT:</span>
            <Badge tone="neutral" variant="soft">
              Neutral
            </Badge>
            <Badge tone="brand" variant="soft" dot>
              Brand Active
            </Badge>
            <Badge tone="success" variant="soft" dot>
              Success
            </Badge>
            <Badge tone="warning" variant="soft" dot>
              Warning
            </Badge>
            <Badge tone="danger" variant="soft" dot>
              Danger
            </Badge>
            <Badge tone="info" variant="soft" dot>
              Info
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-mono text-xs text-omai-text-muted">SOLID:</span>
            <Badge tone="neutral" variant="solid">
              Neutral
            </Badge>
            <Badge tone="brand" variant="solid">
              Brand
            </Badge>
            <Badge tone="success" variant="solid">
              Success
            </Badge>
            <Badge tone="warning" variant="solid">
              Warning
            </Badge>
            <Badge tone="danger" variant="solid">
              Danger
            </Badge>
            <Badge tone="info" variant="solid">
              Info
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 font-mono text-xs text-omai-text-muted">OUTLINE:</span>
            <Badge tone="neutral" variant="outline" size="sm">
              sm Neutral
            </Badge>
            <Badge tone="brand" variant="outline" size="sm" dot>
              sm Brand
            </Badge>
            <Badge tone="success" variant="outline">
              md Success
            </Badge>
            <Badge tone="info" variant="outline">
              md Info
            </Badge>
          </div>
        </div>
      </DemoCard>

      {/* 4. Kbd */}
      <DemoCard
        id="comp-kbd"
        name="Kbd"
        category="primitives"
        cssClass=".omai-kbd"
        tagline="Keyboard shortcut chord display accepting a keys array (joined by +) or custom children."
        code={`<Kbd keys={['Super', 'Return']} />
<Kbd keys={['Ctrl', 'K']} />
<Kbd keys={['Super', 'Shift', 'Backspace']} size="sm" />`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 border border-omai-border-subtle bg-omai-surface px-3 py-2 rounded-omai-sm">
            <span className="font-mono text-xs text-omai-text-secondary">Launch Ghostty:</span>
            <Kbd keys={['Super', 'Return']} />
          </div>
          <div className="flex items-center gap-2 border border-omai-border-subtle bg-omai-surface px-3 py-2 rounded-omai-sm">
            <span className="font-mono text-xs text-omai-text-secondary">Walker Launcher:</span>
            <Kbd keys={['Ctrl', 'K']} />
          </div>
          <div className="flex items-center gap-2 border border-omai-border-subtle bg-omai-surface px-3 py-2 rounded-omai-sm">
            <span className="font-mono text-xs text-omai-text-secondary">Zero Gaps Toggle:</span>
            <Kbd keys={['Super', 'Shift', 'Backspace']} size="sm" />
          </div>
          <div className="flex items-center gap-2 border border-omai-border-subtle bg-omai-surface px-3 py-2 rounded-omai-sm">
            <span className="font-mono text-xs text-omai-text-secondary">Focus Pane:</span>
            <Kbd>Alt + ← ↑ ↓ →</Kbd>
          </div>
        </div>
      </DemoCard>

      {/* 5. Card */}
      <DemoCard
        id="comp-card"
        name="Card"
        category="primitives"
        cssClass=".omai-card"
        tagline="Flat-elevation surface container with CardHeader, CardTitle, CardDescription, CardContent, and CardFooter."
        code={`<Card variant="surface" padding="md" interactive>
  <CardHeader>
    <CardTitle>Hyprland Compositor</CardTitle>
    <CardDescription>Dynamic tiling Wayland compositor with 2px active borders.</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>...</CardFooter>
</Card>`}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card
            variant="surface"
            padding="md"
            interactive
            onClick={() => setSelectedCard('hypr')}
            className={selectedCard === 'hypr' ? 'border-omai-brand' : ''}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge tone="brand" size="sm">
                  surface · interactive
                </Badge>
                {selectedCard === 'hypr' && (
                  <Badge tone="success" variant="solid" size="sm">
                    Active
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-2">Hyprland Wayland</CardTitle>
              <CardDescription>
                Click this interactive card to select it. Uses 1px border + resting luminous ring.
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-4 flex items-center justify-between border-t border-omai-border-subtle pt-3">
              <Kbd keys={['Super', '1']} size="sm" />
              <span className="font-mono text-xs text-omai-brand">gaps_in = 5</span>
            </CardFooter>
          </Card>

          <Card
            variant="outline"
            padding="md"
            interactive
            onClick={() => setSelectedCard('ghostty')}
            className={selectedCard === 'ghostty' ? 'border-omai-brand' : ''}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge tone="info" size="sm">
                  outline · interactive
                </Badge>
                {selectedCard === 'ghostty' && (
                  <Badge tone="success" variant="solid" size="sm">
                    Active
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-2">Ghostty GPU Terminal</CardTitle>
              <CardDescription>
                Transparent canvas background with crisp 1px border outline.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-3">
              <code className="block bg-omai-surface-2 px-2 py-1 font-mono text-xs text-omai-text">
                font-family = JetBrainsMono Nerd Font
              </code>
            </CardContent>
          </Card>

          <Card variant="ghost" padding="md">
            <CardHeader>
              <Badge tone="neutral" size="sm">
                ghost variant
              </Badge>
              <CardTitle className="mt-2">Minimal Ghost Card</CardTitle>
              <CardDescription>
                Borderless container for grouping subtle secondary metadata.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-3 font-mono text-xs text-omai-text-muted">
              No border or background at rest.
            </CardContent>
          </Card>
        </div>
      </DemoCard>

      {/* 6. Separator */}
      <DemoCard
        id="comp-separator"
        name="Separator"
        category="primitives"
        cssClass=".omai-separator"
        tagline="1px hairline divider supporting horizontal/vertical orientation and centered monospace section labels."
        code={`<Separator />
<Separator label="HYPRLAND.CONF // BINDINGS" />
<Separator orientation="vertical" />`}
      >
        <div className="space-y-4">
          <Separator />
          <Separator label="HYPRLAND.CONF // KEYBINDINGS" />
          <div className="flex h-8 items-center justify-center gap-4 font-mono text-xs text-omai-text-secondary">
            <span>Workspace 01</span>
            <Separator orientation="vertical" decorative={false} />
            <span>Workspace 02</span>
            <Separator orientation="vertical" decorative={false} />
            <span className="text-omai-brand">Workspace 03 (Active)</span>
          </div>
        </div>
      </DemoCard>

      {/* 7. Avatar */}
      <DemoCard
        id="comp-avatar"
        name="Avatar"
        category="primitives"
        cssClass=".omai-avatar"
        tagline="User identity badge in 5 sizes (24px–64px) with automatic 2-letter initials fallback and presence indicator."
        code={`<Avatar name="Jseramn" size="lg" status="online" />
<Avatar name="Linus Torvalds" size="md" status="busy" shape="circle" />
<Avatar name="Mitchell Hashimoto" size="sm" status="away" />`}
      >
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-3">
            <Avatar name="OMAI Root" size="xs" status="online" />
            <Avatar name="David Heinemeier" size="sm" status="online" />
            <Avatar name="Mitchell Hashimoto" size="md" status="away" />
            <Avatar name="Vaxry Hypr" size="lg" status="busy" />
            <Avatar name="Kovid Goyal" size="xl" status="offline" />
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="flex items-center gap-3">
            <Avatar name="Circle Mode" size="md" shape="circle" status="online" />
            <span className="font-mono text-xs text-omai-text-secondary">
              <code>shape=&quot;circle&quot;</code> uses <code>--omai-radius-full</code> (0px in
              sharp mode, pill in soft mode)
            </span>
          </div>
        </div>
      </DemoCard>

      {/* 8. Skeleton */}
      <DemoCard
        id="comp-skeleton"
        name="Skeleton"
        category="primitives"
        cssClass=".omai-skeleton"
        tagline="Loading placeholders in block, multi-line text, and stepped OMAI pixel shimmer modes."
        code={`<Skeleton variant="pixel" height={40} />
<Skeleton variant="text" lines={3} />
<Skeleton variant="block" width={160} height={32} />`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-omai-text-secondary">
              Previewing live shimmer variants (toggle resolved content to compare):
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSkeletonLoaded((v) => !v)}
            >
              {skeletonLoaded ? 'Show Skeletons' : 'Simulate Loaded Data'}
            </Button>
          </div>

          {skeletonLoaded ? (
            <div className="border border-omai-border-subtle bg-omai-surface p-4 rounded-omai-md">
              <div className="flex items-center gap-3">
                <Avatar name="OMAI Kernel" size="md" status="online" />
                <div>
                  <div className="font-sans text-sm font-semibold text-omai-text">
                    linux-zen 6.14.2-arch1-1
                  </div>
                  <div className="font-mono text-xs text-omai-text-secondary">
                    All 16 theme tokens verified and mounted.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2 border border-omai-border-subtle bg-omai-surface p-3 rounded-omai-md">
                <span className="font-mono text-[11px] text-omai-brand">variant=&quot;pixel&quot;</span>
                <Skeleton variant="pixel" height={44} />
                <Skeleton variant="pixel" height={24} width="75%" />
              </div>
              <div className="space-y-2 border border-omai-border-subtle bg-omai-surface p-3 rounded-omai-md">
                <span className="font-mono text-[11px] text-omai-brand">
                  variant=&quot;text&quot; lines={3}
                </span>
                <Skeleton variant="text" lines={3} />
              </div>
              <div className="space-y-2 border border-omai-border-subtle bg-omai-surface p-3 rounded-omai-md">
                <span className="font-mono text-[11px] text-omai-brand">variant=&quot;block&quot;</span>
                <div className="flex items-center gap-3">
                  <Skeleton variant="block" width={40} height={40} />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="block" height={14} />
                    <Skeleton variant="block" height={14} width="60%" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DemoCard>

      {/* 9. Tooltip */}
      <DemoCard
        id="comp-tooltip"
        name="Tooltip"
        category="primitives"
        cssClass=".omai-tooltip"
        tagline="Portalled floating tooltip with configurable placement side, delay, Escape dismissal, and keycap shortcut."
        code={`<Tooltip content="Launch Walker Command Palette" shortcut={['Ctrl', 'K']} side="top">
  <Button variant="secondary">Hover or Focus Me (Top)</Button>
</Tooltip>`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Tooltip
            content="Launch Walker Command Palette"
            shortcut={['Ctrl', 'K']}
            side="top"
            delay={100}
          >
            <Button variant="secondary" size="sm">
              Tooltip Top + Shortcut
            </Button>
          </Tooltip>

          <Tooltip
            content="Toggle sharp (0px) / soft (Hyprland 8px) corner radius"
            shortcut={['Shift', 'R']}
            side="bottom"
            delay={100}
          >
            <Button variant="secondary" size="sm">
              Tooltip Bottom
            </Button>
          </Tooltip>

          <Tooltip content="Cycle Hyprland window gaps" shortcut={['Shift', 'G']} side="right" delay={100}>
            <Button variant="outline" size="sm">
              Tooltip Right
            </Button>
          </Tooltip>

          <Tooltip content="Docked left tooltip preview" side="left" delay={100}>
            <Button variant="ghost" size="sm">
              Tooltip Left
            </Button>
          </Tooltip>
        </div>
      </DemoCard>
    </div>
  );
}
