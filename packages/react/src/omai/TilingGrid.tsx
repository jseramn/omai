import { X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn, mergeRefs, useControllableState } from '../utils';

export type TilingLayout = 'dwindle' | 'master' | 'columns' | 'rows' | 'grid';

export interface TilingGridProps extends ComponentPropsWithRef<'div'> {
  children: ReactNode;
  layout?: TilingLayout;
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?(id: string): void;
  gaps?: 'inherit' | 'none' | number;
  masterRatio?: number;
  keyboard?: boolean;
  height?: number | string;
}

export interface WindowPaneProps extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
  id: string;
  title?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  active?: boolean;
  floating?: boolean;
  showChrome?: boolean;
  padding?: 'none' | 'sm' | 'md';
  onClose?(): void;
}

interface TilingPaneMeta {
  id: string;
  floating: boolean;
  el: HTMLElement | null;
}

interface GridPlacement {
  gridColumn: string;
  gridRow: string;
}

interface TilingContextValue {
  activeId: string;
  setActiveId(id: string): void;
  registerPane(id: string, el: HTMLElement | null, floating: boolean): void;
  unregisterPane(id: string): void;
  getPlacement(id: string): GridPlacement | undefined;
}

const TilingContext = createContext<TilingContextValue | null>(null);

interface RectBox {
  c1: number;
  c2: number;
  r1: number;
  r2: number;
}

/**
 * Compute alternating binary split placements on a power-of-2 integer CSS grid
 * so every WindowPane stays a direct child of TilingGrid.
 */
function computeDwindlePlacements(paneIds: readonly string[]): {
  cols: number;
  rows: number;
  map: Map<string, GridPlacement>;
} {
  const count = paneIds.length;
  const map = new Map<string, GridPlacement>();
  if (count === 0) return { cols: 1, rows: 1, map };

  const exp = Math.max(1, Math.ceil(count / 2));
  const size = Math.pow(2, exp);
  const boxes: RectBox[] = [];
  let current: RectBox = { c1: 1, c2: size + 1, r1: 1, r2: size + 1 };

  for (let i = 0; i < count; i++) {
    if (i === count - 1) {
      boxes.push(current);
      break;
    }
    const horizontalSplit = i % 2 === 0; // even -> left/right, odd -> top/bottom
    if (horizontalSplit) {
      const mid = Math.floor((current.c1 + current.c2) / 2);
      boxes.push({ c1: current.c1, c2: mid, r1: current.r1, r2: current.r2 });
      current = { c1: mid, c2: current.c2, r1: current.r1, r2: current.r2 };
    } else {
      const mid = Math.floor((current.r1 + current.r2) / 2);
      boxes.push({ c1: current.c1, c2: current.c2, r1: current.r1, r2: mid });
      current = { c1: current.c1, c2: current.c2, r1: mid, r2: current.r2 };
    }
  }

  paneIds.forEach((id, idx) => {
    const b = boxes[idx]!;
    map.set(id, {
      gridColumn: `${b.c1} / ${b.c2}`,
      gridRow: `${b.r1} / ${b.r2}`,
    });
  });

  return { cols: size, rows: size, map };
}

function computeMasterPlacements(paneIds: readonly string[]): {
  map: Map<string, GridPlacement>;
} {
  const map = new Map<string, GridPlacement>();
  if (paneIds.length === 0) return { map };
  if (paneIds.length === 1) {
    map.set(paneIds[0]!, { gridColumn: '1 / 2', gridRow: '1 / 2' });
    return { map };
  }
  const stackCount = paneIds.length - 1;
  map.set(paneIds[0]!, { gridColumn: '1 / 2', gridRow: `1 / ${stackCount + 1}` });
  for (let i = 1; i < paneIds.length; i++) {
    map.set(paneIds[i]!, { gridColumn: '2 / 3', gridRow: `${i} / ${i + 1}` });
  }
  return { map };
}

