/** Shared prop vocabulary. Every component uses these names/values — do not invent synonyms. */

export type Size = 'sm' | 'md' | 'lg';

/** Semantic color intent. Maps to --omai-brand / --omai-success / --omai-warning / --omai-danger / --omai-info. */
export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export type Orientation = 'horizontal' | 'vertical';

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

/** Keyboard shortcut descriptor, rendered with <Kbd>. e.g. ['Super', 'Space'] or ['Ctrl', 'K']. */
export type KeyCombo = readonly string[];
