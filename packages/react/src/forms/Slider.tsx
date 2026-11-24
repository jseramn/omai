import type { ChangeEvent, ComponentPropsWithRef, CSSProperties } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../utils/hooks';
import { useFormField } from './FormField';

export interface SliderProps
  extends Omit<
    ComponentPropsWithRef<'input'>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'size'
  > {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onChange?: ComponentPropsWithRef<'input'>['onChange'];
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  size?: 'sm' | 'md';
}

export function Slider({
  ref,
  className,
  style,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = false,
  formatValue,
  size = 'md',
  id: idProp,
  disabled: disabledProp,
  'aria-describedby': ariaDescribedByProp,
  ...rest
}: SliderProps) {
  const field = useFormField();
  const id = idProp ?? field?.id;
  const disabled = Boolean(disabledProp ?? field?.disabled);
  const describedBy =
    [ariaDescribedByProp, field?.descriptionId, field?.errorId].filter(Boolean).join(' ') ||
    undefined;

  const [value, setValue] = useControllableState<number>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const clamped = Math.min(max, Math.max(min, value));
  const fillPercent = max > min ? ((clamped - min) / (max - min)) * 100 : 0;
  const sliderStyle = {
    ...style,
    '--omai-slider-fill': `${fillPercent}%`,
  } as CSSProperties;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setValue(next);
    onChange?.(e);
  };

  return (
    <div
      className={cn('omai-slider', className)}
      style={sliderStyle}
      data-size={size}
      data-disabled={disabled ? '' : undefined}
    >
      <input
        ref={ref}
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        disabled={disabled}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-describedby={describedBy}
        className="omai-slider__input"
        data-size={size}
        onChange={handleChange}
        {...rest}
      />
      {showValue && (
        <output className="omai-slider__value" htmlFor={id}>
          {formatValue ? formatValue(clamped) : clamped}
        </output>
      )}
    </div>
  );
}
