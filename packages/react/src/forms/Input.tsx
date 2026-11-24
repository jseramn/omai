import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Size } from '../types';
import { cn } from '../utils/cn';
import { useFormField } from './FormField';

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  size?: Size;
  invalid?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Input({
  ref,
  className,
  style,
  size = 'md',
  invalid: invalidProp,
  leadingIcon,
  trailingIcon,
  id: idProp,
  disabled: disabledProp,
  required: requiredProp,
  'aria-describedby': ariaDescribedByProp,
  'aria-invalid': ariaInvalidProp,
  type = 'text',
  ...rest
}: InputProps) {
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

  const hasAffix = Boolean(leadingIcon || trailingIcon);

  if (!hasAffix) {
    return (
      <input
        ref={ref}
        id={id}
        type={type}
        className={cn('omai-input', className)}
        style={style}
        disabled={disabled}
        required={required}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
        data-size={size}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        {...rest}
      />
    );
  }

  return (
    <span
      className={cn('omai-input', 'omai-input--affixed', className)}
      style={style}
      data-size={size}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      {leadingIcon && (
        <span className="omai-input__icon omai-input__icon--leading" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className="omai-input__control"
        disabled={disabled}
        required={required}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
        data-size={size}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        {...rest}
      />
      {trailingIcon && (
        <span className="omai-input__icon omai-input__icon--trailing" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </span>
  );
}
