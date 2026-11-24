import { useState } from 'react';
import type { OmaiThemeId } from '@jseramn/omai-tokens';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  CodeBlock,
  Dialog,
  FormField,
  Input,
  Kbd,
  KeyValueList,
  OmaiProvider,
  Progress,
  Select,
  SidebarNav,
  StatCard,
  Table,
  type TableColumn,
  Tabs,
  Terminal,
  type TerminalLine,
  TilingGrid,
  type TilingLayout,
  useOmaiTheme,
  useToast,
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
  Activity,
  CloudUpload,
  Code2,
  Cpu,
  GitBranch,
  Globe,
  Layers,
  LayoutDashboard,
  Plus,
  Rocket,
  Server,
  ShieldCheck,
  Terminal as TerminalIcon,
  Wifi,
} from 'lucide-react';

interface DeploymentRecord {
  id: string;
  service: string;
  branch: string;
  region: string;
  latencyMs: number;
  status: 'healthy' | 'canary' | 'building';
  deployedAt: string;
}

const INITIAL_DEPLOYMENTS: readonly DeploymentRecord[] = [
  {
    id: 'dep-904',
    service: 'omai-edge-gateway',
    branch: 'main@9ece6a1',
    region: 'eu-central-fra',
    latencyMs: 11.4,
    status: 'healthy',
    deployedAt: '2m ago',
  },
  {
    id: 'dep-903',
    service: 'walker-telemetry-ingest',
    branch: 'feat/zstd-stream',
    region: 'us-east-iad',
    latencyMs: 18.2,
    status: 'canary',
    deployedAt: '14m ago',
  },
  {
    id: 'dep-902',
    service: 'pkgs-mirror-arch',
    branch: 'main@414868c',
    region: 'ap-northeast-hnd',
    latencyMs: 24.9,
    status: 'healthy',
    deployedAt: '1h ago',
  },
  {
    id: 'dep-901',
    service: 'auth-passkey-daemon',
    branch: 'fix/webauthn-rp',
    region: 'eu-west-dub',
    latencyMs: 9.7,
    status: 'building',
    deployedAt: 'Just now',
  },
];

const DEPLOYMENT_COLUMNS: readonly TableColumn<DeploymentRecord>[] = [
  {
    key: 'id',
    header: 'Deploy ID',
    accessor: 'id',
    sortable: true,
    mono: true,
    width: 110,
  },
  {
    key: 'service',
    header: 'Service',
    accessor: 'service',
    sortable: true,
    cell: (row) => <span className="font-mono font-bold text-omai-text">{row.service}</span>,
  },
  {
    key: 'branch',
    header: 'Commit / Ref',
    accessor: 'branch',
    sortable: true,
    cell: (row) => (
      <span className="inline-flex items-center gap-1 font-mono text-xs text-omai-brand">
        <GitBranch size={12} strokeWidth={1.75} aria-hidden />
        {row.branch}
      </span>
    ),
  },
  { key: 'region', header: 'Edge Region', accessor: 'region', sortable: true },
  {
    key: 'latencyMs',
    header: 'P99 (ms)',
    accessor: 'latencyMs',
    align: 'right',
    sortable: true,
    sortValue: (row) => row.latencyMs,
    cell: (row) => `${row.latencyMs.toFixed(1)} ms`,
  },
  {
    key: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    cell: (row) => (
      <Badge
        size="sm"
        tone={
          row.status === 'healthy'
            ? 'success'
            : row.status === 'canary'
              ? 'warning'
              : 'info'
        }
        dot
      >
        {row.status}
      </Badge>
    ),
  },
];

