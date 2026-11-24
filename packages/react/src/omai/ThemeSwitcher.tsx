import type { OmaiMode, OmaiThemeId, OmaiThemeMeta } from '@jseramn/omai-tokens';
import { Check } from 'lucide-react';
import {
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { useOmaiTheme } from '../theme';
import { cn, getNavigationDelta, getNextIndex } from '../utils';

export interface ThemeSwitcherProps extends Omit<ComponentPropsWithRef<'div'>, 'onSelect'> {
  variant?: 'grid' | 'list' | 'select' | 'compact';
  themes?: readonly OmaiThemeId[];
  columns?: number;
  showRadiusToggle?: boolean;
  showModeLabel?: boolean;
  onSelect?(id: OmaiThemeId): void;
}

export function ThemeSwitcher({
  variant = 'grid',
  themes: themesFilter,
  columns = 4,
  showRadiusToggle = false,
  showModeLabel = false,
  onSelect,
  className,
  style,
  ref,
  ...rest
}: ThemeSwitcherProps) {
  const { theme, setTheme, themes: allThemes, radius, setRadius } = useOmaiTheme();
  const [modeFilter, setModeFilter] = useState<'all' | OmaiMode>('all');
  const radioRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const baseList = useMemo<readonly OmaiThemeMeta[]>(() => {
    if (!themesFilter) return allThemes;
    const byId = new Map(allThemes.map((t) => [t.id, t]));
    return themesFilter
      .map((id) => byId.get(id))
      .filter((item): item is OmaiThemeMeta => item !== undefined);
  }, [allThemes, themesFilter]);

  const visibleThemes = useMemo<readonly OmaiThemeMeta[]>(() => {
    if (modeFilter === 'all' || variant === 'select' || variant === 'compact') {
      return baseList;
    }
    return baseList.filter((t) => t.mode === modeFilter);
  }, [baseList, modeFilter, variant]);

  const selectTheme = (id: OmaiThemeId) => {
    setTheme(id);
    onSelect?.(id);
  };

  const handleRadioKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const orientation = variant === 'list' ? 'vertical' : 'both';
    const delta = getNavigationDelta(event.key, orientation);
    if (delta === null || visibleThemes.length === 0) return;

    event.preventDefault();
    let nextIndex = index;
    if (delta === 'first') {
      nextIndex = 0;
    } else if (delta === 'last') {
      nextIndex = visibleThemes.length - 1;
    } else {
      nextIndex = getNextIndex(index, delta, visibleThemes.length, { loop: true });
    }

    const nextMeta = visibleThemes[nextIndex];
    if (!nextMeta) return;
    radioRefs.current[nextIndex]?.focus();
    selectTheme(nextMeta.id);
  };

  const activeVisibleIndex = visibleThemes.findIndex((t) => t.id === theme);
  const showToolbar =
    showRadiusToggle || (variant === 'grid' || variant === 'list') && baseList.some((t) => t.mode === 'light');

  return (
    <div
      ref={ref}
      className={cn('omai-theme-switcher', className)}
      data-variant={variant}
      style={{ '--omai-theme-columns': columns, ...style } as CSSProperties}
      {...rest}
    >
      {showToolbar && variant !== 'select' && variant !== 'compact' ? (
        <div className="omai-theme-switcher__toolbar">
          <div className="omai-theme-switcher__filters" role="group" aria-label="Filter themes by mode">
            {(['all', 'dark', 'light'] as const).map((m) => (
              <button
                key={m}
                type="button"
                className="omai-theme-switcher__filter-btn"
                aria-pressed={modeFilter === m}
                data-state={modeFilter === m ? 'active' : 'inactive'}
                onClick={() => setModeFilter(m)}
              >
                {m}
              </button>
            ))}
          </div>

          {showRadiusToggle ? (
            <button
              type="button"
              className="omai-theme-switcher__radius-btn"
              aria-pressed={radius === 'soft'}
              onClick={() => setRadius(radius === 'sharp' ? 'soft' : 'sharp')}
            >
              radius: {radius}
            </button>
          ) : null}
        </div>
      ) : null}

      {variant === 'select' ? (
        <div className="omai-theme-switcher__select-row">
          <select
            aria-label="Theme"
            className="omai-theme-switcher__select"
            value={theme}
            onChange={(e) => selectTheme(e.target.value as OmaiThemeId)}
          >
            {visibleThemes.map((meta) => (
              <option key={meta.id} value={meta.id}>
                {meta.name}
                {showModeLabel ? ` (${meta.mode})` : ''}
              </option>
            ))}
          </select>

          {showRadiusToggle ? (
            <button
              type="button"
              className="omai-theme-switcher__radius-btn"
              aria-pressed={radius === 'soft'}
              onClick={() => setRadius(radius === 'sharp' ? 'soft' : 'sharp')}
            >
              radius: {radius}
            </button>
          ) : null}
        </div>
      ) : (
        <div
          role="radiogroup"
          aria-label="OMAI theme"
          className="omai-theme-switcher__group"
        >
          {visibleThemes.map((meta, index) => {
            const isActive = meta.id === theme;
            const isTabTarget = activeVisibleIndex === -1 ? index === 0 : isActive;

            return (
              <button
                key={meta.id}
                ref={(el) => {
                  radioRefs.current[index] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={variant === 'compact' ? meta.name : undefined}
                tabIndex={isTabTarget ? 0 : -1}
                data-state={isActive ? 'active' : 'inactive'}
                data-theme-id={meta.id}
                data-mode={meta.mode}
                className="omai-theme-switcher__option"
                onClick={() => selectTheme(meta.id)}
                onKeyDown={(e) => handleRadioKeyDown(e, index)}
              >
                <span className="omai-theme-switcher__swatches" aria-hidden="true">
                  <span
                    className="omai-theme-switcher__swatch"
                    style={{ backgroundColor: meta.swatch.bg }}
                  />
                  <span
                    className="omai-theme-switcher__swatch"
                    style={{ backgroundColor: meta.swatch.surface }}
                  />
                  <span
                    className="omai-theme-switcher__swatch"
                    style={{ backgroundColor: meta.swatch.text }}
                  />
                  <span
                    className="omai-theme-switcher__swatch"
                    style={{ backgroundColor: meta.swatch.brand }}
                  />
                </span>

                {variant !== 'compact' ? (
                  <span className="omai-theme-switcher__info">
                    <span className="omai-theme-switcher__name">{meta.name}</span>
                    {showModeLabel ? (
                      <span className="omai-theme-switcher__mode">{meta.mode}</span>
                    ) : null}
                  </span>
                ) : null}

                {variant !== 'compact' && isActive ? (
                  <span className="omai-theme-switcher__check" aria-hidden="true">
                    <Check size={14} strokeWidth={2} aria-hidden />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {showRadiusToggle && variant === 'compact' ? (
        <button
          type="button"
          className="omai-theme-switcher__radius-btn"
          aria-pressed={radius === 'soft'}
          onClick={() => setRadius(radius === 'sharp' ? 'soft' : 'sharp')}
        >
          radius: {radius}
        </button>
      ) : null}
    </div>
  );
}
