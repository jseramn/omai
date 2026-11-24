import { Check, Minus } from 'lucide-react';
import { useRef, type ChangeEvent, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { mergeRefs, useControllableState, useIsomorphicLayoutEffect } from '../utils/hooks';
import { useFormField } from './FormField';

export interface CheckboxProps
  extends Omit<
    ComponentPropsWithRef<'input'>,
    'type' | 'size' | 'checked' | 'defaultChecked'
  > {
  checked?: boolean | 'indeterminate';
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md';
  invalid?: boolean;
}

export function Checkbox({
  ref,
  className,
  style,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  onChange,
  label,
  description,
  size = 'md',
  invalid: invalidProp,
  id: idProp,
  disabled: disabledProp,
  required: requiredProp,
  'aria-describedby': ariaDescribedByProp,
  'aria-invalid': ariaInvalidProp,
  children,
  ...rest
}: CheckboxProps) {
  const field = useFormField();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const id = idProp ?? field?.id;
  const disabled = Boolean(disabledProp ?? field?.disabled);
  const required = Boolean(requiredProp ?? field?.required);
  const invalid = Boolean(
    invalidProp ??
      (ariaInvalidProp === true || ariaInvalidProp === 'true' ? true : undefined) ??
      field?.invalid,
  );
  const describedBy =
    [ariaDescribedByProp, field?.descriptionId, field?.errorId].filter(Boolean).join(' ') ||
    undefined;
  const ariaInvalid = invalid ? true : ariaInvalidProp;

  const [state, setState] = useControllableState<boolean | 'indeterminate'>({
    value: checkedProp,
    defaultValue: defaultChecked,
  });

  const isIndeterminate = state === 'indeterminate';
  const isChecked = state === true;
  const dataState = isIndeterminate ? 'indeterminate' : isChecked ? 'checked' : 'unchecked';

  useIsomorphicLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    setState(next);
    onChange?.(e);
    onCheckedChange?.(next);
  };

  const labelContent = label ?? children;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <label
      className={cn('omai-checkbox', className)}
      style={style}
      data-size={size}
      data-state={dataState}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <input
        ref={mergeRefs(inputRef, ref)}
        id={id}
        type="checkbox"
        className="omai-checkbox__input"
        checked={isChecked}
        disabled={disabled}
        required={required}
        aria-checked={isIndeterminate ? 'mixed' : isChecked}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
        data-state={dataState}
        data-size={size}
        data-invalid={invalid ? '' : undefined}
        onChange={handleChange}
        {...rest}
      />
      <span className="omai-checkbox__box" data-state={dataState} aria-hidden="true">
        {isIndeterminate ? (
          <Minus size={iconSize} strokeWidth={2.25} />
        ) : isChecked ? (
          <Check size={iconSize} strokeWidth={2.25} />
        ) : null}
      </span>
      {(labelContent !== undefined && labelContent !== null) || description ? (
        <span className="omai-checkbox__content">
          {labelContent !== undefined && labelContent !== null && (
            <span className="omai-checkbox__label">{labelContent}</span>
          )}
          {description && <span className="omai-checkbox__description">{description}</span>}
        </span>
      ) : null}
    </label>
  );
}
