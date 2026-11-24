import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Checkbox,
  FormField,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  Slider,
  Switch,
  Textarea,
} from './index';

describe('Forms', () => {
  describe('FormField & Input', () => {
    it('wires id, aria-describedby, aria-invalid, and required to child Input', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <FormField
          id="hostname"
          label="Hostname"
          description="Used in terminal prompt"
          error="Hostname is required"
          required
        >
          <Input ref={ref} placeholder="omai-box" />
        </FormField>,
      );

      const input = screen.getByLabelText(/Hostname/i);
      expect(input).toBe(ref.current);
      expect(input).toHaveAttribute('id', 'hostname');
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('data-invalid');
      expect(input).toHaveAttribute('aria-describedby', 'hostname-description hostname-error');
      expect(screen.getByRole('alert')).toHaveTextContent('Hostname is required');
    });

    it('renders affixed Input with leading and trailing icons', () => {
      const { container } = render(
        <Input
          leadingIcon={<span data-testid="lead">$</span>}
          trailingIcon={<span data-testid="trail">.00</span>}
          className="affixed-custom"
          placeholder="Amount"
        />,
      );
      const root = container.querySelector('.omai-input--affixed');
      expect(root).toHaveClass('omai-input', 'affixed-custom');
      expect(screen.getByTestId('lead')).toBeInTheDocument();
      expect(screen.getByTestId('trail')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Amount')).toHaveClass('omai-input__control');
    });
  });

  describe('Textarea', () => {
    it('supports resize, invalid, and autoResize', () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} resize="none" invalid autoResize defaultValue="line 1" />);
      const ta = screen.getByRole('textbox');
      expect(ta).toBe(ref.current);
      expect(ta).toHaveAttribute('data-resize', 'none');
      expect(ta).toHaveAttribute('data-invalid');
      expect(ta).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Select', () => {
    it('renders native select with placeholder, options, and calls onValueChange', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Select
          aria-label="Theme"
          placeholder="Choose a theme"
          options={[
            { value: 'tokyo-night', label: 'Tokyo Night' },
            { value: 'nord', label: 'Nord' },
          ]}
          onValueChange={onValueChange}
        />,
      );
      const select = screen.getByRole('combobox', { name: 'Theme' });
      await user.selectOptions(select, 'nord');
      expect(onValueChange).toHaveBeenCalledWith('nord');
    });
  });

  describe('Checkbox', () => {
    it('supports unchecked, checked, and indeterminate states', async () => {
      const onCheckedChange = vi.fn();
      const user = userEvent.setup();
      const { rerender } = render(
        <Checkbox label="Enable Waybar" description="Top status bar" onCheckedChange={onCheckedChange} />,
      );

      const cb = screen.getByRole('checkbox', { name: /Enable Waybar/i }) as HTMLInputElement;
      expect(cb).not.toBeChecked();
      await user.click(cb);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
      expect(cb).toBeChecked();

      rerender(<Checkbox label="Enable Waybar" checked="indeterminate" />);
      expect(cb.indeterminate).toBe(true);
      expect(cb).toHaveAttribute('aria-checked', 'mixed');
      expect(cb).toHaveAttribute('data-state', 'indeterminate');
    });
  });

  describe('Switch', () => {
    it('toggles role="switch" and renders hidden form input when name is provided', async () => {
      const onCheckedChange = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Switch label="Gaps enabled" name="gaps" value="yes" onCheckedChange={onCheckedChange} />,
      );
      const sw = screen.getByRole('switch', { name: 'Gaps enabled' });
      expect(sw).toHaveAttribute('aria-checked', 'false');
      expect(sw).toHaveAttribute('data-state', 'off');

      await user.click(sw);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
      expect(sw).toHaveAttribute('aria-checked', 'true');
      expect(sw).toHaveAttribute('data-state', 'on');
      const hidden = container.querySelector('input[type="hidden"][name="gaps"]') as HTMLInputElement;
      expect(hidden.value).toBe('yes');
    });
  });

  describe('RadioGroup', () => {
    it('renders options and supports keyboard arrow navigation and RadioGroupItem children', async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <RadioGroup
          aria-label="Layout"
          defaultValue="dwindle"
          onValueChange={onValueChange}
          options={[
            { value: 'dwindle', label: 'Dwindle' },
            { value: 'scrolling', label: 'Scrolling' },
          ]}
        >
          <RadioGroupItem value="floating" label="Floating" />
        </RadioGroup>,
      );

      const group = screen.getByRole('radiogroup', { name: 'Layout' });
      const dwindle = screen.getByRole('radio', { name: 'Dwindle' });
      const scrolling = screen.getByRole('radio', { name: 'Scrolling' });
      expect(dwindle).toBeChecked();

      dwindle.focus();
      fireEvent.keyDown(group, { key: 'ArrowDown' });
      expect(onValueChange).toHaveBeenCalledWith('scrolling');
      expect(scrolling).toBeChecked();

      await user.click(screen.getByRole('radio', { name: 'Floating' }));
      expect(onValueChange).toHaveBeenCalledWith('floating');
    });
  });

  describe('Slider', () => {
    it('updates range value, sets --omai-slider-fill, and formats output', () => {
      const onValueChange = vi.fn();
      const { container } = render(
        <Slider
          aria-label="Volume"
          min={0}
          max={200}
          defaultValue={50}
          showValue
          formatValue={(v) => `${v}%`}
          onValueChange={onValueChange}
        />,
      );
      const slider = screen.getByRole('slider', { name: 'Volume' });
      const wrapper = container.querySelector('.omai-slider') as HTMLElement;
      expect(wrapper.style.getPropertyValue('--omai-slider-fill')).toBe('25%');
      expect(screen.getByText('50%')).toBeInTheDocument();

      fireEvent.change(slider, { target: { value: '150' } });
      expect(onValueChange).toHaveBeenCalledWith(150);
      expect(wrapper.style.getPropertyValue('--omai-slider-fill')).toBe('75%');
      expect(screen.getByText('150%')).toBeInTheDocument();
    });
  });
});
