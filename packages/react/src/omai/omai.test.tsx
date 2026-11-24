import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { OmaiProvider } from '../theme';
import { HotkeyBar } from './HotkeyBar';
import { PixelField } from './PixelField';
import { Terminal, ansiToReact } from './Terminal';
import { ThemeSwitcher } from './ThemeSwitcher';
import { TilingGrid, WindowPane } from './TilingGrid';
import { Walker, type WalkerItem } from './Walker';
import {
  Waybar,
  WaybarClock,
  WaybarLayoutIndicator,
  WaybarLogo,
  WaybarModule,
  WaybarStat,
  WaybarWorkspaces,
} from './Waybar';
import { fuzzyMatch } from './fuzzyMatch';

describe('fuzzyMatch', () => {
  it('matches subsequences case-insensitively and ranks prefix matches higher', () => {
    const prefix = fuzzyMatch('th', 'Theme Switcher');
    const scattered = fuzzyMatch('th', 'Switch Theme');
    expect(prefix).not.toBeNull();
    expect(scattered).not.toBeNull();
    expect(prefix!.score).toBeGreaterThan(scattered!.score);
    expect(fuzzyMatch('xyz', 'Theme')).toBeNull();
  });
});

describe('Walker', () => {
  const items: WalkerItem[] = [
    { id: 'theme', label: 'Change Theme', group: 'Appearance', shortcut: ['Super', 'T'] },
    { id: 'term', label: 'Open Terminal', group: 'Apps', shortcut: ['Super', 'Return'] },
    { id: 'locked', label: 'Disabled Command', group: 'System', disabled: true },
  ];

  it('opens on mod+k hotkey, filters results, and selects with keyboard', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <OmaiProvider>
        <Walker items={items} onSelect={onSelect} />
      </OmaiProvider>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const input = screen.getByRole('combobox');
    await user.type(input, 'term');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Open Terminal');

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'term' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates with ArrowDown/ArrowUp skipping disabled items and closes on Escape', async () => {
    const user = userEvent.setup();
    render(
      <OmaiProvider target="scope">
        <Walker items={items} defaultOpen />
      </OmaiProvider>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.parentElement).toHaveAttribute('data-omai-theme', 'tokyo-night');

    const input = screen.getByRole('combobox');
    input.focus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: /Open Terminal/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // Wraps past disabled item back to first item
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: /Change Theme/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Waybar', () => {
  it('renders left/center/right slots, workspaces, layout indicator, and clock', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const ref = createRef<HTMLElement>();

    render(
      <Waybar
        ref={ref}
        variant="glassy"
        left={
          <>
            <WaybarLogo />
            <WaybarWorkspaces count={5} active={2} occupied={[1, 2, 4]} onSelect={onSelect} />
            <WaybarLayoutIndicator layout="dwindle" />
          </>
        }
        center={<WaybarClock now={new Date(2026, 10, 23, 14, 5)} />}
        right={
          <>
            <WaybarStat label="CPU" value="18%" meter={18} tone="brand" />
            <WaybarModule label="Net" active />
          </>
        }
      />,
    );

    expect(ref.current).toHaveAttribute('data-variant', 'glassy');
    expect(ref.current).toHaveStyle({ height: '26px' });
    expect(screen.getByLabelText('Layout: dwindle')).toHaveTextContent('■');
    expect(screen.getByText(/14:05/)).toBeInTheDocument();

    const ws2 = screen.getByRole('button', { name: 'Workspace 2' });
    expect(ws2).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Workspace 4' }));
    expect(onSelect).toHaveBeenCalledWith(4);
  });
});

describe('TilingGrid & WindowPane', () => {
  it('activates clicked pane and navigates with Alt+Arrow', async () => {
    const user = userEvent.setup();
    const onActiveChange = vi.fn();

    render(
      <TilingGrid layout="dwindle" defaultActiveId="p1" onActiveChange={onActiveChange}>
        <WindowPane id="p1" title="ghostty">
          Terminal
        </WindowPane>
        <WindowPane id="p2" title="nvim">
          Editor
        </WindowPane>
      </TilingGrid>,
    );

    const p1 = screen.getByLabelText('ghostty');
    const p2 = screen.getByLabelText('nvim');
    expect(p1).toHaveAttribute('data-state', 'active');
    expect(p2).toHaveAttribute('data-state', 'inactive');

    await user.click(p2);
    expect(onActiveChange).toHaveBeenCalledWith('p2');
    expect(p2).toHaveAttribute('data-state', 'active');

    p2.focus();
    fireEvent.keyDown(p2, { key: 'ArrowLeft', altKey: true });
    expect(onActiveChange).toHaveBeenCalledWith('p1');
    expect(p1).toHaveAttribute('data-state', 'active');
  });
});

describe('ThemeSwitcher', () => {
  it('renders all 16 themes, switches theme on click and arrow key, and toggles radius', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <OmaiProvider>
        <ThemeSwitcher showRadiusToggle showModeLabel onSelect={onSelect} />
      </OmaiProvider>,
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(16);

    const nord = screen.getByRole('radio', { name: /Nord/i });
    await user.click(nord);
    expect(onSelect).toHaveBeenCalledWith('nord');
    expect(document.documentElement).toHaveAttribute('data-omai-theme', 'nord');
    expect(nord).toHaveAttribute('aria-checked', 'true');

    nord.focus();
    await user.keyboard('{ArrowRight}');
    expect(document.documentElement).toHaveAttribute('data-omai-theme', 'osaka-jade');

    const radiusBtn = screen.getByRole('button', { name: /radius: sharp/i });
    await user.click(radiusBtn);
    expect(document.documentElement).toHaveAttribute('data-omai-radius', 'soft');
  });
});

describe('Terminal, HotkeyBar, PixelField', () => {
  it('parses ANSI SGR colors and renders Terminal lines', () => {
    render(
      <>
        <Terminal
          title="ghostty"
          user="jseramn"
          cwd="~/omai"
          lines={[
            { type: 'command', text: 'omai-theme-set tokyo-night' },
            { type: 'output', text: '\u001b[32mApplied\u001b[0m theme' },
          ]}
        />
        <div data-testid="ansi-out">{ansiToReact('\u001b[1;94mhello\u001b[0m')}</div>
      </>,
    );

    expect(screen.getByText('omai-theme-set tokyo-night')).toBeInTheDocument();
    expect(screen.getByText('Applied')).toHaveAttribute('data-color', '2');
    expect(screen.getByText('Applied').style.color).toBe('var(--omai-ansi-2)');
    expect(screen.getByText('hello')).toHaveAttribute('data-color', '12');
    expect(screen.getByText('hello').style.color).toBe('var(--omai-ansi-12)');
  });

  it('triggers HotkeyBar action via click and combo', async () => {
    const user = userEvent.setup();
    const onTrigger = vi.fn();

    render(
      <HotkeyBar
        items={[{ keys: ['Super', 'Space'], label: 'Launcher', combo: 'alt+l', onTrigger }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Launcher/i }));
    expect(onTrigger).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: 'l', altKey: true });
    expect(onTrigger).toHaveBeenCalledTimes(2);
  });

  it('renders PixelField canvas and overlay content', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PixelField ref={ref} pattern="static" height={240}>
        <h1>OMAI</h1>
      </PixelField>,
    );

    expect(ref.current).toHaveAttribute('data-pattern', 'static');
    expect(ref.current?.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('heading', { name: 'OMAI' })).toBeInTheDocument();
  });
});
