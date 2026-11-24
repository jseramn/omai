import {
  createContext,
  useContext,
  useId,
  useMemo,
  useRef,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { Orientation } from '../types';
import { cn } from '../utils/cn';
import { getNavigationDelta, getNextIndex } from '../utils/focus';
import { mergeRefs, useControllableState } from '../utils/hooks';
import { useFormField } from './FormField';

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onSelect: (value: string) => void;
  disabled: boolean;
  invalid: boolean;
  size: 'sm' | 'md';
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupItemProps
  extends Omit<
    ComponentPropsWithRef<'input'>,
    'type' | 'size' | 'value' | 'checked' | 'defaultChecked'
  > {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md';
}

export function RadioGroupItem({
  ref,
  className,
  style,
  value,
  label,
  description,
  disabled: disabledProp,
  size: sizeProp,
  onChange,
  children,
  ...rest
}: RadioGroupItemProps) {
  const ctx = useContext(RadioGroupContext);
  const isChecked = ctx ? ctx.value === value : false;
  const isDisabled = Boolean(disabledProp || ctx?.disabled);
  const size = sizeProp ?? ctx?.size ?? 'md';
  const dataState = isChecked ? 'checked' : 'unchecked';
  const labelContent = label ?? children;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    if (!isDisabled) {
      ctx?.onSelect(value);
    }
  };

  return (
    <label
      className={cn('omai-radio', className)}
      style={style}
      data-size={size}
      data-state={dataState}
      data-disabled={isDisabled ? '' : undefined}
      data-invalid={ctx?.invalid ? '' : undefined}
    >
      <input
        ref={ref}
        type="radio"
        name={ctx?.name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        aria-invalid={ctx?.invalid || undefined}
        className="omai-radio__input"
        data-state={dataState}
        data-size={size}
        onChange={handleChange}
        {...rest}
      />
      <span className="omai-radio__circle" data-state={dataState} aria-hidden="true">
        <span className="omai-radio__dot" />
      </span>
      {(labelContent !== undefined && labelContent !== null) || description ? (
        <span className="omai-radio__content">
          {labelContent !== undefined && labelContent !== null && (
            <span className="omai-radio__label">{labelContent}</span>
          )}
          {description && <span className="omai-radio__description">{description}</span>}
        </span>
      ) : null}
    </label>
  );
}

export interface RadioGroupProps
  extends Omit<ComponentPropsWithRef<'div'>, 'onChange' | 'defaultValue'> {
  options?: readonly RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  orientation?: Orientation;
  disabled?: boolean;
  invalid?: boolean;
  size?: 'sm' | 'md';
}

export function RadioGroup({
  ref,
  className,
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  name: nameProp,
  orientation = 'vertical',
  disabled: disabledProp,
  invalid: invalidProp,
  size = 'md',
  onKeyDown,
  children,
  ...rest
}: RadioGroupProps) {
  const field = useFormField();
  const autoName = useId();
  const groupRef = useRef<HTMLDivElement | null>(null);

  const name = nameProp ?? autoName;
  const disabled = Boolean(disabledProp ?? field?.disabled);
  const invalid = Boolean(invalidProp ?? field?.invalid);

  const [value, setValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as ((v: string | undefined) => void) | undefined,
  });

  const ctx = useMemo<RadioGroupContextValue>(
    () => ({
      name,
      value,
      onSelect: (next: string) => setValue(next),
      disabled,
      invalid,
      size,
    }),
    [name, value, setValue, disabled, invalid, size],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    const delta = getNavigationDelta(e.key, 'both');
    if (delta === null) return;
    const container = groupRef.current;
    if (!container) return;
    const radios = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    if (radios.length === 0) return;

    const isDisabled = (idx: number) => Boolean(radios[idx]?.disabled);
    const activeEl = document.activeElement as HTMLInputElement | null;
    let currentIndex = radios.findIndex((r) => r === activeEl);
    if (currentIndex === -1) {
      currentIndex = radios.findIndex((r) => r.checked);
    }

    let nextIndex = -1;
    if (delta === 'first') {
      nextIndex = getNextIndex(-1, 1, radios.length, { loop: false, isDisabled });
    } else if (delta === 'last') {
      nextIndex = getNextIndex(radios.length, -1, radios.length, { loop: false, isDisabled });
    } else {
      nextIndex = getNextIndex(currentIndex === -1 ? 0 : currentIndex, delta, radios.length, {
        loop: true,
        isDisabled,
      });
    }

    const target = radios[nextIndex];
    if (target && !target.disabled) {
      e.preventDefault();
      target.focus();
      setValue(target.value);
    }
  };

  return (
    <RadioGroupContext.Provider value={ctx}>
      <div
        ref={mergeRefs(groupRef, ref)}
        role="radiogroup"
        aria-orientation={orientation}
        aria-invalid={invalid || undefined}
        aria-describedby={
          [field?.descriptionId, field?.errorId].filter(Boolean).join(' ') || undefined
        }
        className={cn('omai-radio-group', className)}
        data-orientation={orientation}
        data-size={size}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {options?.map((opt) => (
          <RadioGroupItem
            key={opt.value}
            value={opt.value}
            label={opt.label}
            description={opt.description}
            disabled={opt.disabled}
            size={size}
          />
        ))}
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}
