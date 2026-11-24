import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState, type ComponentPropsWithRef, type MouseEvent, type ReactNode } from 'react';
import { Kbd, Tooltip } from '../primitives';
import type { KeyCombo } from '../types';
import { cn } from '../utils';

export interface SidebarNavItem {
  id: string;
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  shortcut?: KeyCombo;
  disabled?: boolean;
  items?: readonly SidebarNavItem[];
}

export interface SidebarNavSection {
  id?: string;
  title?: ReactNode;
  items: readonly SidebarNavItem[];
}

export interface SidebarNavProps extends Omit<ComponentPropsWithRef<'nav'>, 'onSelect'> {
  sections: readonly SidebarNavSection[];
  activeId?: string;
  onNavigate?(item: SidebarNavItem, event: MouseEvent): void;
  renderLink?(
    item: SidebarNavItem,
    props: { className: string; children: ReactNode; 'aria-current'?: 'page' },
  ): ReactNode;
  collapsed?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

function getInitialExpanded(sections: readonly SidebarNavSection[], activeId?: string): Set<string> {
  const expanded = new Set<string>();
  if (!activeId) return expanded;
  for (const section of sections) {
    for (const item of section.items) {
      if (item.items?.some((child) => child.id === activeId) || item.id === activeId) {
        expanded.add(item.id);
      }
    }
  }
  return expanded;
}

export function SidebarNav({
  sections,
  activeId,
  onNavigate,
  renderLink,
  collapsed = false,
  header,
  footer,
  className,
  'aria-label': ariaLabel = 'Sidebar navigation',
  ref,
  ...rest
}: SidebarNavProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() =>
    getInitialExpanded(sections, activeId),
  );

  const toggleGroup = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderItem = (item: SidebarNavItem, isNested = false): ReactNode => {
    const isActive = item.id === activeId;
    const hasChildren = Boolean(!isNested && item.items && item.items.length > 0);
    const isExpanded = hasChildren && expandedIds.has(item.id);
    const labelText = typeof item.label === 'string' ? item.label : undefined;

    const inner = (
      <>
        {item.icon ? <span className="omai-sidebar-nav__icon">{item.icon}</span> : null}
        {!collapsed ? (
          <>
            <span className="omai-sidebar-nav__label">{item.label}</span>
            {item.badge !== undefined && item.badge !== null ? (
              <span className="omai-sidebar-nav__badge">{item.badge}</span>
            ) : null}
            {item.shortcut && item.shortcut.length > 0 ? (
              <Kbd keys={item.shortcut} size="sm" className="omai-sidebar-nav__shortcut" />
            ) : null}
            {hasChildren ? (
              <span className="omai-sidebar-nav__chevron" aria-hidden="true">
                {isExpanded ? (
                  <ChevronDown size={14} strokeWidth={1.75} aria-hidden />
                ) : (
                  <ChevronRight size={14} strokeWidth={1.75} aria-hidden />
                )}
              </span>
            ) : null}
          </>
        ) : null}
      </>
    );

    const itemClassName = cn('omai-sidebar-nav__item', isNested && 'omai-sidebar-nav__item--nested');
    const handleClick = (e: MouseEvent<HTMLElement>) => {
      if (item.disabled) {
        e.preventDefault();
        return;
      }
      if (hasChildren && !item.href) {
        toggleGroup(item.id);
      }
      onNavigate?.(item, e);
    };

    let control: ReactNode;
    if (renderLink && !hasChildren && !item.disabled) {
      control = (
        <span
          className="omai-sidebar-nav__link-wrap"
          data-state={isActive ? 'active' : 'inactive'}
          onClick={(e) => handleClick(e)}
        >
          {renderLink(item, {
            className: itemClassName,
            children: inner,
            ...(isActive ? { 'aria-current': 'page' as const } : {}),
          })}
        </span>
      );
    } else if (item.href !== undefined && !item.disabled) {
      control = (
        <a
          href={item.href}
          className={itemClassName}
          aria-current={isActive ? 'page' : undefined}
          aria-label={collapsed ? labelText : undefined}
          data-state={isActive ? 'active' : 'inactive'}
          onClick={handleClick}
        >
          {inner}
        </a>
      );
    } else {
      control = (
        <button
          type="button"
          className={itemClassName}
          disabled={item.disabled}
          aria-current={isActive ? 'page' : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-disabled={item.disabled || undefined}
          aria-label={collapsed ? labelText : undefined}
          data-state={isActive ? 'active' : 'inactive'}
          data-disabled={item.disabled ? '' : undefined}
          onClick={handleClick}
        >
          {inner}
        </button>
      );
    }

    const wrappedControl =
      collapsed && labelText ? (
        <Tooltip content={item.label} side="right">
          {control as React.ReactElement}
        </Tooltip>
      ) : (
        control
      );

    return (
      <li key={item.id} className="omai-sidebar-nav__entry">
        <div className="omai-sidebar-nav__row">
          {wrappedControl}
          {hasChildren && item.href && !collapsed ? (
            <button
              type="button"
              className="omai-sidebar-nav__toggle"
              aria-expanded={isExpanded}
              aria-label={`Toggle ${labelText ?? item.id} submenu`}
              onClick={() => toggleGroup(item.id)}
            >
              {isExpanded ? (
                <ChevronDown size={14} strokeWidth={1.75} aria-hidden />
              ) : (
                <ChevronRight size={14} strokeWidth={1.75} aria-hidden />
              )}
            </button>
          ) : null}
        </div>
        {hasChildren && isExpanded && !collapsed ? (
          <ul className="omai-sidebar-nav__sublist">
            {item.items!.map((child) => renderItem(child, true))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cn('omai-sidebar-nav', className)}
      data-collapsed={collapsed ? '' : undefined}
      {...rest}
    >
      {header ? <div className="omai-sidebar-nav__header">{header}</div> : null}
      <div className="omai-sidebar-nav__body">
        {sections.map((section, idx) => (
          <div key={section.id ?? idx} className="omai-sidebar-nav__section">
            {section.title && !collapsed ? (
              <div className="omai-sidebar-nav__section-title">{section.title}</div>
            ) : null}
            <ul className="omai-sidebar-nav__list">
              {section.items.map((item) => renderItem(item))}
            </ul>
          </div>
        ))}
      </div>
      {footer ? <div className="omai-sidebar-nav__footer">{footer}</div> : null}
    </nav>
  );
}