const EDITOR_FILES: Record<string, { lang: string; code: string }> = {
  'OmaiDesktop.tsx': {
    lang: 'tsx',
    code: `import { OmaiProvider, Waybar, TilingGrid, WindowPane } from '@jseramn/omai';

export function DesktopSession() {
  return (
    <OmaiProvider defaultTheme="tokyo-night" defaultRadius="sharp">
      <Waybar sticky left={<WaybarLogo />} center={<WaybarClock />} />
      <TilingGrid layout="dwindle" height={520}>
        <WindowPane id="nvim" title="nvim // OmaiDesktop.tsx">...</WindowPane>
        <WindowPane id="ghostty" title="ghostty // zsh">...</WindowPane>
        <WindowPane id="btop" title="btop++ // telemetry">...</WindowPane>
      </TilingGrid>
    </OmaiProvider>
  );
}`,
  },
  'colors.toml': {
    lang: 'toml',
    code: `# Omarchy Theme Palette Contract
accent = "#9ece6a"
background = "#1a1b26"
dark_background = "#13141c"
lighter_background = "#24283b"
foreground = "#c0caf5"
muted = "#414868"
color0 = "#15161e"
color2 = "#9ece6a"
color4 = "#7aa2f7"`,
  },
};

export function TemplatesSection() {
  const { meta, themes } = useOmaiTheme();
  const { toast } = useToast();

  // Template 1: Omarchy Desktop Workspace State
  const [wsNumber, setWsNumber] = useState(1);
  const [desktopLayout, setDesktopLayout] = useState<TilingLayout>('dwindle');
  const [desktopActivePane, setDesktopActivePane] = useState('pane-nvim');
  const [activeEditorFile, setActiveEditorFile] = useState<'OmaiDesktop.tsx' | 'colors.toml'>(
    'OmaiDesktop.tsx',
  );
  const [termLines, setTermLines] = useState<readonly TerminalLine[]>([
    { type: 'command', text: 'hyprctl version' },
    {
      type: 'output',
      text: '\u001b[1;32mHyprland 0.48.0\u001b[0m built from branch \u001b[36mmain\u001b[0m (Aquamarine 0.8.0)',
    },
    { type: 'command', text: 'omai-theme current' },
    {
      type: 'output',
      text: `\u001b[32m●\u001b[0m Active palette: \u001b[1m${meta.name}\u001b[0m (${meta.mode})`,
    },
  ]);

  // Template 2: DevOps / SaaS Web App Dashboard State
  const [saasScopeTheme, setSaasScopeTheme] = useState<'inherit' | OmaiThemeId>('inherit');
  const [saasNavId, setSaasNavId] = useState('nav-deployments');
  const [deployments, setDeployments] = useState<readonly DeploymentRecord[]>(INITIAL_DEPLOYMENTS);
  const [selectedDeployId, setSelectedDeployId] = useState('dep-904');
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('omai-cdn-worker');
  const [newServiceRegion, setNewServiceRegion] = useState('eu-central-fra');

  const runTerminalCommand = (cmd: string, out: string) => {
    setTermLines((prev) => [
      ...prev.slice(-6),
      { type: 'command', text: cmd },
      { type: 'output', text: out },
    ]);
    setDesktopActivePane('pane-ghostty');
  };

  const handleTriggerDeploy = () => {
    const nextId = `dep-${901 + deployments.length}`;
    const created: DeploymentRecord = {
      id: nextId,
      service: newServiceName.trim() || 'omai-worker',
      branch: 'main@HEAD',
      region: newServiceRegion,
      latencyMs: 10.2,
      status: 'healthy',
      deployedAt: 'Just now',
    };
    setDeployments((prev) => [created, ...prev]);
    setSelectedDeployId(nextId);
    setDeployDialogOpen(false);
    toast({
      appName: 'omai-cloud',
      title: `Deployed ${created.service} (${nextId})`,
      description: `Region ${created.region} healthy in 420ms`,
      tone: 'success',
      timestamp: new Date(),
    });
  };

  const saasDashboardContent = (
    <div className="border border-omai-border-strong bg-omai-bg text-omai-text rounded-omai-md">
      {/* SaaS Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-omai-border-subtle bg-omai-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center border border-omai-brand bg-omai-brand-soft font-mono text-xs font-bold text-omai-brand">
            OM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-semibold text-omai-text">
                OMAI Agent Control Plane
              </span>
              <Badge tone="success" variant="soft" size="sm" dot>
                ALL SYSTEMS NOMINAL
              </Badge>
            </div>
            <span className="font-mono text-[11px] text-omai-text-muted">
              org: jseramn-omai · cluster: prod-baremetal-01
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Dialog
            open={deployDialogOpen}
            onOpenChange={setDeployDialogOpen}
            trigger={
              <Button
                size="sm"
                variant="primary"
                leadingIcon={<Plus size={14} strokeWidth={1.75} aria-hidden />}
              >
                New Deployment
              </Button>
            }
            title="Trigger Edge Service Rollout"
            description="Deploys an immutable Nix/Arch container image to the selected bare-metal region."
            footer={
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setDeployDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leadingIcon={<CloudUpload size={14} strokeWidth={1.75} aria-hidden />}
                  onClick={handleTriggerDeploy}
                >
                  Rollout Service
                </Button>
              </div>
            }
          >
            <div className="space-y-3">
              <FormField label="Service Identifier" required>
                <Input
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                />
              </FormField>
              <FormField label="Target Edge PoP">
                <Select
                  value={newServiceRegion}
                  onChange={(e) => setNewServiceRegion(e.target.value)}
                  options={[
                    { value: 'eu-central-fra', label: 'Frankfurt (eu-central-fra)' },
                    { value: 'us-east-iad', label: 'Virginia (us-east-iad)' },
                    { value: 'ap-northeast-hnd', label: 'Tokyo (ap-northeast-hnd)' },
                  ]}
                />
              </FormField>
            </div>
          </Dialog>
          <Avatar name="Jseramn" size="sm" status="online" />
        </div>
      </div>

      {/* SaaS Body: SidebarNav + Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="min-w-0 border-b border-omai-border-subtle bg-omai-bg-deep/40 p-3 lg:col-span-3 lg:border-r lg:border-b-0">
          <SidebarNav
            aria-label="SaaS template sidebar"
            activeId={saasNavId}
            onNavigate={(item, e) => {
              e.preventDefault();
              setSaasNavId(item.id);
            }}
            sections={[
              {
                id: 'saas-sec',
                title: 'Infrastructure',
                items: [
                  {
                    id: 'nav-deployments',
                    label: 'Deployments',
                    icon: <Rocket size={14} strokeWidth={1.75} aria-hidden />,
                    badge: (
                      <Badge tone="brand" size="sm">
                        {deployments.length}
                      </Badge>
                    ),
                  },
                  {
                    id: 'nav-nodes',
                    label: 'Bare-Metal Nodes',
                    icon: <Server size={14} strokeWidth={1.75} aria-hidden />,
                  },
                  {
                    id: 'nav-edge',
                    label: 'Anycast DNS',
                    icon: <Globe size={14} strokeWidth={1.75} aria-hidden />,
                  },
                  {
                    id: 'nav-security',
                    label: 'WireGuard Mesh',
                    icon: <ShieldCheck size={14} strokeWidth={1.75} aria-hidden />,
                  },
                ],
              },
            ]}
          />
        </div>

        <div className="min-w-0 space-y-5 p-4 sm:p-5 lg:col-span-9">
          <Alert
            tone="info"
            title="Zero-Downtime Kernel Livepatch Applied"
            action={
              <Badge tone="success" variant="solid" size="sm">
                kpatch 6.14.2
              </Badge>
            }
          >
            All 24 bare-metal nodes updated without dropping active TLS sockets.
          </Alert>

          {/* 3 KPI StatCards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              label="GLOBAL THROUGHPUT"
              value="148.2"
              unit="k req/s"
              delta={{ value: '+14.8%', direction: 'up', tone: 'success' }}
              tone="brand"
              meter={78}
              sparkline={[42, 48, 55, 63, 71, 69, 75, 78]}
            />
            <StatCard
              label="MEDIAN EDGE LATENCY"
              value="11.4"
              unit="ms"
              delta={{ value: '-2.1 ms', direction: 'down', tone: 'success' }}
              tone="success"
              meter={22}
              sparkline={[19, 17, 15, 14, 13, 12, 12, 11]}
            />
            <StatCard
              label="ERROR BUDGET REMAINING"
              value="99.98"
              unit="%"
              delta={{ value: 'SLO 99.95%', direction: 'flat', tone: 'neutral' }}
              tone="info"
              meter={99}
              sparkline={[99, 99, 100, 99, 100, 100, 99, 100]}
            />
          </div>

          {/* Tabs + Sortable Deployments Table */}
          <Tabs
            aria-label="SaaS dashboard view tabs"
            variant="underline"
            items={[
              {
                value: 'rollouts',
                label: 'Active Rollouts',
                badge: (
                  <Badge tone="brand" size="sm">
                    {deployments.length}
                  </Badge>
                ),
                content: (
                  <div className="w-full max-w-full min-w-0 overflow-x-auto pt-3">
                    <Table
                      columns={DEPLOYMENT_COLUMNS}
                      data={deployments}
                      getRowKey={(row) => row.id}
                      defaultSort={{ key: 'id', direction: 'desc' }}
                      density="compact"
                      striped
                      selectedKeys={[selectedDeployId]}
                      onRowClick={(row) => setSelectedDeployId(row.id)}
                    />
                  </div>
                ),
              },
              {
                value: 'topology',
                label: 'Cluster Specs',
                content: (
                  <div className="pt-3">
                    <KeyValueList
                      items={[
                        {
                          key: 'ingress',
                          label: 'Anycast VIP',
                          value: '185.199.108.153 / 2606:50c0::1',
                          mono: true,
                          copyable: true,
                        },
                        {
                          key: 'tls',
                          label: 'TLS Termination',
                          value: 'Rustls 0.23 · TLS 1.3 + X25519MLKEM768',
                          mono: true,
                        },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="templates"
      aria-labelledby="templates-heading"
      className="border-b border-omai-border-subtle bg-omai-bg py-14"
    >
      <div className="mx-auto max-w-omai px-4 sm:px-6">
        {/* Section Header */}
        <div className="border-b border-omai-border-subtle pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand" size="sm">
              SECTION 05 // LIVE APPLICATION TEMPLATES
            </Badge>
            <Badge tone="info" variant="soft" size="sm">
              Desktop OS Workspace + Production SaaS Web App
            </Badge>
          </div>
          <h2
            id="templates-heading"
            className="mt-2 font-sans text-2xl font-semibold tracking-tight text-omai-text sm:text-3xl"
          >
            Full-Stack Templates Built 100% with @jseramn/omai
          </h2>
          <p className="mt-1 max-w-3xl font-mono text-xs text-omai-text-secondary sm:text-sm">
            From an authentic Hyprland tiling desktop environment with Waybar and Ghostty to a
            high-density DevOps SaaS dashboard that shines in both dark and light modes.
          </p>
        </div>

        {/* TEMPLATE 1: Omarchy Desktop Workspace */}
        <div className="mt-10">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge tone="brand" variant="solid" size="sm">
                  TEMPLATE 01
                </Badge>
                <h3 className="font-sans text-lg font-semibold text-omai-text">
                  OMAI Hyprland Agent Workspace
                </h3>
              </div>
              <p className="mt-0.5 font-mono text-xs text-omai-text-secondary">
                Combines <code className="text-omai-brand">Waybar</code> +{' '}
                <code className="text-omai-brand">TilingGrid</code> + 3 live{' '}
                <code className="text-omai-brand">WindowPane</code> surfaces (Code Editor, Ghostty
                Terminal, and btop Activity Monitor).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-xs text-omai-text-muted">LAYOUT:</span>
              {(['dwindle', 'master', 'columns'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setDesktopLayout(l)}
                  aria-pressed={desktopLayout === l}
                  className="border border-omai-border-subtle bg-omai-surface px-2.5 py-1 font-mono text-xs text-omai-text uppercase hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden border border-omai-border-strong bg-omai-bg-deep rounded-omai-md">
            {/* Top 26px Waybar inside the desktop monitor frame */}
            <Waybar
              variant="opaque"
              left={
                <>
                  <WaybarLogo />
                  <WaybarWorkspaces
                    count={5}
                    active={wsNumber}
                    occupied={[1, 2, 3]}
                    onSelect={setWsNumber}
                  />
                  <WaybarLayoutIndicator
                    layout={desktopLayout === 'columns' ? 'scrolling' : 'dwindle'}
                  />
                  <span className="ml-2 hidden font-mono text-[11px] text-omai-text-secondary sm:inline">
                    [ws:{wsNumber}] {desktopActivePane}
                  </span>
                </>
              }
              center={<WaybarClock />}
              right={
                <>
                  <WaybarStat
                    icon={<Cpu size={12} strokeWidth={1.75} aria-hidden />}
                    label="CPU"
                    value="31%"
                    meter={31}
                    tone="brand"
                  />
                  <WaybarModule
                    icon={<Wifi size={12} strokeWidth={1.75} aria-hidden />}
                    label="eth0 10GbE"
                  />
                  <WaybarModule active tone="brand" label={meta.name} />
                </>
              }
            />

            {/* Hyprland TilingGrid Workspace */}
            <TilingGrid
              layout={desktopLayout}
              activeId={desktopActivePane}
              onActiveChange={setDesktopActivePane}
              height={520}
            >
              {/* Pane 1: Neovim Code Editor */}
              <WindowPane
                id="pane-nvim"
                title={`nvim // ${activeEditorFile}`}
                icon={<Code2 size={13} strokeWidth={1.75} aria-hidden />}
                padding="sm"
                actions={
                  <div className="flex items-center gap-1">
                    {(['OmaiDesktop.tsx', 'colors.toml'] as const).map((fname) => (
                      <button
                        key={fname}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveEditorFile(fname);
                        }}
                        aria-pressed={activeEditorFile === fname}
                        className="border border-omai-border-subtle bg-omai-bg px-1.5 py-0.5 font-mono text-[10px] text-omai-text-secondary aria-pressed:border-omai-brand aria-pressed:text-omai-brand"
                      >
                        {fname}
                      </button>
                    ))}
                  </div>
                }
              >
                <CodeBlock
                  title={activeEditorFile}
                  language={EDITOR_FILES[activeEditorFile]!.lang}
                  code={EDITOR_FILES[activeEditorFile]!.code}
                  showLineNumbers
                  highlightLines={[1, 5, 7]}
                />
              </WindowPane>

              {/* Pane 2: Ghostty Terminal */}
              <WindowPane
                id="pane-ghostty"
                title="ghostty // zsh ~/omai"
                icon={<TerminalIcon size={13} strokeWidth={1.75} aria-hidden />}
                padding="sm"
                actions={
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        runTerminalCommand(
                          'npm run build',
                          '\u001b[32m✓\u001b[0m Built @jseramn/omai-tokens, @jseramn/omai, @jseramn/omai-docs in 1.18s',
                        );
                      }}
                      className="border border-omai-border-subtle bg-omai-bg px-1.5 py-0.5 font-mono text-[10px] text-omai-brand hover:bg-omai-surface-2"
                    >
                      + run build
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        runTerminalCommand(
                          'uname -srm',
                          'Linux 6.14.2-arch1-1-zen x86_64',
                        );
                      }}
                      className="border border-omai-border-subtle bg-omai-bg px-1.5 py-0.5 font-mono text-[10px] text-omai-text-secondary hover:bg-omai-surface-2"
                    >
                      + uname
                    </button>
                  </div>
                }
              >
                <Terminal
                  showChrome={false}
                  user="jseramn"
                  host="omai"
                  cwd="~/omai"
                  lines={termLines}
                />
              </WindowPane>

              {/* Pane 3: btop Activity Monitor */}
              <WindowPane
                id="pane-btop"
                title="btop++ // hardware telemetry"
                icon={<Activity size={13} strokeWidth={1.75} aria-hidden />}
                padding="sm"
              >
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <StatCard
                      label="CPU LOAD"
                      value="31.4"
                      unit="%"
                      tone="brand"
                      meter={31}
                      sparkline={[20, 28, 35, 42, 31, 29, 31]}
                    />
                    <StatCard
                      label="VRAM / GPU"
                      value="4.2"
                      unit="GiB"
                      tone="info"
                      meter={26}
                      sparkline={[22, 24, 25, 25, 26, 26, 26]}
                    />
                  </div>
                  <Progress
                    variant="blocks"
                    segments={18}
                    value={64}
                    tone="brand"
                    label="Core 0..7"
                    showValue
                  />
                  <Progress
                    variant="blocks"
                    segments={18}
                    value={38}
                    tone="success"
                    label="Core 8..15"
                    showValue
                  />
                  <KeyValueList
                    dense
                    items={[
                      { key: 'up', label: 'Uptime', value: '14d 07h 22m', mono: true },
                      { key: 'gov', label: 'Governor', value: 'performance', mono: true },
                    ]}
                  />
                </div>
              </WindowPane>
            </TilingGrid>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-omai-text-muted">
            <span>
              Tip: Click any of the 3 panes or press <Kbd keys={['Alt', 'Arrow']} size="sm" /> to
              switch the 2px <code className="text-omai-brand">--omai-brand</code> active window border.
            </span>
            <span>Active Workspace: #{wsNumber}</span>
          </div>
        </div>

        {/* TEMPLATE 2: DevOps / SaaS Web App Dashboard */}
        <div className="mt-14 border-t border-omai-border-subtle pt-10">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge tone="info" variant="solid" size="sm">
                  TEMPLATE 02
                </Badge>
                <h3 className="font-sans text-lg font-semibold text-omai-text">
                  DevOps &amp; Cloud SaaS Web App Dashboard
                </h3>
              </div>
              <p className="mt-0.5 font-mono text-xs text-omai-text-secondary">
                Production web application built with <code className="text-omai-text">SidebarNav</code>,{' '}
                <code className="text-omai-text">StatCard</code>, sortable{' '}
                <code className="text-omai-text">Table</code>, <code className="text-omai-text">Tabs</code>,{' '}
                <code className="text-omai-text">Alert</code>, and <code className="text-omai-text">Dialog</code>.
              </p>
            </div>

            {/* Scoped Theme Selector for Template 2 */}
            <div className="flex flex-wrap items-center gap-2 border border-omai-border-subtle bg-omai-surface px-3 py-1.5 rounded-omai-md">
              <LayoutDashboard size={14} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
              <span className="font-mono text-xs text-omai-text-secondary">
                Preview Dashboard Theme:
              </span>
              <Select
                size="sm"
                aria-label="Preview theme for SaaS template"
                value={saasScopeTheme}
                onChange={(e) =>
                  setSaasScopeTheme(e.target.value as 'inherit' | OmaiThemeId)
                }
                options={[
                  { value: 'inherit', label: `Global Active (${meta.name})` },
                  ...themes.map((t) => ({
                    value: t.id,
                    label: `${t.name} (${t.mode})`,
                  })),
                ]}
              />
              <Button
                size="sm"
                variant="secondary"
                 leadingIcon={<Layers size={13} strokeWidth={1.75} aria-hidden />}
                onClick={() =>
                  setSaasScopeTheme((curr) =>
                    curr === 'catppuccin-latte' ? 'tokyo-night' : 'catppuccin-latte',
                  )
                }
              >
                {saasScopeTheme === 'catppuccin-latte' ? 'Try Dark Scope' : 'Try Light Scope'}
              </Button>
            </div>
          </div>

          {saasScopeTheme === 'inherit' ? (
            saasDashboardContent
          ) : (
            <OmaiProvider
              target="scope"
              storageKey={null}
              theme={saasScopeTheme}
              className="rounded-omai-md"
            >
              {saasDashboardContent}
            </OmaiProvider>
          )}
        </div>
      </div>
    </section>
  );
}
