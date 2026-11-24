import { useState } from 'react';
import {
  Badge,
  Breadcrumb,
  Button,
  CodeBlock,
  KeyValueList,
  Pagination,
  SidebarNav,
  type SidebarNavSection,
  StatCard,
  Table,
  type TableColumn,
  Tabs,
} from '@jseramn/omai';
import {
  Activity,
  Cpu,
  Database,
  FileCode,
  Folder,
  HardDrive,
  Home,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Server,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { DemoCard } from './DemoCard';

interface ProcessRow {
  pid: number;
  process: string;
  user: string;
  cpu: number;
  memMb: number;
  status: 'running' | 'sleeping' | 'realtime';
}

const PROCESS_DATA: readonly ProcessRow[] = [
  { pid: 842, process: 'Hyprland', user: 'jseramn', cpu: 3.8, memMb: 184, status: 'realtime' },
  { pid: 1024, process: 'ghostty', user: 'jseramn', cpu: 1.4, memMb: 112, status: 'running' },
  { pid: 1190, process: 'waybar', user: 'jseramn', cpu: 0.4, memMb: 48, status: 'sleeping' },
  { pid: 1205, process: 'walker --gapplication', user: 'jseramn', cpu: 0.1, memMb: 34, status: 'sleeping' },
  { pid: 2410, process: 'rustc --crate-name omai', user: 'jseramn', cpu: 42.6, memMb: 890, status: 'running' },
  { pid: 3102, process: 'pipewire-pulse', user: 'jseramn', cpu: 0.7, memMb: 29, status: 'realtime' },
];

const PROCESS_COLUMNS: readonly TableColumn<ProcessRow>[] = [
  { key: 'pid', header: 'PID', accessor: 'pid', sortable: true, width: 90, mono: true },
  {
    key: 'process',
    header: 'Process Command',
    accessor: 'process',
    sortable: true,
    cell: (row) => <span className="font-mono font-semibold text-omai-text">{row.process}</span>,
  },
  { key: 'user', header: 'User', accessor: 'user', sortable: true, width: 100 },
  {
    key: 'cpu',
    header: 'CPU %',
    accessor: 'cpu',
    align: 'right',
    sortable: true,
    sortValue: (row) => row.cpu,
    cell: (row) => (
      <span className={row.cpu > 20 ? 'text-omai-warning font-bold' : 'text-omai-text'}>
        {row.cpu.toFixed(1)}%
      </span>
    ),
  },
  {
    key: 'memMb',
    header: 'RSS (MiB)',
    accessor: 'memMb',
    align: 'right',
    sortable: true,
    sortValue: (row) => row.memMb,
    cell: (row) => `${row.memMb} MiB`,
  },
  {
    key: 'status',
    header: 'Sched',
    accessor: 'status',
    sortable: true,
    cell: (row) => (
      <Badge
        size="sm"
        tone={
          row.status === 'realtime'
            ? 'brand'
            : row.status === 'running'
              ? 'success'
              : 'neutral'
        }
        dot
      >
        {row.status}
      </Badge>
    ),
  },
];

const SIDEBAR_DEMO_SECTIONS: readonly SidebarNavSection[] = [
  {
    id: 'sys',
    title: 'OMAI Session',
    items: [
      {
        id: 'ws-compositor',
        label: 'Hyprland Compositor',
        icon: <LayoutGrid size={15} strokeWidth={1.75} aria-hidden />,
        shortcut: ['Super', '1'],
      },
      {
        id: 'ws-terminal',
        label: 'Ghostty Shells',
        icon: <TerminalIcon size={15} strokeWidth={1.75} aria-hidden />,
        badge: <Badge tone="brand" size="sm">3</Badge>,
        items: [
          { id: 'ws-term-main', label: 'zsh (~/omai)' },
          { id: 'ws-term-logs', label: 'journalctl -f' },
        ],
      },
      {
        id: 'ws-storage',
        label: 'Btrfs Subvolumes',
        icon: <HardDrive size={15} strokeWidth={1.75} aria-hidden />,
      },
    ],
  },
];

export function NavigationDemos() {
  const [sidebarActive, setSidebarActive] = useState('ws-compositor');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [page, setPage] = useState(4);

  return (
    <div className="space-y-6">
      {/* 25. Tabs */}
      <DemoCard
        id="comp-tabs"
        name="Tabs"
        category="navigation"
        cssClass=".omai-tabs"
        tagline="WAI-ARIA roving tablist in underline (2px brand bar) and boxed variants with icons, badges, and panels."
        defaultShowCode
        code={`<Tabs
  variant="underline"
  items={[
    { value: 'hypr', label: 'hyprland.conf', content: <p>Compositor bindings</p> },
    { value: 'waybar', label: 'waybar.jsonc', badge: <Badge size="sm">26px</Badge>, content: <p>Bar modules</p> },
  ]}
/>`}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="border border-omai-border-subtle bg-omai-surface p-3.5 rounded-omai-md">
            <span className="mb-2 block font-mono text-xs text-omai-text-muted">
              VARIANT=&quot;UNDERLINE&quot; (DEFAULT):
            </span>
            <Tabs
              aria-label="Dotfiles configuration tabs"
              variant="underline"
              items={[
                {
                  value: 'hypr',
                  label: 'hyprland.conf',
                  icon: <LayoutGrid size={14} strokeWidth={1.75} aria-hidden />,
                  content: (
                    <div className="pt-3 font-mono text-xs text-omai-text-secondary">
                      <code>general &#123; gaps_in = 5; gaps_out = 10; border_size = 2; &#125;</code>
                    </div>
                  ),
                },
                {
                  value: 'waybar',
                  label: 'waybar.jsonc',
                  badge: (
                    <Badge tone="brand" size="sm">
                      26px
                    </Badge>
                  ),
                  content: (
                    <div className="pt-3 font-mono text-xs text-omai-text-secondary">
                      <code>&quot;modules-left&quot;: [&quot;custom/omai&quot;, &quot;hyprland/workspaces&quot;]</code>
                    </div>
                  ),
                },
                {
                  value: 'ghostty',
                  label: 'ghostty/config',
                  content: (
                    <div className="pt-3 font-mono text-xs text-omai-text-secondary">
                      <code>theme = tokyo-night · window-padding-x = 12</code>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="border border-omai-border-subtle bg-omai-surface p-3.5 rounded-omai-md">
            <span className="mb-2 block font-mono text-xs text-omai-text-muted">
              VARIANT=&quot;BOXED&quot;:
            </span>
            <Tabs
              aria-label="Package manager tabs"
              variant="boxed"
              items={[
                {
                  value: 'pacman',
                  label: 'Pacman',
                  content: (
                    <div className="pt-3 font-mono text-xs text-omai-text-secondary">
                      Official Arch repositories: core, extra, multilib.
                    </div>
                  ),
                },
                {
                  value: 'aur',
                  label: 'Yay (AUR)',
                  badge: (
                    <Badge tone="info" size="sm">
                      14
                    </Badge>
                  ),
                  content: (
                    <div className="pt-3 font-mono text-xs text-omai-text-secondary">
                      User-maintained PKGBUILDs built from source.
                    </div>
                  ),
                },
                {
                  value: 'flatpak',
                  label: 'Flatpak (Disabled)',
                  disabled: true,
                  content: null,
                },
              ]}
            />
          </div>
        </div>
      </DemoCard>

      {/* 26. Breadcrumb */}
      <DemoCard
        id="comp-breadcrumb"
        name="Breadcrumb"
        category="navigation"
        cssClass=".omai-breadcrumb"
        tagline="Filesystem & route trail with aria-current='page' on the final segment and optional maxItems middle collapse."
        code={`<Breadcrumb
  items={[
    { label: '~', href: '#overview' },
    { label: '.config', href: '#foundations' },
    { label: 'omai', href: '#components' },
    { label: 'theme.toml' },
  ]}
/>`}
      >
        <div className="space-y-3">
          <div className="border border-omai-border-subtle bg-omai-surface p-3 rounded-omai-sm">
            <Breadcrumb
              items={[
                {
                  label: 'root',
                  icon: <Home size={13} strokeWidth={1.75} aria-hidden />,
                  onClick: (e) => e.preventDefault(),
                },
                {
                  label: '.config',
                  icon: <Folder size={13} strokeWidth={1.75} aria-hidden />,
                  onClick: (e) => e.preventDefault(),
                },
                { label: 'omai', onClick: (e) => e.preventDefault() },
                { label: 'themes', onClick: (e) => e.preventDefault() },
                {
                  label: 'tokyo-night.toml',
                  icon: <FileCode size={13} strokeWidth={1.75} aria-hidden />,
                },
              ]}
            />
          </div>

          <div className="border border-omai-border-subtle bg-omai-surface p-3 rounded-omai-sm">
            <span className="mb-1 block font-mono text-[11px] text-omai-text-muted">
              WITH maxItems={3} TRUNCATION:
            </span>
            <Breadcrumb
              maxItems={3}
              separator="›"
              items={[
                { label: 'usr' },
                { label: 'share' },
                { label: 'omai' },
                { label: 'bin' },
                { label: 'omai-theme-set' },
              ]}
            />
          </div>
        </div>
      </DemoCard>

      {/* 27. SidebarNav */}
      <DemoCard
        id="comp-sidebar-nav"
        name="SidebarNav"
        category="navigation"
        cssClass=".omai-sidebar-nav"
        tagline="Hierarchical navigation rail with collapsible nested children, 2px left brand indicator, and icon-only collapsed mode."
        code={`<SidebarNav
  sections={SIDEBAR_DEMO_SECTIONS}
  activeId={activeId}
  collapsed={collapsed}
  onNavigate={(item) => setActiveId(item.id)}
/>`}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className={sidebarCollapsed ? 'w-14 shrink-0' : 'w-64 shrink-0'}>
            <SidebarNav
              aria-label="Demo sidebar navigation"
              sections={SIDEBAR_DEMO_SECTIONS}
              activeId={sidebarActive}
              collapsed={sidebarCollapsed}
              onNavigate={(item, e) => {
                e.preventDefault();
                setSidebarActive(item.id);
              }}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between border border-omai-border-subtle bg-omai-surface p-4 rounded-omai-md">
            <div>
              <div className="font-mono text-xs text-omai-text-muted">ACTIVE NODE:</div>
              <div className="mt-1 font-mono text-sm font-bold text-omai-brand">{sidebarActive}</div>
              <p className="mt-2 font-mono text-xs text-omai-text-secondary">
                Click items in the sidebar (including expandable &quot;Ghostty Shells&quot;) or toggle
                collapsed rail mode below.
              </p>
            </div>
            <div className="mt-4">
              <Button
                size="sm"
                variant="secondary"
                leadingIcon={
                  sidebarCollapsed ? (
                    <PanelLeftOpen size={14} strokeWidth={1.75} aria-hidden />
                  ) : (
                    <PanelLeftClose size={14} strokeWidth={1.75} aria-hidden />
                  )
                }
                onClick={() => setSidebarCollapsed((c) => !c)}
              >
                {sidebarCollapsed ? 'Expand Sidebar' : 'Collapse to Icon Rail'}
              </Button>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* 28. Pagination */}
      <DemoCard
        id="comp-pagination"
        name="Pagination"
        category="navigation"
        cssClass=".omai-pagination"
        tagline="1-based page navigator with smart ellipsis range truncation, prev/next/first/last controls, and aria-current='page'."
        code={`<Pagination
  pageCount={16}
  page={page}
  onPageChange={setPage}
  showFirstLast
/>`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Pagination
            pageCount={16}
            page={page}
            onPageChange={setPage}
            showFirstLast
          />
          <span className="font-mono text-xs text-omai-text-secondary">
            Viewing Kernel Log Page <strong className="text-omai-brand">{page}</strong> of 16
          </span>
        </div>
      </DemoCard>
    </div>
  );
}

export function DataDisplayDemos() {
  const [selectedPid, setSelectedPid] = useState<number>(2410);
  const [compactTable, setCompactTable] = useState(false);
  const [kvLayout, setKvLayout] = useState<'horizontal' | 'stacked'>('horizontal');

  return (
    <div className="space-y-6">
      {/* 29. Table */}
      <DemoCard
        id="comp-table"
        name="Table"
        category="data"
        cssClass=".omai-table"
        tagline="Sortable data table with aria-sort headers, tabular-nums mono cells, compact/normal density, and row selection."
        defaultShowCode
        code={`<Table
  columns={PROCESS_COLUMNS}
  data={PROCESS_DATA}
  defaultSort={{ key: 'cpu', direction: 'desc' }}
  selectedKeys={[selectedPid]}
  onRowClick={(row) => setSelectedPid(row.pid)}
/>`}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs text-omai-text-secondary">
              Click any column header to sort · Click any row to select PID (Selected:{' '}
              <strong className="text-omai-brand">{selectedPid}</strong>)
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCompactTable((v) => !v)}
            >
              Density: {compactTable ? 'compact' : 'normal'}
            </Button>
          </div>
          <div className="w-full max-w-full min-w-0 overflow-x-auto">
            <Table
              columns={PROCESS_COLUMNS}
              data={PROCESS_DATA}
              getRowKey={(row) => row.pid}
              defaultSort={{ key: 'cpu', direction: 'desc' }}
              density={compactTable ? 'compact' : 'normal'}
              striped
              selectedKeys={[selectedPid]}
              onRowClick={(row) => setSelectedPid(row.pid)}
            />
          </div>
        </div>
      </DemoCard>

      {/* 30. CodeBlock */}
      <DemoCard
        id="comp-code-block"
        name="CodeBlock"
        category="data"
        cssClass=".omai-code-block"
        tagline="Deep-surface source code viewer (--omai-bg-deep) with filename header, line numbering, highlighted lines, and clipboard copy."
        code={`<CodeBlock
  title="~/.config/hypr/hyprland.conf"
  language="ini"
  showLineNumbers
  highlightLines={[3, 4]}
  code={code}
/>`}
      >
        <CodeBlock
          title="~/.config/hypr/hyprland.conf"
          language="ini"
          showLineNumbers
          highlightLines={[3, 4, 8]}
          code={`# OMAI Hyprland Look & Feel
general {
  gaps_in = 5
  gaps_out = 10
  border_size = 2
  col.active_border = rgb(9ece6a)
  col.inactive_border = rgb(414868)
  layout = dwindle
}`}
        />
      </DemoCard>

      {/* 31. StatCard */}
      <DemoCard
        id="comp-stat-card"
        name="StatCard"
        category="data"
        cssClass=".omai-stat-card"
        tagline="Telemetry & KPI metric card featuring directional delta badge, btop-style meter bar, and ▁▂▃▄▅▆▇█ Unicode sparkline."
        defaultShowCode
        code={`<StatCard
  label="CPU Package Load"
  value="34.2"
  unit="%"
  delta={{ value: '-4.1%', direction: 'down', tone: 'success' }}
  meter={34}
  sparkline={[22, 28, 45, 62, 48, 39, 34]}
/>`}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="CPU // RYZEN 9 9950X"
            value="34.2"
            unit="%"
            icon={<Cpu size={16} strokeWidth={1.75} aria-hidden />}
            delta={{ value: '-4.1%', direction: 'down', tone: 'success' }}
            tone="brand"
            meter={34}
            sparkline={[18, 25, 42, 68, 51, 39, 31, 34]}
            description="16C/32T @ 5.42 GHz · governor: schedutil"
          />

          <StatCard
            label="MEM // DDR5-6400 ECC"
            value="18.4"
            unit="GiB"
            icon={<Database size={16} strokeWidth={1.75} aria-hidden />}
            delta={{ value: '+1.2 GiB', direction: 'up', tone: 'warning' }}
            tone="info"
            meter={58}
            sparkline={[40, 42, 45, 49, 52, 55, 57, 58]}
            description="32.0 GiB total · zram0 compressed 4.1 GiB"
          />

          <StatCard
            label="NVME // BTRFS RAID0"
            value="6.84"
            unit="GB/s"
            icon={<Activity size={16} strokeWidth={1.75} aria-hidden />}
            delta={{ value: 'PCIe 5.0 x4', direction: 'flat', tone: 'neutral' }}
            tone="success"
            meter={82}
            sparkline={[30, 50, 75, 90, 84, 78, 80, 82]}
            description="Queue depth 32 · iowait 0.02%"
          />
        </div>
      </DemoCard>

      {/* 32. KeyValueList */}
      <DemoCard
        id="comp-key-value-list"
        name="KeyValueList"
        category="data"
        cssClass=".omai-kv-list"
        tagline="Structured definition list (<dl>) supporting horizontal or stacked layout, dense rows, and per-item clipboard copy."
        code={`<KeyValueList
  layout="horizontal"
  items={[
    { key: 'kernel', label: 'Kernel', value: '6.14.2-arch1-1-zen', mono: true, copyable: true },
    { key: 'wm', label: 'Compositor', value: 'Hyprland 0.48.0 (Wayland)', mono: true },
  ]}
/>`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-omai-text-secondary">
              Click copy icon on copyable rows · Toggle layout mode:
            </span>
            <Button
              size="sm"
              variant="secondary"
              leadingIcon={<Server size={14} strokeWidth={1.75} aria-hidden />}
              onClick={() =>
                setKvLayout((l) => (l === 'horizontal' ? 'stacked' : 'horizontal'))
              }
            >
              Layout: {kvLayout}
            </Button>
          </div>
          <div className="border border-omai-border-subtle bg-omai-surface p-4 rounded-omai-md">
            <KeyValueList
              layout={kvLayout}
              items={[
                {
                  key: 'distro',
                  label: 'Distribution',
                  value: 'OMAI Agent Interface (Omarchy Inspired)',
                  mono: true,
                },
                {
                  key: 'kernel',
                  label: 'Kernel Release',
                  value: '6.14.2-arch1-1-zen',
                  mono: true,
                  copyable: true,
                },
                {
                  key: 'compositor',
                  label: 'Wayland Session',
                  value: 'Hyprland 0.48.0 (Aquamarine)',
                  mono: true,
                  copyable: true,
                },
                {
                  key: 'shell',
                  label: 'Terminal / Shell',
                  value: 'ghostty 1.1.2 · zsh 5.9',
                  mono: true,
                  copyable: true,
                },
              ]}
            />
          </div>
        </div>
      </DemoCard>
    </div>
  );
}
