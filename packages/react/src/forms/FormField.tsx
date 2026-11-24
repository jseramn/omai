import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import type { Orientation } from '../types';
import { cn } from '../utils/cn';

export interface FormFieldContextValue {
  id: string;
  descriptionId?: string;
  errorId?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export function useFormField(): FormFieldContextValue | null {
  return useContext(FormFieldContext);
}

export interface LabelProps extends ComponentPropsWithRef<'label'> {
  required?: boolean;
  disabled?: boolean;
}

export function Label({
  ref,
  className,
  required,
  disabled,
  htmlFor,
  children,
  ...rest
}: LabelProps) {
  const field = useFormField();
  const resolvedHtmlFor = htmlFor ?? field?.id;
  const isRequired = Boolean(required ?? field?.required);
  const isDisabled = Boolean(disabled ?? field?.disabled);

  return (
    <label
      ref={ref}
      htmlFor={resolvedHtmlFor}
      className={cn('omai-label', 'omai-form-field__label', className)}
      data-disabled={isDisabled ? '' : undefined}
      {...rest}
    >
      {children}
      {isRequired && (
        <span className="omai-form-field__required" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export interface FormFieldProps extends ComponentPropsWithRef<'div'> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  orientation?: Orientation;
  children: ReactNode;
}

export function FormField({
  ref,
  className,
  label,
  description,
  error,
  required = false,
  disabled = false,
  id: idProp,
  orientation = 'vertical',
  children,
  ...rest
}: FormFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const hasDescription = description !== undefined && description !== null && description !== false;
  const hasError = error !== undefined && error !== null && error !== false && error !== '';
  const descriptionId = hasDescription ? `${id}-description` : undefined;
  const errorId = hasError ? `${id}-error` : undefined;
  const invalid = hasError;

  const ctx = useMemo<FormFieldContextValue>(
    () => ({
      id,
      descriptionId,
      errorId,
      invalid,
      required,
      disabled,
    }),
    [id, descriptionId, errorId, invalid, required, disabled],
  );

  return (
    <FormFieldContext.Provider value={ctx}>
      <div
        ref={ref}
        className={cn('omai-form-field', className)}
        data-orientation={orientation}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        {...rest}
      >
        {label !== undefined && label !== null && (
          <div className="omai-form-field__header">
            <Label htmlFor={id} required={required} disabled={disabled}>
              {label}
            </Label>
            {hasDescription && orientation === 'horizontal' && (
              <p id={descriptionId} className="omai-form-field__description">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="omai-form-field__body">
          {children}
          {hasDescription && orientation === 'vertical' && (
            <p id={descriptionId} className="omai-form-field__description">
              {description}
            </p>
          )}
          {hasError && (
            <p id={errorId} role="alert" className="omai-form-field__error">
              {error}
            </p>
          )}
        </div>
      </div>
    </FormFieldContext.Provider>
  );
}
