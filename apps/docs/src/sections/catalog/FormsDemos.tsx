import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  FormField,
  Input,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
  useToast,
} from '@jseramn/omai';
import { Lock, Search, Terminal as TerminalIcon } from 'lucide-react';
import { DemoCard } from './DemoCard';

const COMPOSITOR_OPTIONS = [
  { value: 'hyprland', label: 'Hyprland (Dynamic Tiling Wayland)' },
  { value: 'sway', label: 'Sway (i3-compatible Wayland)' },
  { value: 'niri', label: 'Niri (Scrollable Tiling Wayland)' },
  { value: 'river', label: 'River (Dynamic Tags Wayland)' },
] as const;

const LAYOUT_RADIO_OPTIONS = [
  {
    value: 'dwindle',
    label: 'Dwindle Split',
    description: 'Alternating binary Fibonacci split as new windows spawn',
  },
  {
    value: 'master',
    label: 'Master + Stack',
    description: 'Primary master window on left (55%), vertical stack on right',
  },
  {
    value: 'scrolling',
    label: 'Infinite Ribbon',
    description: 'Horizontal scrolling strip of full-height columns',
  },
] as const;

export function FormsDemos() {
  const { toast } = useToast();

  // Live stateful playground state
  const [hostname, setHostname] = useState('omai-workstation');
  const [compositor, setCompositor] = useState('hyprland');
  const [layoutMode, setLayoutMode] = useState('dwindle');
  const [gapsIn, setGapsIn] = useState(5);
  const [gapsOut, setGapsOut] = useState(10);
  const [blurEnabled, setBlurEnabled] = useState(true);
  const [tearingEnabled, setTearingEnabled] = useState(false);
  const [autostartWaybar, setAutostartWaybar] = useState(true);
  const [autostartMako, setAutostartMako] = useState(true);
  const [execConfig, setExecConfig] = useState(
    'exec-once = waybar\nexec-once = mako\nexec-once = walker --gapplication-service',
  );
  const [showErrorDemo, setShowErrorDemo] = useState(true);

  const allAutostart = autostartWaybar && autostartMako;
  const someAutostart = (autostartWaybar || autostartMako) && !allAutostart;

  const handleSavePlayground = () => {
    toast({
      appName: 'hyprctl',
      title: `Saved profile for ${hostname}`,
      description: `${compositor} (${layoutMode}) · gaps_in=${gapsIn}px · gaps_out=${gapsOut}px`,
      tone: 'success',
      timestamp: new Date(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Unified Interactive Hyprland Config Form Playground */}
      <Card variant="surface" padding="md" className="border-omai-brand">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-omai-border-subtle pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge tone="brand" size="sm" dot>
                LIVE STATEFUL FORM PLAYGROUND
              </Badge>
              <span className="font-mono text-xs text-omai-text-muted">
                All 8 Form Components Wired Together
              </span>
            </div>
            <h4 className="mt-1 font-sans text-base font-semibold text-omai-text">
              OMAI Agent Session Configurator
            </h4>
          </div>
          <Button size="sm" variant="primary" onClick={handleSavePlayground}>
            Apply &amp; Reload hyprctl
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            label="Workstation Hostname"
            description="Used in Ghostty prompt user@host"
            required
            error={hostname.trim().length < 3 ? 'Hostname must be at least 3 characters' : undefined}
          >
            <Input
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              leadingIcon={<TerminalIcon size={16} strokeWidth={1.75} aria-hidden />}
              placeholder="omai-workstation"
            />
          </FormField>

          <FormField label="Wayland Compositor" description="Select primary session binary" required>
            <Select
              value={compositor}
              onChange={(e) => setCompositor(e.target.value)}
              options={COMPOSITOR_OPTIONS}
            />
          </FormField>

          <FormField label={`Inner Window Gap (gaps_in: ${gapsIn}px)`}>
            <Slider
              value={gapsIn}
              onValueChange={setGapsIn}
              min={0}
              max={24}
              step={1}
              showValue
              formatValue={(v) => `${v}px`}
            />
          </FormField>

          <FormField label={`Outer Monitor Gap (gaps_out: ${gapsOut}px)`}>
            <Slider
              value={gapsOut}
              onValueChange={setGapsOut}
              min={0}
              max={40}
              step={2}
              showValue
              formatValue={(v) => `${v}px`}
            />
          </FormField>
        </div>
      </Card>

      {/* 10. FormField */}
      <DemoCard
        id="comp-form-field"
        name="FormField"
        category="forms"
        cssClass=".omai-form-field"
        tagline="Accessible field wrapper providing id, aria-describedby, aria-invalid, required indicator, and role='alert' error messages via useFormField()."
        defaultShowCode
        code={`<FormField
  label="SSH Private Key Passphrase"
  description="Ed25519 key stored in ~/.ssh/id_ed25519"
  error={hasError ? "Invalid passphrase signature" : undefined}
  required
>
  <Input type="password" defaultValue="omai-secret" />
</FormField>`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-omai-text-secondary">
              Toggle error state to inspect automatic <code>aria-invalid</code> propagation:
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowErrorDemo((v) => !v)}
            >
              {showErrorDemo ? 'Clear Error State' : 'Trigger Error State'}
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label="GPG Signing Key Fingerprint"
              description="40-character hex key used for git commit -S"
              required
              error={showErrorDemo ? 'Key 0x9ECE6A not found in local keyring' : undefined}
            >
              <Input
                defaultValue="0x9ECE6A1A1B26"
                leadingIcon={<Lock size={16} strokeWidth={1.75} aria-hidden />}
              />
            </FormField>

            <FormField
              label="Horizontal Layout"
              description="orientation='horizontal'"
              orientation="horizontal"
            >
              <Input defaultValue="wayland-1" />
            </FormField>
          </div>
        </div>
      </DemoCard>

      {/* 11. Input */}
      <DemoCard
        id="comp-input"
        name="Input"
        category="forms"
        cssClass=".omai-input"
        tagline="Monospace text input in sm/md/lg control heights with leadingIcon, trailingIcon, and invalid states."
        code={`<Input size="sm" placeholder="Small 32px input" />
<Input size="md" leadingIcon={<Search size={16} />} placeholder="Search packages..." />
<Input size="lg" invalid defaultValue="invalid-syntax" />`}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input
            size="sm"
            placeholder="Small (32px) input..."
            aria-label="Small input example"
          />
          <Input
            size="md"
            leadingIcon={<Search size={16} strokeWidth={1.75} aria-hidden />}
            placeholder="yay -Ss ghostty..."
            aria-label="Search packages input"
          />
          <Input
            size="lg"
            invalid
            defaultValue="border-danger-invalid"
            aria-label="Invalid input example"
          />
        </div>
      </DemoCard>

      {/* 12. Textarea */}
      <DemoCard
        id="comp-textarea"
        name="Textarea"
        category="forms"
        cssClass=".omai-textarea"
        tagline="Multi-line monospace text area supporting autoResize content growth and resize axis lock."
        code={`<Textarea
  autoResize
  value={execConfig}
  onChange={(e) => setExecConfig(e.target.value)}
/>`}
      >
        <FormField
          label="~/.config/hypr/autostart.conf (autoResize enabled)"
          description="Type additional lines to watch the textarea grow automatically"
        >
          <Textarea
            autoResize
            value={execConfig}
            onChange={(e) => setExecConfig(e.target.value)}
            rows={3}
          />
        </FormField>
      </DemoCard>

      {/* 13. Select */}
      <DemoCard
        id="comp-select"
        name="Select"
        category="forms"
        cssClass=".omai-select"
        tagline="Native <select> element with custom OMAI chevron chrome, placeholder support, and zero portal overhead."
        code={`<Select
  placeholder="Choose compositor..."
  options={[
    { value: 'hyprland', label: 'Hyprland' },
    { value: 'sway', label: 'Sway' },
  ]}
/>`}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Select
            size="sm"
            aria-label="Small compositor select"
            value={compositor}
            onChange={(e) => setCompositor(e.target.value)}
            options={COMPOSITOR_OPTIONS}
          />
          <Select
            size="md"
            aria-label="Medium compositor select"
            placeholder="Select audio server..."
            defaultValue="pipewire"
            options={[
              { value: 'pipewire', label: 'PipeWire + WirePlumber' },
              { value: 'jack', label: 'JACK Low-Latency Audio' },
              { value: 'pulse', label: 'PulseAudio Legacy' },
            ]}
          />
          <Select
            size="lg"
            aria-label="Large terminal select"
            defaultValue="ghostty"
            options={[
              { value: 'ghostty', label: 'Ghostty (GPU Accelerated)' },
              { value: 'foot', label: 'Foot (Wayland Native)' },
              { value: 'alacritty', label: 'Alacritty (OpenGL)' },
            ]}
          />
        </div>
      </DemoCard>

      {/* 14. Checkbox */}
      <DemoCard
        id="comp-checkbox"
        name="Checkbox"
        category="forms"
        cssClass=".omai-checkbox"
        tagline="Accessible checkbox supporting boolean or 'indeterminate' state, plus label and secondary description."
        code={`<Checkbox
  checked={someChecked ? 'indeterminate' : allChecked}
  onCheckedChange={toggleAll}
  label="Autostart System Daemons"
  description="Launch background services on Hyprland session init"
/>`}
      >
        <div className="space-y-3 border border-omai-border-subtle bg-omai-surface p-4 rounded-omai-md">
          <Checkbox
            checked={someAutostart ? 'indeterminate' : allAutostart}
            onCheckedChange={(next) => {
              setAutostartWaybar(next);
              setAutostartMako(next);
            }}
            label="Autostart All OMAI Daemons (Parent Indeterminate Demo)"
            description="Toggles both Waybar and Mako services below"
          />
          <div className="ml-6 space-y-2 border-l border-omai-border-subtle pl-4">
            <Checkbox
              checked={autostartWaybar}
              onCheckedChange={setAutostartWaybar}
              label="waybar.service"
              description="26px top status bar with workspace indicators"
            />
            <Checkbox
              checked={autostartMako}
              onCheckedChange={setAutostartMako}
              label="mako.service"
              description="Lightweight Wayland notification daemon"
            />
          </div>
        </div>
      </DemoCard>

      {/* 15. Switch */}
      <DemoCard
        id="comp-switch"
        name="Switch"
        category="forms"
        cssClass=".omai-switch"
        tagline="WAI-ARIA role='switch' toggle button with data-state='on|off' and optional hidden form input."
        code={`<Switch
  checked={blurEnabled}
  onCheckedChange={setBlurEnabled}
  label=" Kawase Dual-Pass Window Blur"
/>`}
      >
        <div className="flex flex-wrap items-center gap-6">
          <Switch
            checked={blurEnabled}
            onCheckedChange={setBlurEnabled}
            label={`Kawase Dual-Pass Blur (${blurEnabled ? 'ON' : 'OFF'})`}
          />
          <Switch
            size="sm"
            checked={tearingEnabled}
            onCheckedChange={setTearingEnabled}
            label={`DRM Page-Flip Tearing (${tearingEnabled ? 'ON' : 'OFF'})`}
          />
          <Switch disabled defaultChecked label="XWayland Rootless (Locked)" />
        </div>
      </DemoCard>

      {/* 16. RadioGroup */}
      <DemoCard
        id="comp-radio-group"
        name="RadioGroup"
        category="forms"
        cssClass=".omai-radio-group"
        tagline="Roving arrow-key radiogroup in vertical or horizontal orientation with option descriptions."
        code={`<RadioGroup
  value={layoutMode}
  onValueChange={setLayoutMode}
  options={LAYOUT_RADIO_OPTIONS}
/>`}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <span className="mb-2 block font-mono text-xs text-omai-text-muted">
              VERTICAL WITH DESCRIPTIONS:
            </span>
            <RadioGroup
              aria-label="Tiling algorithm"
              value={layoutMode}
              onValueChange={setLayoutMode}
              options={LAYOUT_RADIO_OPTIONS}
            />
          </div>
          <div>
            <span className="mb-2 block font-mono text-xs text-omai-text-muted">
              HORIZONTAL ORIENTATION:
            </span>
            <RadioGroup
              aria-label="Monitor refresh rate"
              orientation="horizontal"
              defaultValue="144"
              options={[
                { value: '60', label: '60 Hz' },
                { value: '144', label: '144 Hz' },
                { value: '240', label: '240 Hz' },
              ]}
            />
          </div>
        </div>
      </DemoCard>

      {/* 17. Slider */}
      <DemoCard
        id="comp-slider"
        name="Slider"
        category="forms"
        cssClass=".omai-slider"
        tagline="Range input with brand-filled track via --omai-slider-fill % and live formatted value badge."
        code={`<Slider
  value={gapsIn}
  onValueChange={setGapsIn}
  min={0}
  max={24}
  showValue
  formatValue={(v) => \`\${v}px\`}
/>`}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="border border-omai-border-subtle bg-omai-surface p-3.5 rounded-omai-md">
            <span className="mb-2 block font-mono text-xs text-omai-text-secondary">
              Hyprland Inner Gaps (<code>gaps_in</code>):
            </span>
            <Slider
              aria-label="Hyprland inner gaps"
              value={gapsIn}
              onValueChange={setGapsIn}
              min={0}
              max={24}
              step={1}
              showValue
              formatValue={(v) => `${v}px`}
            />
          </div>
          <div className="border border-omai-border-subtle bg-omai-surface p-3.5 rounded-omai-md">
            <span className="mb-2 block font-mono text-xs text-omai-text-secondary">
              Hyprland Outer Gaps (<code>gaps_out</code>):
            </span>
            <Slider
              aria-label="Hyprland outer gaps"
              value={gapsOut}
              onValueChange={setGapsOut}
              min={0}
              max={40}
              step={2}
              showValue
              formatValue={(v) => `${v}px`}
            />
          </div>
        </div>
      </DemoCard>
    </div>
  );
}