export function TilingGrid({
  children,
  layout = 'dwindle',
  activeId: activeIdProp,
  defaultActiveId = '',
  onActiveChange,
  gaps = 'inherit',
  masterRatio = 0.5,
  keyboard = true,
  height = 480,
  className,
  style,
  ref,
  onKeyDown,
  ...rest
}: TilingGridProps) {
  const [activeId, setActiveId] = useControllableState<string>({
    value: activeIdProp,
    defaultValue: defaultActiveId,
    onChange: onActiveChange,
  });

  const [panes, setPanes] = useState<TilingPaneMeta[]>([]);
  const panesRef = useRef<TilingPaneMeta[]>([]);
  panesRef.current = panes;

  const registerPane = useCallback((id: string, el: HTMLElement | null, floating: boolean) => {
    setPanes((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx !== -1) {
        const existing = prev[idx]!;
        if (existing.el === el && existing.floating === floating) return prev;
        const copy = [...prev];
        copy[idx] = { id, el, floating };
        return copy;
      }
      return [...prev, { id, el, floating }];
    });
  }, []);

  const unregisterPane = useCallback((id: string) => {
    setPanes((prev) => (prev.some((p) => p.id === id) ? prev.filter((p) => p.id !== id) : prev));
  }, []);

  // Activate first pane if none selected yet and uncontrolled
  useEffect(() => {
    if (activeIdProp === undefined && !activeId && panes.length > 0) {
      setActiveId(panes[0]!.id);
    }
  }, [activeId, activeIdProp, panes, setActiveId]);

  const tiledIds = useMemo(
    () => panes.filter((p) => !p.floating).map((p) => p.id),
    [panes],
  );

  const placementData = useMemo(() => {
    if (layout === 'dwindle') {
      return computeDwindlePlacements(tiledIds);
    }
    if (layout === 'master') {
      const m = computeMasterPlacements(tiledIds);
      return { cols: tiledIds.length > 1 ? 2 : 1, rows: Math.max(1, tiledIds.length - 1), map: m.map };
    }
    return { cols: 0, rows: 0, map: new Map<string, GridPlacement>() };
  }, [layout, tiledIds]);

  const getPlacement = useCallback(
    (id: string) => placementData.map.get(id),
    [placementData],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !keyboard || !event.altKey) return;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;

    const list = panesRef.current;
    if (list.length <= 1) return;

    const currentIdx = Math.max(
      0,
      list.findIndex((p) => p.id === activeId),
    );
    const current = list[currentIdx];
    if (!current) return;

    event.preventDefault();

    const currentRect = current.el?.getBoundingClientRect();
    let bestCandidate: TilingPaneMeta | null = null;

    if (currentRect && (currentRect.width > 0 || currentRect.height > 0)) {
      const cx = currentRect.left + currentRect.width / 2;
      const cy = currentRect.top + currentRect.height / 2;
      let bestDist = Infinity;

      for (const candidate of list) {
        if (candidate.id === current.id || !candidate.el) continue;
        const r = candidate.el.getBoundingClientRect();
        const tx = r.left + r.width / 2;
        const ty = r.top + r.height / 2;
        const dx = tx - cx;
        const dy = ty - cy;

        const inDirection =
          (event.key === 'ArrowRight' && dx > 4) ||
          (event.key === 'ArrowLeft' && dx < -4) ||
          (event.key === 'ArrowDown' && dy > 4) ||
          (event.key === 'ArrowUp' && dy < -4);

        if (!inDirection) continue;
        const primary = event.key === 'ArrowLeft' || event.key === 'ArrowRight' ? Math.abs(dx) : Math.abs(dy);
        const secondary = event.key === 'ArrowLeft' || event.key === 'ArrowRight' ? Math.abs(dy) : Math.abs(dx);
        const dist = primary + secondary * 2;
        if (dist < bestDist) {
          bestDist = dist;
          bestCandidate = candidate;
        }
      }
    }

    // Fallback linear navigation (e.g. in jsdom where bounding rects are zero)
    if (!bestCandidate) {
      const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
      const nextIdx = (currentIdx + step + list.length) % list.length;
      bestCandidate = list[nextIdx] ?? null;
    }

    if (bestCandidate) {
      setActiveId(bestCandidate.id);
      bestCandidate.el?.focus();
    }
  };

  const gridStyle: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  if (gaps === 'none') {
    gridStyle.gap = '0px';
    gridStyle.padding = '0px';
  } else if (typeof gaps === 'number') {
    gridStyle.gap = `${gaps}px`;
    gridStyle.padding = `${gaps}px`;
  }

  if (layout === 'dwindle' && tiledIds.length > 0) {
    gridStyle.gridTemplateColumns = `repeat(${placementData.cols}, minmax(0, 1fr))`;
    gridStyle.gridTemplateRows = `repeat(${placementData.rows}, minmax(0, 1fr))`;
  } else if (layout === 'master' && tiledIds.length > 1) {
    const clamped = Math.min(0.85, Math.max(0.15, masterRatio));
    gridStyle.gridTemplateColumns = `${clamped}fr ${1 - clamped}fr`;
    gridStyle.gridTemplateRows = `repeat(${Math.max(1, tiledIds.length - 1)}, minmax(0, 1fr))`;
  } else if (layout === 'grid' && tiledIds.length > 0) {
    const cols = Math.ceil(Math.sqrt(tiledIds.length));
    gridStyle.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  }

  const ctxValue = useMemo<TilingContextValue>(
    () => ({ activeId, setActiveId, registerPane, unregisterPane, getPlacement }),
    [activeId, setActiveId, registerPane, unregisterPane, getPlacement],
  );

  return (
    <TilingContext.Provider value={ctxValue}>
      <div
        ref={ref}
        className={cn('omai-tiling-grid', className)}
        data-layout={layout}
        style={gridStyle}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </TilingContext.Provider>
  );
}

