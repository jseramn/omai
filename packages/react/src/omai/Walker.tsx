import { Search } from 'lucide-react';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Kbd } from '../primitives';
import { useOmaiPortalAttributes } from '../theme';
import type { KeyCombo } from '../types';
import {
  cn,
  getNextIndex,
  Portal,
  useControllableState,
  useEscapeKey,
  useFocusTrap,
  useScrollLock,
} from '../utils';
import { fuzzyMatch } from './fuzzyMatch';
import { HotkeyBar } from './HotkeyBar';
import { useHotkey } from './useHotkey';

export interface WalkerItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  icon?: ReactNode;
  shortcut?: KeyCombo;
  keywords?: readonly string[];
  disabled?: boolean;
  onSelect?(): void;
  closeOnSelect?: boolean;
}

export interface WalkerProps {
  items: readonly WalkerItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?(q: string): void;
  onSelect?(item: WalkerItem): void;
  hotkey?: string | false;
  placeholder?: string;
  filter?(item: WalkerItem, query: string): number | null;
  maxResults?: number;
  emptyState?: ReactNode;
  loading?: boolean;
  title?: ReactNode;
  footer?: ReactNode | false;
  className?: string;
}

interface RankedItem {
  item: WalkerItem;
  score: number;
  indices: number[];
  originalIndex: number;
}

function renderHighlightedLabel(label: string, indices: number[]): ReactNode {
  if (indices.length === 0) return label;
  const set = new Set(indices);
  const parts: ReactNode[] = [];
  let buffer = '';
  let bufferHighlighted = false;

  for (let i = 0; i < label.length; i++) {
    const isHit = set.has(i);
    if (i === 0) {
      bufferHighlighted = isHit;
      buffer = label[i]!;
    } else if (isHit === bufferHighlighted) {
      buffer += label[i]!;
    } else {
      parts.push(
        bufferHighlighted ? (
          <mark key={`m-${i}`} className="omai-walker__match">
            {buffer}
          </mark>
        ) : (
          buffer
        ),
      );
      buffer = label[i]!;
      bufferHighlighted = isHit;
    }
  }

  if (buffer) {
    parts.push(
      bufferHighlighted ? (
        <mark key="m-end" className="omai-walker__match">
          {buffer}
        </mark>
      ) : (
        buffer
      ),
    );
  }

  return parts;
}

const DEFAULT_FOOTER_ITEMS = [
  { keys: ['↑', '↓'] as const, label: 'Navigate' },
  { keys: ['↵'] as const, label: 'Select' },
  { keys: ['Esc'] as const, label: 'Close' },
];

