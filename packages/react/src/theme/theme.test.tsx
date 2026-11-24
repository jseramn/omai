import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OmaiProvider, useOmaiTheme } from './index';
import { cn } from '../utils/cn';

function Probe() {
  const { theme, mode, setTheme, radius, setRadius, cycleTheme } = useOmaiTheme();
  return (
    <div>
      <span data-testid="state">{`${theme}|${mode}|${radius}`}</span>
      <button onClick={() => setTheme('catppuccin-latte')}>latte</button>
      <button onClick={() => setRadius('soft')}>soft</button>
      <button onClick={() => cycleTheme(1)}>next</button>
    </div>
  );
}

describe('OmaiProvider', () => {
  it('applies default tokyo-night / dark / sharp to <html>', () => {
    render(<OmaiProvider><Probe /></OmaiProvider>);
    expect(screen.getByTestId('state')).toHaveTextContent('tokyo-night|dark|sharp');
    const html = document.documentElement;
    expect(html).toHaveAttribute('data-omai-theme', 'tokyo-night');
    expect(html).toHaveAttribute('data-omai-mode', 'dark');
    expect(html).toHaveAttribute('data-omai-radius', 'sharp');
  });

  it('switches theme + radius and persists to localStorage', async () => {
    const user = userEvent.setup();
    render(<OmaiProvider><Probe /></OmaiProvider>);
    await user.click(screen.getByText('latte'));
    await user.click(screen.getByText('soft'));
    expect(document.documentElement).toHaveAttribute('data-omai-theme', 'catppuccin-latte');
    expect(document.documentElement).toHaveAttribute('data-omai-mode', 'light');
    expect(document.documentElement).toHaveAttribute('data-omai-radius', 'soft');
    expect(localStorage.getItem('omai-theme')).toBe('catppuccin-latte');
  });

  it('scoped target renders a themed wrapper', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <OmaiProvider target="scope" storageKey={null} defaultTheme="nord"><Probe /></OmaiProvider>,
    );
    const scope = container.querySelector('.omai-theme-scope')!;
    expect(scope).toHaveAttribute('data-omai-theme', 'nord');
    await user.click(screen.getByText('next'));
    expect(scope).toHaveAttribute('data-omai-theme', 'osaka-jade');
    expect(document.documentElement).not.toHaveAttribute('data-omai-theme');
  });

  it('throws outside a provider', () => {
    expect(() => render(<Probe />)).toThrow(/OmaiProvider/);
  });
});

describe('cn', () => {
  it('lets consumer tailwind classes win and keeps omai-* classes', () => {
    expect(cn('omai-button', 'px-2', false && 'hidden', 'px-4')).toBe('omai-button px-4');
  });
});
