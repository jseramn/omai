import { useId, type ComponentPropsWithRef, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../utils/hooks';
import { useFormField } from './FormField';

export interface SwitchProps
  extends Omit<ComponentPropsWithRef<'button'>, 'onChange' | 'value' | 'defaultValue'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  size?: 'sm' | 'md';
  name?: string;
  value?: string;
}

export function Switch({
  ref,
  className,
  style,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label,
  size = 'md',
  name,
  value = 'on',
  id: idProp,
  disabled: disabledProp,
  'aria-describedby': ariaDescribedByProp,
  'aria-invalid': ariaInvalidProp,
  onClick,
  ...rest
}: SwitchProps) {
  const field = useFormField();
  const autoId = useId();
  const id = idProp ?? field?.id ?? autoId;
  const disabled = Boolean(disabledProp ?? field?.disabled);
  const invalid = Boolean(
    (ariaInvalidProp === true || ariaInvalidProp === 'true' ? true : undefined) ?? field?.invalid,
  );
  const describedBy =
    [ariaDescribedByProp, field?.descriptionId, field?.errorId].filter(Boolean).join(' ') ||
    undefined;
  const ariaInvalid = invalid ? true : ariaInvalidProp;

  const [checked, setChecked] = useControllableState<boolean>({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const dataState = checked ? 'on' : 'off';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented && !disabled) {
      setChecked((prev) => !prev);
    }
  };

  const button = (
    <button
      ref={ref}
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-invalid={ariaInvalid}
      aria-describedby={describedBy}
      aria-required={field?.required || undefined}
      disabled={disabled}
      className={cn('omai-switch', className)}
      style={!label ? style : undefined}
      data-state={dataState}
      data-size={size}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      onClick={handleClick}
      {...rest}
    >
      <span className="omai-switch__thumb" data-state={dataState} aria-hidden="true" />
    </button>
  );

  const hiddenInput = name ? (
    <input
      type="hidden"
      name={name}
      value={checked ? value : ''}
      disabled={disabled}
    />
  ) : null;

  if (!label) {
    return (
      <>
        {button}
        {hiddenInput}
      </>
    );
  }

  return (
    <div
      className="omai-switch-field"
      style={style}
      data-size={size}
      data-state={dataState}
      data-disabled={disabled ? '' : undefined}
    >
      {button}
      <label htmlFor={id} className="omai-switch__label">
        {label}
      </label>
      {hiddenInput}
    </div>
  );
}
