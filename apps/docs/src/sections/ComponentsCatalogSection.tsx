import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Drawer,
  Input,
  SidebarNav,
  type SidebarNavSection,
} from '@jseramn/omai';
import {
  Bell,
  Box,
  Database,
  FormInput,
  LayoutGrid,
  ListFilter,
  Navigation,
  Search,
  Terminal as TerminalIcon,
} from 'lucide-react';
import {
  COMPONENT_CATALOG,
  COMPONENT_CATEGORIES,
  type ComponentCategoryId,
} from '../data/catalogMeta';
import { FeedbackDemos } from './catalog/FeedbackDemos';
import { FormsDemos } from './catalog/FormsDemos';
import { DataDisplayDemos, NavigationDemos } from './catalog/NavigationAndDataDemos';
import { OmaiShellDemos } from './catalog/OmaiShellDemos';
import { PrimitivesDemos } from './catalog/PrimitivesDemos';

export interface ComponentsCatalogSectionProps {
  activeCategory: 'all' | ComponentCategoryId;
  onCategoryChange: (cat: 'all' | ComponentCategoryId) => void;
  activeComponentId: string;
  onSelectComponent: (id: string, category?: ComponentCategoryId) => void;
  onOpenGlobalWalker: () => void;
}

const CATEGORY_ICONS: Record<ComponentCategoryId, typeof Box> = {
  primitives: Box,
  forms: FormInput,
  feedback: Bell,
  navigation: Navigation,
  data: Database,
  omai: TerminalIcon,
};

