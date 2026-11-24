import { Fragment, useState, type ComponentPropsWithRef, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../utils';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?(e: MouseEvent): void;
  icon?: ReactNode;
}

export interface BreadcrumbProps extends ComponentPropsWithRef<'nav'> {
  items: readonly BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
  renderLink?(item: BreadcrumbItem, props: { className: string; children: ReactNode }): ReactNode;
}

export function Breadcrumb({
  items,
  separator = '/',
  maxItems,
  renderLink,
  className,
  'aria-label': ariaLabel = 'Breadcrumb',
  ref,
  ...rest
}: BreadcrumbProps) {
  const [expanded, setExpanded] = useState(false);

  const shouldCollapse =
    !expanded && maxItems !== undefined && maxItems >= 2 && items.length > maxItems;

  let displayItems: Array<BreadcrumbItem | { type: 'ellipsis' }> = [];
  if (shouldCollapse) {
    const trailingCount = Math.max(1, maxItems - 1);
    displayItems = [
      items[0]!,
      { type: 'ellipsis' },
      ...items.slice(items.length - trailingCount),
    ];
  } else {
    displayItems = [...items];
  }

  return (
    <nav ref={ref} aria-label={ariaLabel} className={cn('omai-breadcrumb', className)} {...rest}>
      <ol className="omai-breadcrumb__list">
        {displayItems.map((entry, idx) => {
          const isLast = idx === displayItems.length - 1;

          if ('type' in entry) {
            return (
              <Fragment key="omai-breadcrumb-ellipsis">
                <li className="omai-breadcrumb__item">
                  <button
                    type="button"
                    className="omai-breadcrumb__ellipsis"
                    aria-label="Show full breadcrumb path"
                    onClick={() => setExpanded(true)}
                  >
                    …
                  </button>
                </li>
                {!isLast ? (
                  <li className="omai-breadcrumb__separator" aria-hidden="true">
                    {separator}
                  </li>
                ) : null}
              </Fragment>
            );
          }

          const content = entry.icon ? (
            <>
              <span className="omai-breadcrumb__icon">{entry.icon}</span>
              <span className="omai-breadcrumb__label">{entry.label}</span>
            </>
          ) : (
            entry.label
          );

          let node: ReactNode;
          if (isLast) {
            node = (
              <span className="omai-breadcrumb__current" aria-current="page">
                {content}
              </span>
            );
          } else if (renderLink) {
            node = renderLink(entry, { className: 'omai-breadcrumb__link', children: content });
          } else if (entry.href !== undefined) {
            node = (
              <a
                href={entry.href}
                className="omai-breadcrumb__link"
                onClick={entry.onClick}
              >
                {content}
              </a>
            );
          } else if (entry.onClick) {
            node = (
              <button
                type="button"
                className="omai-breadcrumb__link"
                onClick={entry.onClick}
              >
                {content}
              </button>
            );
          } else {
            node = <span className="omai-breadcrumb__text">{content}</span>;
          }

          return (
            <Fragment key={`${idx}-${typeof entry.label === 'string' ? entry.label : 'item'}`}>
              <li className="omai-breadcrumb__item">{node}</li>
              {!isLast ? (
                <li className="omai-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