export function WindowPane({
  id,
  title,
  icon,
  actions,
  active: activeProp,
  floating = false,
  showChrome = true,
  padding = 'md',
  onClose,
  className,
  style,
  children,
  ref,
  onMouseDown,
  onFocus,
  ...rest
}: WindowPaneProps) {
  const ctx = useContext(TilingContext);
  const localRef = useRef<HTMLElement | null>(null);
  const mergedRef = mergeRefs(ref, localRef);

  const isActive = activeProp !== undefined ? activeProp : ctx?.activeId === id;
  const registerPane = ctx?.registerPane;
  const unregisterPane = ctx?.unregisterPane;

  useEffect(() => {
    if (!registerPane || !unregisterPane) return;
    registerPane(id, localRef.current, floating);
    return () => unregisterPane(id);
  }, [registerPane, unregisterPane, id, floating]);

  const placement = !floating ? ctx?.getPlacement(id) : undefined;
  const paneStyle: CSSProperties = placement
    ? { gridColumn: placement.gridColumn, gridRow: placement.gridRow, ...style }
    : { ...style };

  const activate = () => {
    ctx?.setActiveId(id);
  };

  return (
    <section
      ref={mergedRef}
      tabIndex={0}
      aria-label={typeof title === 'string' ? title : undefined}
      className={cn('omai-window-pane', className)}
      data-state={isActive ? 'active' : 'inactive'}
      data-floating={floating ? '' : undefined}
      data-padding={padding}
      style={paneStyle}
      onMouseDown={(e) => {
        activate();
        onMouseDown?.(e);
      }}
      onFocus={(e) => {
        activate();
        onFocus?.(e);
      }}
      {...rest}
    >
      {showChrome ? (
        <header className="omai-window-pane__header">
          <div className="omai-window-pane__title-group">
            {icon ? <span className="omai-window-pane__icon">{icon}</span> : null}
            {title ? <span className="omai-window-pane__title">{title}</span> : null}
          </div>
          <div className="omai-window-pane__actions">
            {actions}
            {onClose ? (
              <button
                type="button"
                className="omai-window-pane__close"
                aria-label="Close window"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <X size={14} strokeWidth={1.75} aria-hidden />
              </button>
            ) : null}
          </div>
        </header>
      ) : null}

      <div className="omai-window-pane__body">{children}</div>
    </section>
  );
}