export function ComponentsCatalogSection({
  activeCategory,
  onCategoryChange,
  activeComponentId,
  onSelectComponent,
  onOpenGlobalWalker,
}: ComponentsCatalogSectionProps) {
  const [quickFilter, setQuickFilter] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const sidebarSections = useMemo<readonly SidebarNavSection[]>(() => {
    const q = quickFilter.trim().toLowerCase();
    return COMPONENT_CATEGORIES.map((cat) => {
      const IconComp = CATEGORY_ICONS[cat.id];
      const items = COMPONENT_CATALOG.filter(
        (c) =>
          c.category === cat.id &&
          (!q ||
            c.name.toLowerCase().includes(q) ||
            c.tagline.toLowerCase().includes(q) ||
            c.cssClass.toLowerCase().includes(q)),
      ).map((entry) => ({
        id: entry.id,
        label: entry.name,
        href: `#${entry.id}`,
      }));

      return {
        id: `sec-${cat.id}`,
        title: (
          <span className="inline-flex items-center gap-1.5">
            <IconComp size={12} strokeWidth={1.75} aria-hidden />
            <span>
              {cat.label} ({items.length})
            </span>
          </span>
        ),
        items,
      };
    }).filter((sec) => sec.items.length > 0);
  }, [quickFilter]);

  const showCategory = (cat: ComponentCategoryId) =>
    activeCategory === 'all' || activeCategory === cat;

  return (
    <section
      id="components"
      aria-labelledby="components-heading"
      className="border-b border-omai-border-subtle bg-omai-bg-deep py-14"
    >
      <div className="mx-auto max-w-omai px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-omai-border-subtle pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand" size="sm">
                SECTION 03 &amp; 04 // COMPONENT CATALOG
              </Badge>
              <Badge tone="success" variant="soft" size="sm" dot>
                40 Components · 6 Groups · 100% Accessible
              </Badge>
            </div>
            <h2
              id="components-heading"
              className="mt-2 font-sans text-2xl font-semibold tracking-tight text-omai-text sm:text-3xl"
            >
              Interactive Component Reference (40 / 40)
            </h2>
            <p className="mt-1 max-w-2xl font-mono text-xs text-omai-text-secondary sm:text-sm">
              Every component ships plain <code className="text-omai-brand">.omai-*</code> CSS classes
              inside <code className="text-omai-text">@layer components</code>, forwards React 19{' '}
              <code className="text-omai-text">ref</code> props cleanly, and supports keyboard-only
              navigation.
            </p>
          </div>

          {/* Mobile Drawer Trigger for Sidebar Tree */}
          <div className="lg:hidden">
            <Drawer
              side="left"
              size="sm"
              open={mobileNavOpen}
              onOpenChange={setMobileNavOpen}
              trigger={
                <Button
                  variant="secondary"
                  size="sm"
                  leadingIcon={<ListFilter size={15} strokeWidth={1.75} aria-hidden />}
                >
                  Component Index (40)
                </Button>
              }
              title="Components Directory"
              description="Jump to any of the 40 components"
            >
              <div className="space-y-3">
                <Input
                  size="sm"
                  value={quickFilter}
                  onChange={(e) => setQuickFilter(e.target.value)}
                  leadingIcon={<Search size={14} strokeWidth={1.75} aria-hidden />}
                  placeholder="Filter 40 components..."
                  aria-label="Filter components in mobile drawer"
                />
                <SidebarNav
                  aria-label="Mobile component catalog navigation"
                  sections={sidebarSections}
                  activeId={activeComponentId}
                  onNavigate={(item, e) => {
                    e.preventDefault();
                    const found = COMPONENT_CATALOG.find((c) => c.id === item.id);
                    setMobileNavOpen(false);
                    onSelectComponent(item.id, found?.category);
                  }}
                />
              </div>
            </Drawer>
          </div>
        </div>

        {/* Category Filter Pill Bar */}
        <div
          role="group"
          aria-label="Filter component categories"
          className="mt-6 flex flex-wrap items-center gap-1.5 border border-omai-border-subtle bg-omai-surface p-2 rounded-omai-md"
        >
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            aria-pressed={activeCategory === 'all'}
            className="inline-flex items-center gap-1.5 border border-omai-border-subtle bg-omai-bg px-3 py-1.5 font-mono text-xs font-medium text-omai-text transition-colors hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
          >
            <LayoutGrid size={13} strokeWidth={1.75} aria-hidden />
            All Categories (40)
          </button>

          {COMPONENT_CATEGORIES.map((cat) => {
            const IconComp = CATEGORY_ICONS[cat.id];
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                aria-pressed={isSelected}
                className="inline-flex items-center gap-1.5 border border-omai-border-subtle bg-omai-bg px-3 py-1.5 font-mono text-xs font-medium text-omai-text transition-colors hover:bg-omai-surface-2 aria-pressed:border-omai-brand aria-pressed:bg-omai-brand-soft aria-pressed:text-omai-brand rounded-omai-sm"
              >
                <IconComp size={13} strokeWidth={1.75} aria-hidden />
                <span>{cat.label}</span>
                <span className="text-[11px] opacity-75">({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* Main 12-Col Layout: Desktop SidebarNav (3 cols) + Interactive Demos (9 cols) */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Desktop Sticky SidebarNav */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-12 max-h-[calc(100vh-5rem)] space-y-3 overflow-y-auto border border-omai-border-subtle bg-omai-bg p-3 rounded-omai-md">
              <Input
                size="sm"
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                leadingIcon={<Search size={14} strokeWidth={1.75} aria-hidden />}
                placeholder="Jump to component..."
                aria-label="Filter components sidebar"
              />
              <SidebarNav
                aria-label="Component catalog sidebar"
                sections={sidebarSections}
                activeId={activeComponentId}
                onNavigate={(item, e) => {
                  e.preventDefault();
                  const found = COMPONENT_CATALOG.find((c) => c.id === item.id);
                  onSelectComponent(item.id, found?.category);
                }}
              />
            </div>
          </aside>

          {/* Interactive Component Demos Stream */}
          <div className="min-w-0 space-y-12 lg:col-span-9">
            {/* Group 1: Primitives (9) */}
            {showCategory('primitives') && (
              <div id="cat-primitives" className="scroll-mt-16 space-y-4">
                <div className="border-b border-omai-border-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="brand" size="sm">
                      GROUP 01 // PRIMITIVES (9)
                    </Badge>
                    <code className="font-mono text-xs text-omai-text-muted">
                      packages/react/src/primitives
                    </code>
                  </div>
                  <h3 className="mt-1 font-sans text-xl font-semibold text-omai-text">
                    Atomic UI Primitives
                  </h3>
                </div>
                <PrimitivesDemos />
              </div>
            )}

            {/* Group 2: Forms (8) */}
            {showCategory('forms') && (
              <div id="cat-forms" className="scroll-mt-16 space-y-4">
                <div className="border-b border-omai-border-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="info" size="sm">
                      GROUP 02 // FORMS (8)
                    </Badge>
                    <code className="font-mono text-xs text-omai-text-muted">
                      packages/react/src/forms
                    </code>
                  </div>
                  <h3 className="mt-1 font-sans text-xl font-semibold text-omai-text">
                    Form Controls &amp; Context Validation
                  </h3>
                </div>
                <FormsDemos />
              </div>
            )}

            {/* Group 3: Feedback & Overlays (7) */}
            {showCategory('feedback') && (
              <div id="cat-feedback" className="scroll-mt-16 space-y-4">
                <div className="border-b border-omai-border-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="warning" size="sm">
                      GROUP 03 // FEEDBACK &amp; OVERLAYS (7)
                    </Badge>
                    <code className="font-mono text-xs text-omai-text-muted">
                      packages/react/src/feedback
                    </code>
                  </div>
                  <h3 className="mt-1 font-sans text-xl font-semibold text-omai-text">
                    Mako Notifications, Modals, Menus &amp; Meters
                  </h3>
                </div>
                <FeedbackDemos />
              </div>
            )}

            {/* Group 4: Navigation (4) */}
            {showCategory('navigation') && (
              <div id="cat-navigation" className="scroll-mt-16 space-y-4">
                <div className="border-b border-omai-border-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="success" size="sm">
                      GROUP 04 // NAVIGATION (4)
                    </Badge>
                    <code className="font-mono text-xs text-omai-text-muted">
                      packages/react/src/navigation
                    </code>
                  </div>
                  <h3 className="mt-1 font-sans text-xl font-semibold text-omai-text">
                    Tabs, Breadcrumbs, Sidebar Trees &amp; Pagination
                  </h3>
                </div>
                <NavigationDemos />
              </div>
            )}

            {/* Group 5: Data Display (4) */}
            {showCategory('data') && (
              <div id="cat-data" className="scroll-mt-16 space-y-4">
                <div className="border-b border-omai-border-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="neutral" size="sm">
                      GROUP 05 // DATA DISPLAY (4)
                    </Badge>
                    <code className="font-mono text-xs text-omai-text-muted">
                      packages/react/src/data
                    </code>
                  </div>
                  <h3 className="mt-1 font-sans text-xl font-semibold text-omai-text">
                    Sortable Tables, Code Blocks, Telemetry Cards &amp; Specs
                  </h3>
                </div>
                <DataDisplayDemos />
              </div>
            )}

            {/* Group 6: OMAI Shell Signature (8) */}
            {showCategory('omai') && (
              <div id="cat-omai" className="scroll-mt-16 space-y-4">
                <div className="border-b border-omai-border-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <Badge tone="brand" variant="solid" size="sm">
                      GROUP 06 // OMAI SHELL SIGNATURE (8)
                    </Badge>
                    <code className="font-mono text-xs text-omai-text-muted">
                      packages/react/src/omai
                    </code>
                  </div>
                  <h3 className="mt-1 font-sans text-xl font-semibold text-omai-text">
                    Hyprland Tiling, Waybar, Walker, Ghostty Terminal &amp; PixelField
                  </h3>
                </div>
                <OmaiShellDemos onOpenGlobalWalker={onOpenGlobalWalker} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