export function Walker({
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  query: queryProp,
  defaultQuery = '',
  onQueryChange,
  onSelect,
  hotkey = 'mod+k',
  placeholder = 'Search…',
  filter,
  maxResults = 50,
  emptyState = 'No matching commands.',
  loading = false,
  title,
  footer,
  className,
}: WalkerProps) {
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [query, setQuery] = useControllableState<string>({
    value: queryProp,
    defaultValue: defaultQuery,
    onChange: onQueryChange,
  });

  const portalAttrs = useOmaiPortalAttributes();
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useHotkey(
    hotkey || '',
    () => {
      setOpen((prev) => !prev);
    },
    { enabled: hotkey !== false, ignoreInputs: false },
  );

  useEscapeKey(() => setOpen(false), open);
  useFocusTrap(panelRef, { enabled: open, initialFocus: inputRef, restoreFocus: true });
  useScrollLock(open);

  const ranked = useMemo<RankedItem[]>(() => {
    const trimmed = query.trim();
    const list: RankedItem[] = [];

    items.forEach((item, originalIndex) => {
      if (filter) {
        const customScore = filter(item, query);
        if (customScore !== null) {
          list.push({ item, score: customScore, indices: [], originalIndex });
        }
        return;
      }

      if (!trimmed) {
        list.push({ item, score: 0, indices: [], originalIndex });
        return;
      }

      const labelMatch = fuzzyMatch(trimmed, item.label);
      if (labelMatch) {
        list.push({
          item,
          score: labelMatch.score + 20,
          indices: labelMatch.indices,
          originalIndex,
        });
        return;
      }

      const secondaryPool = [
        item.description ?? '',
        ...(item.keywords ?? []),
        item.group ?? '',
      ].filter(Boolean);

      let bestSecondary = -Infinity;
      for (const candidate of secondaryPool) {
        const m = fuzzyMatch(trimmed, candidate);
        if (m && m.score > bestSecondary) {
          bestSecondary = m.score;
        }
      }

      if (bestSecondary > -Infinity) {
        list.push({
          item,
          score: bestSecondary,
          indices: [],
          originalIndex,
        });
      }
    });

    if (trimmed || filter) {
      list.sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);
    }

    return list.slice(0, maxResults);
  }, [items, query, filter, maxResults]);

  const grouped = useMemo(() => {
    const groups: Array<{ group: string | null; entries: RankedItem[] }> = [];
    const groupMap = new Map<string | null, RankedItem[]>();

    for (const entry of ranked) {
      const key = entry.item.group ?? null;
      let bucket = groupMap.get(key);
      if (!bucket) {
        bucket = [];
        groupMap.set(key, bucket);
        groups.push({ group: key, entries: bucket });
      }
      bucket.push(entry);
    }

    return groups;
  }, [ranked]);

  const flatEntries = useMemo(() => grouped.flatMap((g) => g.entries), [grouped]);

  const [activeId, setActiveId] = useState<string | null>(null);

  // Keep activeId pointing to an enabled visible item
  useEffect(() => {
    if (!open) return;
    const isStillValid =
      activeId !== null &&
      flatEntries.some((entry) => entry.item.id === activeId && !entry.item.disabled);
    if (!isStillValid) {
      const firstEnabled = flatEntries.find((entry) => !entry.item.disabled);
      setActiveId(firstEnabled ? firstEnabled.item.id : null);
    }
  }, [open, flatEntries, activeId]);

  useEffect(() => {
    if (!open || !activeId) return;
    optionRefs.current[activeId]?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeId]);

  const selectEntry = (item: WalkerItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    onSelect?.(item);
    if (item.closeOnSelect !== false) {
      setOpen(false);
    }
  };

  const moveSelection = (delta: number) => {
    if (flatEntries.length === 0) return;
    const currentIndex = flatEntries.findIndex((e) => e.item.id === activeId);
    const startIndex = currentIndex === -1 ? (delta > 0 ? -1 : 0) : currentIndex;
    const nextIndex = getNextIndex(startIndex, delta, flatEntries.length, {
      loop: true,
      isDisabled: (idx) => Boolean(flatEntries[idx]?.item.disabled),
    });
    const next = flatEntries[nextIndex];
    if (next && !next.item.disabled) {
      setActiveId(next.item.id);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveSelection(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveSelection(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      const first = flatEntries.find((e) => !e.item.disabled);
      if (first) setActiveId(first.item.id);
    } else if (event.key === 'End') {
      event.preventDefault();
      const reversed = [...flatEntries].reverse().find((e) => !e.item.disabled);
      if (reversed) setActiveId(reversed.item.id);
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      moveSelection(5);
    } else if (event.key === 'PageUp') {
      event.preventDefault();
      moveSelection(-5);
    } else if (event.key === 'Enter') {
      const current = flatEntries.find((e) => e.item.id === activeId);
      if (current && !current.item.disabled) {
        event.preventDefault();
        selectEntry(current.item);
      }
    }
  };

  if (!open) return null;

  const activeOptionDomId = activeId ? `${baseId}-opt-${activeId}` : undefined;

  return (
    <Portal>
      <div
        className="omai-walker-backdrop"
        {...portalAttrs}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : 'Command palette'}
          tabIndex={-1}
          className={cn('omai-walker', className)}
        >
          {title ? <div className="omai-walker__title">{title}</div> : null}

          <div className="omai-walker__search">
            <Search size={16} strokeWidth={1.75} className="omai-walker__search-icon" aria-hidden />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={true}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={activeOptionDomId}
              className="omai-walker__input"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
          </div>

          <div
            id={listboxId}
            role="listbox"
            aria-label="Commands"
            className="omai-walker__list"
          >
            {loading ? (
              <div className="omai-walker__empty" role="status">
                Loading…
              </div>
            ) : flatEntries.length === 0 ? (
              <div className="omai-walker__empty">{emptyState}</div>
            ) : (
              grouped.map((groupBlock, groupIdx) => {
                const groupLabelId = `${baseId}-group-${groupIdx}`;
                return (
                  <div
                    key={groupBlock.group ?? `ungrouped-${groupIdx}`}
                    role={groupBlock.group ? 'group' : undefined}
                    aria-labelledby={groupBlock.group ? groupLabelId : undefined}
                    className="omai-walker__group"
                  >
                    {groupBlock.group ? (
                      <div id={groupLabelId} className="omai-walker__group-label">
                        {groupBlock.group}
                      </div>
                    ) : null}

                    {groupBlock.entries.map(({ item, indices }) => {
                      const isSelected = item.id === activeId;
                      const optionId = `${baseId}-opt-${item.id}`;

                      return (
                        <div
                          key={item.id}
                          ref={(el) => {
                            optionRefs.current[item.id] = el;
                          }}
                          id={optionId}
                          role="option"
                          aria-selected={isSelected}
                          aria-disabled={item.disabled || undefined}
                          data-state={isSelected ? 'active' : 'inactive'}
                          data-disabled={item.disabled ? '' : undefined}
                          className="omai-walker__item"
                          onMouseEnter={() => {
                            if (!item.disabled) setActiveId(item.id);
                          }}
                          onClick={() => selectEntry(item)}
                        >
                          {item.icon ? <span className="omai-walker__icon">{item.icon}</span> : null}
                          <div className="omai-walker__text">
                            <span className="omai-walker__label">
                              {renderHighlightedLabel(item.label, indices)}
                            </span>
                            {item.description ? (
                              <span className="omai-walker__description">{item.description}</span>
                            ) : null}
                          </div>
                          {item.shortcut && item.shortcut.length > 0 ? (
                            <Kbd keys={item.shortcut} size="sm" className="omai-walker__shortcut" />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {footer === false ? null : (
            <div className="omai-walker__footer">
              {footer ?? <HotkeyBar items={DEFAULT_FOOTER_ITEMS} size="sm" />}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
