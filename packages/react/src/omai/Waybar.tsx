import { useEffect, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Tooltip } from '../primitives';
import type { Tone } from '../types';
import { cn } from '../utils';

export interface WaybarProps extends ComponentPropsWithRef<'header'> {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  variant?: 'opaque' | 'glassy' | 'clear';
  position?: 'top' | 'bottom';
  sticky?: boolean;
  height?: number;
}

export function Waybar({
  left,
  center,
  right,
  variant = 'opaque',
  position = 'top',
  sticky = false,
  height = 26,
  className,
  style,
  ref,
  ...rest
}: WaybarProps) {
  return (
    <header
      ref={ref}
      className={cn('omai-waybar', className)}
      data-variant={variant}
      data-position={position}
      data-sticky={sticky ? '' : undefined}
      style={{ height: `${height}px`, ...style }}
      {...rest}
    >
      <div className="omai-waybar__left">{left}</div>
      <div className="omai-waybar__center">{center}</div>
      <div className="omai-waybar__right">{right}</div>
    </header>
  );
}

export interface WaybarModuleProps extends ComponentPropsWithRef<'button'> {
  icon?: ReactNode;
  label?: ReactNode;
  tooltip?: ReactNode;
  active?: boolean;
  tone?: Tone;
}

export function WaybarModule({
  icon,
  label,
  tooltip,
  active = false,
  tone = 'neutral',
  className,
  children,
  ref,
  ...rest
}: WaybarModuleProps) {
  const button = (
    <button
      ref={ref}
      type="button"
      className={cn('omai-waybar__module', className)}
      data-state={active ? 'active' : 'inactive'}
      data-tone={tone}
      aria-pressed={active || undefined}
      {...rest}
    >
      {icon ? <span className="omai-waybar__module-icon">{icon}</span> : null}
      {label !== undefined && label !== null ? (
        <span className="omai-waybar__module-label">{label}</span>
      ) : null}
      {children}
    </button>
  );

  if (tooltip !== undefined && tooltip !== null && tooltip !== false) {
    return (
      <Tooltip content={tooltip} side="bottom">
        {button}
      </Tooltip>
    );
  }

  return button;
}

export interface WaybarWorkspacesProps extends Omit<ComponentPropsWithRef<'div'>, 'onSelect'> {
  count?: number;
  active: number;
  occupied?: readonly number[];
  urgent?: readonly number[];
  onSelect?(workspace: number): void;
}

export function WaybarWorkspaces({
  count = 5,
  active,
  occupied,
  urgent,
  onSelect,
  className,
  ref,
  ...rest
}: WaybarWorkspacesProps) {
  const clampedCount = Math.min(10, Math.max(1, Math.floor(count)));
  const occupiedSet = occupied ? new Set(occupied) : null;
  const urgentSet = urgent ? new Set(urgent) : null;

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Workspaces"
      className={cn('omai-waybar__workspaces', className)}
      {...rest}
    >
      {Array.from({ length: clampedCount }, (_, idx) => {
        const ws = idx + 1;
        const isActive = ws === active;
        const isOccupied = occupiedSet?.has(ws) ?? false;
        const isUrgent = urgentSet?.has(ws) ?? false;

        return (
          <button
            key={ws}
            type="button"
            className="omai-waybar__ws"
            aria-label={`Workspace ${ws}`}
            aria-pressed={isActive}
            data-state={isActive ? 'active' : 'inactive'}
            data-occupied={isOccupied ? '' : undefined}
            data-urgent={isUrgent ? '' : undefined}
            onClick={() => onSelect?.(ws)}
          >
            {ws}
          </button>
        );
      })}
    </div>
  );
}

