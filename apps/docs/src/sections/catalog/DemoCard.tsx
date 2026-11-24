import { useState, type ReactNode } from 'react';
import { Badge, CodeBlock } from '@jseramn/omai';
import { Code2 } from 'lucide-react';
import type { ComponentCategoryId } from '../../data/catalogMeta';

export interface DemoCardProps {
  id: string;
  name: string;
  category: ComponentCategoryId;
  cssClass: string;
  tagline: string;
  code: string;
  defaultShowCode?: boolean;
  children: ReactNode;
}

const CATEGORY_BADGE_TONE: Record<
  ComponentCategoryId,
  'brand' | 'info' | 'success' | 'warning' | 'neutral'
> = {
  primitives: 'brand',
  forms: 'info',
  feedback: 'warning',
  navigation: 'success',
  data: 'neutral',
  omai: 'brand',
};

export function DemoCard({
  id,
  name,
  category,
  cssClass,
  tagline,
  code,
  defaultShowCode = false,
  children,
}: DemoCardProps) {
  const [showCode, setShowCode] = useState(defaultShowCode);

  return (
    <article
      id={id}
      aria-labelledby={`${id}-title`}
      className="min-w-0 max-w-full scroll-mt-20 overflow-hidden border border-omai-border-subtle bg-omai-surface rounded-omai-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-omai-border-subtle bg-omai-bg-deep/50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h4
            id={`${id}-title`}
            className="font-sans text-base font-semibold tracking-tight text-omai-text"
          >
            {name}
          </h4>
          <code className="border border-omai-border-subtle bg-omai-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-omai-brand rounded-omai-xs">
            {cssClass}
          </code>
          <Badge tone={CATEGORY_BADGE_TONE[category]} variant="soft" size="sm">
            {category}
          </Badge>
        </div>

        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          aria-expanded={showCode}
          className="inline-flex items-center gap-1.5 border border-omai-border-strong bg-omai-surface px-2.5 py-1 font-mono text-xs text-omai-text-secondary transition-colors hover:bg-omai-surface-2 hover:text-omai-text aria-expanded:border-omai-brand aria-expanded:text-omai-brand rounded-omai-sm"
        >
          <Code2 size={13} strokeWidth={1.75} aria-hidden />
          {showCode ? 'Hide TSX' : 'View TSX'}
        </button>
      </div>

      <div className="border-b border-omai-border-subtle px-4 py-2 font-mono text-xs text-omai-text-secondary">
        {tagline}
      </div>

      <div className="bg-omai-bg p-4 sm:p-5">{children}</div>

      {showCode ? (
        <div className="border-t border-omai-border-subtle bg-omai-bg-deep p-3">
          <CodeBlock title={`${name}.tsx`} language="tsx" code={code} showLineNumbers />
        </div>
      ) : null}
    </article>
  );
}
