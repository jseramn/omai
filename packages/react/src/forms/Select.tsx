import { ChevronDown } from 'lucide-react';
import type { ChangeEvent, ComponentPropsWithRef, ReactNode } from 'react';
import type { Size } from '../types';
import { cn } from '../utils/cn';
import { useFormField } from './FormField';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size'> {
  size?: Size;
  invalid?: boolean;
  options?: readonly SelectOption[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

export function Select({
  ref,
  className,
  style,
  size = 'md',
  invalid: invalidProp,
  options,
  placeholder,
  id: idProp,
  disabled: disabledProp,
  required: requiredProp,
  'aria-describedby': ariaDescribedByProp,
  'aria-invalid': ariaInvalidProp,
  value,
  defaultValue,
  onChange,
  onValueChange,
  children,
  ...rest
}: SelectProps) {
  const field = useFormField();
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

  const resolvedDefaultValue =
    value === undefined && defaultValue === undefined && placeholder !== undefined
      ? ''
      : defaultValue;

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  return (
    <div
      className={cn('omai-select', className)}
      style={style}
      data-size={size}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <select
        ref={ref}
        id={id}
        className="omai-select__control"
        disabled={disabled}
        required={required}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
        data-size={size}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        value={value}
        defaultValue={resolvedDefaultValue}
        onChange={handleChange}
        {...rest}
      >
        {placeholder !== undefined && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
      <span className="omai-select__chevron" aria-hidden="true">
        <ChevronDown size={16} strokeWidth={1.75} />
      </span>
    </div>
  );
}
