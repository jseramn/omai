import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Dialog,
  Drawer,
  DropdownMenu,
  Input,
  Kbd,
  Popover,
  Progress,
  Slider,
  Toast,
  useToast,
} from '@jseramn/omai';
import {
  Bell,
  ChevronDown,
  Copy,
  FolderGit2,
  Layers,
  PanelLeft,
  PanelRight,
  RefreshCw,
  Sliders,
  Trash2,
} from 'lucide-react';
import { DemoCard } from './DemoCard';

export function FeedbackDemos() {
  const { toast, dismiss } = useToast();
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snapshotName, setSnapshotName] = useState('omai-btrfs-root-2026');
  const [waybarPinned, setWaybarPinned] = useState(true);
  const [gapsLocked, setGapsLocked] = useState(false);
  const [lastMenuAction, setLastMenuAction] = useState<string>('None yet');
  const [progressVal, setProgressVal] = useState(72);

  return (
    <div className="space-y-6">
      {/* 18. Alert */}
      <DemoCard
        id="comp-alert"
        name="Alert"
        category="feedback"
        cssClass=".omai-alert"
        tagline="Semantic callout banner across 6 tones with automatic role='alert' for warning/danger, action slot, and dismiss button."
        defaultShowCode
        code={`<Alert tone="brand" title="OMAI Agent Runtime Ready">
  Arch Linux kernel 6.14 + Hyprland 0.48 + Ghostty 1.1 pre-configured.
</Alert>
<Alert tone="danger" title="Btrfs Scrub Warning" onDismiss={() => {}} />`}
      >
        <div className="space-y-3">
          <Alert tone="brand" title="OMAI Agent Runtime Ready">
            Arch Linux kernel 6.14 + Hyprland 0.48 + Ghostty 1.1 pre-configured with 16 themes.
          </Alert>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Alert tone="info" title="Wayland Session Active">
              Running on <code className="text-omai-text">WLR_RENDERER=vulkan</code> at 144Hz.
            </Alert>
            <Alert tone="success" title="Pacman Sync Complete">
              142 packages up-to-date in 0.84s.
            </Alert>
            <Alert
              tone="warning"
              title="VRAM Threshold (84%)"
              action={
                <Button size="sm" variant="secondary">
                  Purge Cache
                </Button>
              }
            >
              Shader cache approaching 4.0 GiB limit.
            </Alert>
            {!alertDismissed ? (
              <Alert
                tone="danger"
                title="Dismissible Kernel Panic Alert"
                onDismiss={() => setAlertDismissed(true)}
              >
                Click the X button to test dismissal.
              </Alert>
            ) : (
              <div className="flex items-center justify-between border border-omai-border-subtle bg-omai-surface p-3 rounded-omai-md">
                <span className="font-mono text-xs text-omai-text-secondary">
                  Danger alert dismissed.
                </span>
                <Button size="sm" variant="ghost" onClick={() => setAlertDismissed(false)}>
                  Restore Alert
                </Button>
              </div>
            )}
          </div>
        </div>
      </DemoCard>

      {/* 19. Toast (Mako Notification Deck) */}
      <DemoCard
        id="comp-toast"
        name="Toast"
        category="feedback"
        cssClass=".omai-toast"
        tagline="Mako-inspired stacked notification deck (top-right, 320px wide, hover fan-out, auto-dismiss bar, numbered shortcut actions)."
        defaultShowCode
        code={`const { toast } = useToast();
toast({
  appName: 'mako-daemon',
  title: 'New SSH Connection',
  description: 'Accepted publickey for dhh from 10.0.0.42 port 51820',
  tone: 'brand',
  timestamp: new Date(),
  actions: [
    { label: 'Inspect Session', shortcut: '1', onClick: () => {} },
    { label: 'Terminate', shortcut: '2', onClick: () => {} },
  ],
});`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              leadingIcon={<Bell size={14} strokeWidth={1.75} aria-hidden />}
              onClick={() =>
                toast({
                  appName: 'mako-notify',
                  title: 'Hyprland Config Reloaded',
                  description: 'Parsed ~/.config/hypr/hyprland.conf in 1.4ms (0 errors)',
                  tone: 'brand',
                  timestamp: new Date(),
                })
              }
            >
              Spawn Brand Toast
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                toast({
                  appName: 'pacman',
                  title: 'System Upgrade Finished',
                  description: 'ghostty 1.1.2-1 and hyprland 0.48.0-1 installed cleanly.',
                  tone: 'success',
                  timestamp: new Date(),
                })
              }
            >
              Spawn Success
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                toast({
                  appName: 'btop-monitor',
                  title: 'CPU Package Temp 86°C',
                  description: 'Ryzen 9 9950X boosting on 16 cores during cargo build --release',
                  tone: 'warning',
                  timestamp: new Date(),
                })
              }
            >
              Spawn Warning
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() =>
                toast({
                  appName: 'systemd',
                  title: 'Unit docker.service Failed',
                  description: 'Main process exited, code=exited, status=1/FAILURE',
                  tone: 'danger',
                  timestamp: new Date(),
                })
              }
            >
              Spawn Danger
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast({
                  appName: 'walker-action',
                  title: 'Incoming Screen Share Request',
                  description: 'xdg-desktop-portal-hyprland wants to share Workspace 1',
                  tone: 'info',
                  timestamp: new Date(),
                  actions: [
                    {
                      label: 'Allow DP-1',
                      shortcut: '1',
                      onClick: () =>
                        toast({
                          appName: 'portal',
                          title: 'Screen share started on DP-1',
                          tone: 'success',
                        }),
                    },
                    {
                      label: 'Deny',
                      shortcut: '2',
                      onClick: () => {},
                    },
                  ],
                })
              }
            >
              Spawn Actionable [1][2] Toast
            </Button>

            <Button size="sm" variant="ghost" onClick={() => dismiss()}>
              Dismiss All
            </Button>
          </div>

          {/* Static Presentational Mako Toast Preview */}
          <div className="border-t border-omai-border-subtle pt-3">
            <span className="mb-2 block font-mono text-xs text-omai-text-muted">
              STATIC PRESENTATIONAL <code>&lt;Toast /&gt;</code> CARD:
            </span>
            <div className="max-w-sm">
              <Toast
                appName="mako-daemon"
                timestamp="14:32"
                tone="brand"
                title="SSH Tunnel Established"
                description="Forwarded local 127.0.0.1:5432 → prod-db.internal:5432"
                actions={[
                  { label: 'Open psql', shortcut: '1', onClick: () => {} },
                  { label: 'Disconnect', shortcut: '2', onClick: () => {} },
                ]}
              />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* 20. Dialog */}
      <DemoCard
        id="comp-dialog"
        name="Dialog"
        category="feedback"
        cssClass=".omai-dialog"
        tagline="WAI-ARIA modal dialog with focus trap, body scroll lock, Escape/backdrop dismissal, and scoped portal inheritance."
        code={`<Dialog
  open={open}
  onOpenChange={setOpen}
  trigger={<Button>Create Btrfs Snapshot</Button>}
  title="Create Atomic System Snapshot"
  description="Captures subvolume @root before kernel upgrade."
  footer={<Button onClick={() => setOpen(false)}>Confirm Snapshot</Button>}
>
  <Input value={snapshotName} onChange={(e) => setSnapshotName(e.target.value)} />
</Dialog>`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            trigger={
              <Button
                variant="primary"
                leadingIcon={<Layers size={16} strokeWidth={1.75} aria-hidden />}
              >
                Open Modal Dialog
              </Button>
            }
            title="Create Btrfs Root Snapshot"
            description="Creates a read-only copy-on-write snapshot in /.snapshots before system update."
            footer={
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setDialogOpen(false);
                    toast({
                      appName: 'snapper',
                      title: `Snapshot ${snapshotName} created`,
                      tone: 'success',
                    });
                  }}
                >
                  Create Snapshot
                </Button>
              </div>
            }
          >
            <div className="space-y-3">
              <label className="block font-mono text-xs text-omai-text-secondary">
                Snapshot Label
                <Input
                  className="mt-1"
                  value={snapshotName}
                  onChange={(e) => setSnapshotName(e.target.value)}
                />
              </label>
              <div className="border border-omai-border-subtle bg-omai-bg-deep p-2.5 font-mono text-xs text-omai-text-secondary">
                Command: <code className="text-omai-brand">btrfs subvolume snapshot -r / /.snapshots/{snapshotName}</code>
              </div>
            </div>
          </Dialog>

          <span className="font-mono text-xs text-omai-text-muted">
            Traps Tab focus · Esc closes · Inherits active theme in Portal
          </span>
        </div>
      </DemoCard>

      {/* 21. Drawer */}
      <DemoCard
        id="comp-drawer"
        name="Drawer"
        category="feedback"
        cssClass=".omai-drawer"
        tagline="Edge-docked slide-over panel supporting left, right, top, and bottom placement sides."
        code={`<Drawer
  side="right"
  trigger={<Button variant="secondary">Open Right Drawer</Button>}
  title="Hyprland Monitor Inspector"
>
  ...
</Drawer>`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Drawer
            side="left"
            size="sm"
            trigger={
              <Button
                variant="secondary"
                leadingIcon={<PanelLeft size={16} strokeWidth={1.75} aria-hidden />}
              >
                Open Left Drawer
              </Button>
            }
            title="Workspace Tree (Left Drawer)"
            description="Docked left navigation drawer (size='sm')"
          >
            <div className="space-y-2 font-mono text-xs">
              <div className="border border-omai-brand bg-omai-brand-soft p-2.5 text-omai-brand">
                1: [ghostty] ~/omai
              </div>
              <div className="border border-omai-border-subtle bg-omai-surface p-2.5 text-omai-text">
                2: [nvim] packages/react/src/index.ts
              </div>
              <div className="border border-omai-border-subtle bg-omai-surface p-2.5 text-omai-text">
                3: [btop] system telemetry
              </div>
            </div>
          </Drawer>

          <Drawer
            side="right"
            size="md"
            trigger={
              <Button
                variant="secondary"
                leadingIcon={<PanelRight size={16} strokeWidth={1.75} aria-hidden />}
              >
                Open Right Drawer
              </Button>
            }
            title="Monitor Output Configuration"
            description="hyprctl monitors -j live readout"
          >
            <div className="space-y-3 font-mono text-xs text-omai-text-secondary">
              <div className="border border-omai-border-subtle bg-omai-surface p-3">
                <div className="font-bold text-omai-text">DP-1 (Primary)</div>
                <div>Resolution: 3840x2160 @ 144.00Hz</div>
                <div>Scale: 1.50 · VRR: Adaptive-Sync</div>
              </div>
              <div className="border border-omai-border-subtle bg-omai-surface p-3">
                <div className="font-bold text-omai-text">HDMI-A-1</div>
                <div>Resolution: 2560x1440 @ 120.00Hz</div>
                <div>Scale: 1.00 · Transform: 90° Vertical</div>
              </div>
            </div>
          </Drawer>
        </div>
      </DemoCard>

      {/* 22. Popover */}
      <DemoCard
        id="comp-popover"
        name="Popover"
        category="feedback"
        cssClass=".omai-popover"
        tagline="Collision-aware anchored floating popover that shifts focus inside on open and restores focus on close."
        code={`<Popover
  side="bottom"
  align="start"
  trigger={<Button variant="secondary">Audio Mixer Popover</Button>}
>
  <div className="w-64 space-y-3">...</div>
</Popover>`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Popover
            side="bottom"
            align="start"
            trigger={
              <Button
                variant="secondary"
                leadingIcon={<Sliders size={16} strokeWidth={1.75} aria-hidden />}
              >
                Open PipeWire Mixer Popover
              </Button>
            }
          >
            <div className="w-64 space-y-3">
              <div className="flex items-center justify-between border-b border-omai-border-subtle pb-2">
                <span className="font-sans text-sm font-semibold text-omai-text">
                  PipeWire Output
                </span>
                <Badge tone="brand" size="sm">
                  48kHz
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-xs text-omai-text-secondary">
                  Master Volume ({progressVal}%)
                </span>
                <Slider value={progressVal} onValueChange={setProgressVal} min={0} max={100} />
              </div>
            </div>
          </Popover>
        </div>
      </DemoCard>

      {/* 23. DropdownMenu */}
      <DemoCard
        id="comp-dropdown-menu"
        name="DropdownMenu"
        category="feedback"
        cssClass=".omai-dropdown-menu"
        tagline="Keyboard-navigable menu supporting action items, checkbox items, group labels, separators, keycap shortcuts, and typeahead."
        code={`<DropdownMenu
  trigger={<Button variant="secondary">Window Actions</Button>}
  items={[
    { type: 'label', label: 'Hyprland Window' },
    { id: 'float', label: 'Toggle Floating', shortcut: ['Super', 'V'], onSelect: () => {} },
    { type: 'checkbox', id: 'pin', label: 'Pin Waybar', checked, onCheckedChange: setChecked },
    { type: 'separator' },
    { id: 'kill', label: 'Close Active Window', danger: true, shortcut: ['Super', 'W'] },
  ]}
/>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <DropdownMenu
            trigger={
              <Button
                variant="secondary"
                trailingIcon={<ChevronDown size={16} strokeWidth={1.75} aria-hidden />}
              >
                Hyprland Window Menu
              </Button>
            }
            items={[
              { type: 'label', label: 'Workspace Actions' },
              {
                id: 'clone',
                label: 'Clone Repo in Ghostty',
                icon: <FolderGit2 size={14} strokeWidth={1.75} aria-hidden />,
                shortcut: ['Super', 'G'],
                onSelect: () => setLastMenuAction('Clone Repo in Ghostty'),
              },
              {
                id: 'copy-id',
                label: 'Copy Window Address',
                icon: <Copy size={14} strokeWidth={1.75} aria-hidden />,
                shortcut: ['Super', 'C'],
                onSelect: () => setLastMenuAction('Copied 0x55d8f9e0'),
              },
              {
                id: 'reload',
                label: 'Reload Waybar CSS',
                icon: <RefreshCw size={14} strokeWidth={1.75} aria-hidden />,
                onSelect: () => setLastMenuAction('Reloaded Waybar CSS'),
              },
              { type: 'separator' },
              { type: 'label', label: 'Toggles' },
              {
                type: 'checkbox',
                id: 'pin-waybar',
                label: 'Pin Waybar Status Bar',
                checked: waybarPinned,
                onCheckedChange: (next) => {
                  setWaybarPinned(next);
                  setLastMenuAction(`Pin Waybar: ${next}`);
                },
              },
              {
                type: 'checkbox',
                id: 'lock-gaps',
                label: 'Lock Zero-Gap Mode',
                checked: gapsLocked,
                onCheckedChange: (next) => {
                  setGapsLocked(next);
                  setLastMenuAction(`Lock Gaps: ${next}`);
                },
              },
              { type: 'separator' },
              {
                id: 'kill',
                label: 'Kill Active Window',
                icon: <Trash2 size={14} strokeWidth={1.75} aria-hidden />,
                shortcut: ['Super', 'Q'],
                danger: true,
                onSelect: () => setLastMenuAction('Killed active window'),
              },
            ]}
          />

          <div className="font-mono text-xs text-omai-text-secondary">
            Last selected: <code className="bg-omai-surface-2 px-1.5 py-0.5 text-omai-brand">{lastMenuAction}</code>{' '}
            (Use <Kbd keys={['↑', '↓']} size="sm" /> &amp; typeahead when open)
          </div>
        </div>
      </DemoCard>

      {/* 24. Progress */}
      <DemoCard
        id="comp-progress"
        name="Progress"
        category="feedback"
        cssClass=".omai-progress"
        tagline="Dual-mode progress indicator supporting smooth bars and authentic btop-style █▓▒░ segmented block meters."
        defaultShowCode
        code={`<Progress variant="blocks" segments={24} value={72} tone="brand" label="CPU Core 0" showValue />
<Progress variant="bar" value={72} tone="info" label="Compiling rustc" showValue />
<Progress variant="bar" value={null} label="Indeterminate Initramfs..." />`}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-omai-text-secondary">
              Adjust Live Meter ({progressVal}%):
            </span>
            <div className="w-48">
              <Slider
                aria-label="Adjust progress demo value"
                value={progressVal}
                onValueChange={setProgressVal}
                min={0}
                max={100}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3 border border-omai-border-subtle bg-omai-surface p-3.5 rounded-omai-md">
              <span className="font-mono text-xs font-bold text-omai-brand uppercase">
                variant=&quot;blocks&quot; (btop █▓▒░ segments)
              </span>
              <Progress
                variant="blocks"
                segments={22}
                value={progressVal}
                tone="brand"
                label="CPU // 9950X"
                showValue
              />
              <Progress
                variant="blocks"
                segments={22}
                value={Math.min(100, progressVal + 15)}
                tone="warning"
                label="MEM // 64GB"
                showValue
              />
              <Progress
                variant="blocks"
                segments={22}
                value={Math.max(10, progressVal - 25)}
                tone="info"
                label="NVME // BTRFS"
                showValue
              />
            </div>

            <div className="space-y-3 border border-omai-border-subtle bg-omai-surface p-3.5 rounded-omai-md">
              <span className="font-mono text-xs font-bold text-omai-info uppercase">
                variant=&quot;bar&quot; (smooth + indeterminate)
              </span>
              <Progress
                variant="bar"
                size="md"
                value={progressVal}
                tone="brand"
                label="mkinitcpio -P"
                showValue
              />
              <Progress
                variant="bar"
                size="lg"
                value={88}
                tone="success"
                label="Root Filesystem Scrub"
                showValue
              />
              <Progress
                variant="bar"
                size="sm"
                value={null}
                tone="info"
                label="Synchronizing pacman keyring (indeterminate)..."
              />
            </div>
          </div>
        </div>
      </DemoCard>
    </div>
  );
}