export interface WaybarClockProps extends ComponentPropsWithRef<'time'> {
  hour12?: boolean;
  showDate?: boolean;
  now?: Date;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function formatClock(date: Date, hour12: boolean, showDate: boolean): string {
  const rawHours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  let timeStr: string;
  if (hour12) {
    const suffix = rawHours >= 12 ? 'PM' : 'AM';
    const h12 = rawHours % 12 || 12;
    timeStr = `${h12}:${minutes} ${suffix}`;
  } else {
    timeStr = `${String(rawHours).padStart(2, '0')}:${minutes}`;
  }

  if (!showDate) return timeStr;
  const day = WEEKDAYS[date.getDay()]!;
  const month = MONTHS[date.getMonth()]!;
  const dayNum = String(date.getDate()).padStart(2, '0');
  return `${day} ${month} ${dayNum} ${timeStr}`;
}

export function WaybarClock({
  hour12 = false,
  showDate = true,
  now,
  className,
  ref,
  ...rest
}: WaybarClockProps) {
  const [tickDate, setTickDate] = useState<Date>(() => now ?? new Date());

  useEffect(() => {
    if (now) return;
    setTickDate(new Date());
    const id = setInterval(() => setTickDate(new Date()), 1000);
    return () => clearInterval(id);
  }, [now]);

  const current = now ?? tickDate;

  return (
    <time
      ref={ref}
      dateTime={current.toISOString()}
      className={cn('omai-waybar__clock', className)}
      {...rest}
    >
      {formatClock(current, hour12, showDate)}
    </time>
  );
}

export interface WaybarLogoProps extends ComponentPropsWithRef<'button'> {}

export function WaybarLogo({
  className,
  'aria-label': ariaLabel = 'OMAI menu',
  ref,
  ...rest
}: WaybarLogoProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      className={cn('omai-waybar__logo', className)}
      {...rest}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 8 8"
        fill="currentColor"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <rect x="2" y="1" width="4" height="1" />
        <rect x="1" y="2" width="1" height="4" />
        <rect x="6" y="2" width="1" height="4" />
        <rect x="2" y="6" width="4" height="1" />
      </svg>
    </button>
  );
}

export interface WaybarLayoutIndicatorProps extends ComponentPropsWithRef<'span'> {
  layout: 'dwindle' | 'scrolling' | 'floating';
}

const LAYOUT_GLYPHS: Record<WaybarLayoutIndicatorProps['layout'], string> = {
  dwindle: '■',
  scrolling: '●',
  floating: '▲',
};

export function WaybarLayoutIndicator({
  layout,
  className,
  'aria-label': ariaLabel,
  ref,
  ...rest
}: WaybarLayoutIndicatorProps) {
  return (
    <span
      ref={ref}
      className={cn('omai-waybar__layout', className)}
      data-layout={layout}
      aria-label={ariaLabel ?? `Layout: ${layout}`}
      title={`Layout: ${layout}`}
      {...rest}
    >
      {LAYOUT_GLYPHS[layout]}
    </span>
  );
}

export interface WaybarStatProps extends ComponentPropsWithRef<'div'> {
  icon?: ReactNode;
  value: ReactNode;
  label?: string;
  tone?: Tone;
  meter?: number;
}

export function WaybarStat({
  icon,
  value,
  label,
  tone = 'neutral',
  meter,
  className,
  ref,
  ...rest
}: WaybarStatProps) {
  const meterPct = meter !== undefined ? Math.min(100, Math.max(0, meter)) : undefined;

  return (
    <div
      ref={ref}
      className={cn('omai-waybar__stat', className)}
      data-tone={tone}
      aria-label={label}
      {...rest}
    >
      {icon ? <span className="omai-waybar__stat-icon">{icon}</span> : null}
      {label ? <span className="omai-waybar__stat-label">{label}</span> : null}
      <span className="omai-waybar__stat-value">{value}</span>
      {meterPct !== undefined ? (
        <span className="omai-waybar__stat-meter" aria-hidden="true">
          <span className="omai-waybar__stat-meter-fill" style={{ width: `${meterPct}%` }} />
        </span>
      ) : null}
    </div>
  );
}
