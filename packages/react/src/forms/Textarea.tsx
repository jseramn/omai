import { useCallback, useRef, type ChangeEvent, type ComponentPropsWithRef } from 'react';
import { cn } from '../utils/cn';
import { mergeRefs, useIsomorphicLayoutEffect } from '../utils/hooks';
import { useFormField } from './FormField';

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  invalid?: boolean;
  resize?: 'none' | 'vertical' | 'both';
  autoResize?: boolean;
}

export function Textarea({
  ref,
  className,
  invalid: invalidProp,
  resize = 'vertical',
  autoResize = false,
  id: idProp,
  disabled: disabledProp,
  required: requiredProp,
  'aria-describedby': ariaDescribedByProp,
  'aria-invalid': ariaInvalidProp,
  onChange,
  value,
  defaultValue,
  ...rest
}: TextareaProps) {
  const field = useFormField();
  const internalRef = useRef<HTMLTextAreaElement | null>(null);

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

  const adjustHeight = useCallback(() => {
    const el = internalRef.current;
    if (!autoResize || !el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize]);

  useIsomorphicLayoutEffect(() => {
    adjustHeight();
  }, [adjustHeight, value, defaultValue]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight();
    onChange?.(e);
  };

  return (
    <textarea
      ref={mergeRefs(internalRef, ref)}
      id={id}
      className={cn('omai-textarea', className)}
      disabled={disabled}
      required={required}
      aria-invalid={ariaInvalid}
      aria-describedby={describedBy}
      data-resize={resize}
      data-auto-resize={autoResize ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      {...rest}
    />
  );
}
