import { useMemo, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import {
  Badge,
  Button,
  Drawer,
  HotkeyBar,
  Kbd,
  OmaiProvider,
  ToastProvider,
  useOmaiTheme,
  useToast,
  Walker,
  type WalkerItem,
  Waybar,
  WaybarClock,
  WaybarLogo,
  WaybarModule,
} from '@jseramn/omai';
import {
  Bell,
  Box,
  Command,
  Layers,
  LayoutGrid,
  Menu,
  Palette,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  COMPONENT_CATALOG,
  type ComponentCategoryId,
  DOCS_SECTIONS,
  type DocsSectionId,
} from './data/catalogMeta';
import { ComponentsCatalogSection } from './sections/ComponentsCatalogSection';
import { FoundationsSection } from './sections/FoundationsSection';
import { HeroSection } from './sections/HeroSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { UsageSection } from './sections/UsageSection';

function DocsWorkspaceShell() {
  const {
    theme,
    meta,
    themes,
    setTheme,
    cycleTheme,
    radius,
    setRadius,
    gaps,
    setGaps,
  } = useOmaiTheme();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<DocsSectionId>('overview');
  const [activeCategory, setActiveCategory] = useState<'all' | ComponentCategoryId>('all');
  const [activeComponentId, setActiveComponentId] = useState<string>('comp-button');
  const [walkerOpen, setWalkerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToElementId = (elementId: string) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const navigateToSection = (sectionId: DocsSectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'omai-os') {
      // Ensure the OMAI Shell category is visible when jumping to OMAI Shell
      if (activeCategory !== 'all' && activeCategory !== 'omai') {
        setActiveCategory('all');
      }
      scrollToElementId('cat-omai');
      return;
    }
    scrollToElementId(sectionId);
  };

  const navigateToComponent = (compId: string, category?: ComponentCategoryId) => {
    setActiveSection(category === 'omai' ? 'omai-os' : 'components');
    setActiveComponentId(compId);
    if (category && activeCategory !== 'all' && activeCategory !== category) {
      setActiveCategory('all');
    }
    scrollToElementId(compId);
  };

  const toggleRadiusMode = () => {
    const next = radius === 'sharp' ? 'soft' : 'sharp';
    setRadius(next);
  };

  const cycleGapsMode = () => {
    const next = gaps === 'default' ? 'wide' : gaps === 'wide' ? 'none' : 'default';
    setGaps(next);
  };

  const fireTestMakoNotification = () => {
    toast({
      appName: 'mako-daemon',
      title: `OMAI Notification (${meta.name})`,
      description: `Theme: ${theme} · Radius: ${radius} · Gaps: ${gaps}`,
      tone: 'brand',
      timestamp: new Date(),
      actions: [
        {
          label: 'Cycle Theme',
          shortcut: '1',
          onClick: () => cycleTheme(1),
        },
        {
          label: 'Toggle Radius',
          shortcut: '2',
          onClick: toggleRadiusMode,
        },
      ],
    });
  };

  // Global Walker Command Palette Items (Sections + All 40 Components + All 16 Themes + Actions)
  const walkerItems = useMemo<readonly WalkerItem[]>(() => {
    const sectionCommands: WalkerItem[] = DOCS_SECTIONS.map((sec) => ({
      id: `nav-sec-${sec.id}`,
      label: `Go to ${sec.label}`,
      description: `Workspace ${sec.workspace} section`,
      group: '01 // Navigation & Sections',
      icon: <Layers size={15} strokeWidth={1.75} aria-hidden />,
      shortcut: ['Alt', String(sec.workspace)],
      keywords: ['section', 'jump', sec.label.toLowerCase()],
      onSelect: () => navigateToSection(sec.id),
    }));

    const actionCommands: WalkerItem[] = [
      {
        id: 'act-cycle-theme',
        label: `Cycle Next Theme (Current: ${meta.name})`,
        description: 'Step through all 16 curated OMAI themes',
        group: '02 // Quick System Actions',
        icon: <Palette size={15} strokeWidth={1.75} aria-hidden />,
        shortcut: ['Shift', 'T'],
        keywords: ['theme', 'cycle', 'color', 'palette'],
        onSelect: () => cycleTheme(1),
      },
      {
        id: 'act-toggle-radius',
        label: `Toggle Corner Radius: sharp / soft (Current: ${radius})`,
        description: 'Switch between 0px sharp corners and Hyprland 4/6/8px rounding',
        group: '02 // Quick System Actions',
        icon: <Sliders size={15} strokeWidth={1.75} aria-hidden />,
        shortcut: ['Shift', 'R'],
        keywords: ['radius', 'sharp', 'soft', 'corners', 'rounding'],
        onSelect: toggleRadiusMode,
      },
      {
        id: 'act-toggle-gaps',
        label: `Cycle Hyprland Window Gaps (Current: ${gaps})`,
        description: 'Switch between default (5/10px), wide (10/20px), and none (0px)',
        group: '02 // Quick System Actions',
        icon: <LayoutGrid size={15} strokeWidth={1.75} aria-hidden />,
        shortcut: ['Shift', 'G'],
        keywords: ['gaps', 'hyprland', 'spacing', 'tiling'],
        onSelect: cycleGapsMode,
      },
      {
        id: 'act-fire-toast',
        label: 'Fire Test Mako Notification Toast',
        description: 'Spawn an interactive stacked toast in the top-right Mako deck',
        group: '02 // Quick System Actions',
        icon: <Bell size={15} strokeWidth={1.75} aria-hidden />,
        shortcut: ['Shift', 'M'],
        keywords: ['toast', 'mako', 'notification', 'alert'],
        onSelect: fireTestMakoNotification,
      },
    ];

    const componentCommands: WalkerItem[] = COMPONENT_CATALOG.map((comp) => ({
      id: `walk-${comp.id}`,
      label: `${comp.name} (${comp.cssClass})`,
      description: comp.tagline,
      group: `03 // Components (${comp.category})`,
      icon: <Box size={15} strokeWidth={1.75} aria-hidden />,
      keywords: [comp.name.toLowerCase(), comp.category, comp.cssClass, comp.tagline.toLowerCase()],
      onSelect: () => navigateToComponent(comp.id, comp.category),
    }));

    const themeCommands: WalkerItem[] = themes.map((t) => ({
      id: `walk-theme-${t.id}`,
      label: `Theme: ${t.name} (${t.mode})`,
      description: `brand ${t.swatch.brand} · bg ${t.swatch.bg}`,
      group: '04 // Switch 16 Official Themes',
      icon: (
        <span
          className="inline-block h-3 w-3 border border-omai-border-strong"
          style={{ backgroundColor: t.swatch.brand }}
          aria-hidden="true"
        />
      ),
      keywords: ['theme', t.id, t.name.toLowerCase(), t.mode],
      onSelect: () => setTheme(t.id),
    }));

    return [
      ...sectionCommands,
      ...actionCommands,
      ...componentCommands,
      ...themeCommands,
    ];
  }, [meta.name, radius, gaps, themes, activeCategory]);

  return (
    <div className="min-h-screen bg-omai-bg pb-12 text-omai-text">
      {/* Persistent Top 26px Omarchy Waybar */}
      <Waybar
        sticky
        variant="opaque"
        height={28}
        className="z-100"
        left={
          <>
            <WaybarLogo
              aria-label="Open OMAI Walker Command Palette"
              onClick={() => setWalkerOpen(true)}
            />
            {/* Desktop Section Workspace Pills */}
            <nav
              aria-label="Primary documentation sections"
              className="hidden items-center gap-0.5 md:flex"
            >
              {DOCS_SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => navigateToSection(sec.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`px-2 py-0.5 font-mono text-[11px] transition-colors ${
                      isActive
                        ? 'border-b-2 border-omai-brand bg-omai-surface-2 font-bold text-omai-brand'
                        : 'text-omai-text-secondary hover:bg-omai-surface hover:text-omai-text'
                    }`}
                  >
                    {sec.workspace}:{sec.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Drawer Trigger (< md) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] text-omai-brand md:hidden"
            >
              <Menu size={12} strokeWidth={1.75} aria-hidden />
              <span>Menu</span>
            </button>
          </>
        }
        center={
          <div className="hidden lg:block">
            <WaybarClock />
          </div>
        }
        right={
          <>
            <WaybarModule
              active
              tone="brand"
              icon={<Palette size={12} strokeWidth={1.75} aria-hidden />}
              label={meta.name}
              tooltip="Click to cycle through all 16 OMAI themes (Shift+T)"
              onClick={() => cycleTheme(1)}
            />
            <WaybarModule
              label={`radius:${radius}`}
              tooltip="Toggle sharp (0px) / soft (Hyprland) corner radius (Shift+R)"
              onClick={toggleRadiusMode}
            />
            <WaybarModule
              className="hidden sm:inline-flex"
              label={`gaps:${gaps}`}
              tooltip="Cycle Hyprland window gaps (Shift+G)"
              onClick={cycleGapsMode}
            />
            <WaybarModule
              icon={<Command size={12} strokeWidth={1.75} aria-hidden />}
              label="Ctrl+K"
              title="Launch Walker Command Palette (Ctrl+K)"
              onClick={() => setWalkerOpen(true)}
            />
          </>
        }
      />

      {/* Mobile Navigation Drawer (Clean 390px viewport support) */}
      <Drawer
        side="left"
        size="sm"
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        title="OMAI — Omarchy Based Agent Interface"
        description={`Active Theme: ${meta.name} (${meta.mode})`}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="font-mono text-xs font-bold text-omai-text-muted uppercase">
              Workspaces / Sections
            </div>
            {DOCS_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateToSection(sec.id);
                }}
                className="flex w-full items-center justify-between border border-omai-border-subtle bg-omai-surface px-3 py-2 text-left font-mono text-xs text-omai-text hover:border-omai-brand"
              >
                <span>{sec.shortLabel}</span>
                <Kbd keys={['Alt', String(sec.workspace)]} size="sm" />
              </button>
            ))}
          </div>

          <div className="space-y-2 border-t border-omai-border-subtle pt-3">
            <div className="font-mono text-xs font-bold text-omai-text-muted uppercase">
              Quick Controls
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="primary" onClick={() => cycleTheme(1)}>
                Theme: {meta.name}
              </Button>
              <Button size="sm" variant="secondary" onClick={toggleRadiusMode}>
                Radius: {radius}
              </Button>
              <Button size="sm" variant="secondary" onClick={cycleGapsMode}>
                Gaps: {gaps}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setWalkerOpen(true);
                }}
              >
                Open Walker
              </Button>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Global Walker Command Palette (Ctrl+K / Cmd+K) */}
      <Walker
        open={walkerOpen}
        onOpenChange={setWalkerOpen}
        hotkey="mod+k"
        title="OMAI Walker — Command & Component Launcher"
        placeholder="Jump to any of 40 components, 16 themes, sections, or system actions..."
        items={walkerItems}
      />

      {/* Main Page Content Sections with alternating --omai-bg-deep / --omai-bg banding */}
      <main>
        <HeroSection
          onNavigateSection={navigateToSection}
          onOpenWalker={() => setWalkerOpen(true)}
        />

        <FoundationsSection />

        <ComponentsCatalogSection
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeComponentId={activeComponentId}
          onSelectComponent={navigateToComponent}
          onOpenGlobalWalker={() => setWalkerOpen(true)}
        />

        <TemplatesSection />

        <UsageSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-omai-border-subtle bg-omai-bg px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-omai flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-3 w-3 bg-omai-brand"
              aria-hidden="true"
            />
            <span className="font-mono text-xs font-bold tracking-wider text-omai-text uppercase">
              OMAI // OMARCHY BASED AGENT INTERFACE
            </span>
            <Badge tone="brand" size="sm">
              16 Themes · 40 Components
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-omai-text-muted">
            <span className="inline-flex items-center gap-1">
              <Sparkles size={12} strokeWidth={1.75} className="text-omai-brand" aria-hidden />
              Geist + JetBrains Mono
            </span>
            <span>·</span>
            <span>React 19 · Vite 8 · Tailwind v4</span>
          </div>
        </div>
      </footer>

      {/* Persistent Bottom HotkeyBar with live global shortcuts */}
      <HotkeyBar
        position="bottom"
        size="sm"
        items={[
          {
            keys: ['Ctrl', 'K'],
            label: 'Walker Palette',
            onTrigger: () => setWalkerOpen(true),
          },
          {
            keys: ['Shift', 'T'],
            combo: 'shift+t',
            label: `Theme (${meta.name})`,
            onTrigger: () => cycleTheme(1),
          },
          {
            keys: ['Shift', 'R'],
            combo: 'shift+r',
            label: `Radius (${radius})`,
            onTrigger: toggleRadiusMode,
          },
          {
            keys: ['Shift', 'G'],
            combo: 'shift+g',
            label: `Gaps (${gaps})`,
            onTrigger: cycleGapsMode,
          },
          {
            keys: ['Shift', 'M'],
            combo: 'shift+m',
            label: 'Test Mako Toast',
            onTrigger: fireTestMakoNotification,
          },
        ]}
      />
    </div>
  );
}

export function App() {
  return (
    <OmaiProvider defaultTheme="tokyo-night" defaultRadius="sharp" transition="wipe">
      <ToastProvider placement="top-right" max={5}>
        <DocsWorkspaceShell />
        <Analytics />
      </ToastProvider>
    </OmaiProvider>
  );
}
