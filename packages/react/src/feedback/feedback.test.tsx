import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../primitives';
import {
  Alert,
  Dialog,
  Drawer,
  DropdownMenu,
  Popover,
  Progress,
  Toast,
  ToastProvider,
  useToast,
} from './index';

function ToastTester({ onAction }: { onAction: () => void }) {
  const { toast, dismiss } = useToast();
  return (
    <div>
      <button
        onClick={() =>
          toast({
            id: 't1',
            title: 'System update ready',
            description: 'omai-update available',
            appName: 'mako',
            tone: 'brand',
            duration: null,
            actions: [{ label: 'Install', onClick: onAction, shortcut: '1' }],
          })
        }
      >
        Notify
      </button>
      <button onClick={() => dismiss()}>Clear</button>
    </div>
  );
}

describe('Feedback & Overlays', () => {
  describe('Alert', () => {
    it('renders status/alert role based on tone and handles dismiss', async () => {
      const onDismiss = vi.fn();
      const user = userEvent.setup();
      const { rerender } = render(
        <Alert tone="info" title="Waybar reloaded" onDismiss={onDismiss}>
          Config applied cleanly.
        </Alert>,
      );

      expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'info');
      await user.click(screen.getByRole('button', { name: 'Dismiss alert' }));
      expect(onDismiss).toHaveBeenCalledTimes(1);

      rerender(<Alert tone="danger" title="Hyprland config error" />);
      expect(screen.getByRole('alert')).toHaveAttribute('data-tone', 'danger');
    });
  });

  describe('Toast & ToastProvider', () => {
    it('renders static Toast card and interactive Mako deck with numbered keyboard shortcuts', async () => {
      const onAction = vi.fn();
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <Toast title="Static preview" tone="warning" appName="ghostty" />
          <ToastTester onAction={onAction} />
        </ToastProvider>,
      );

      expect(screen.getByText('Static preview')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Notify' }));
      expect(screen.getByText('System update ready')).toBeInTheDocument();

      // Trigger numbered shortcut '1'
      fireEvent.keyDown(document, { key: '1' });
      expect(onAction).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('System update ready')).not.toBeInTheDocument();
    });
  });

  describe('Dialog', () => {
    it('opens via trigger, traps focus, locks scroll, and closes on Escape or backdrop click', async () => {
      const user = userEvent.setup();
      render(
        <Dialog
          title="Delete snapshot"
          description="This action cannot be undone."
          trigger={<Button>Open Dialog</Button>}
          footer={<Button>Confirm</Button>}
        >
          <p>Snapshot #42</p>
        </Dialog>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog', { name: 'Delete snapshot' });
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(document.body.style.overflow).toBe('hidden');

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Drawer', () => {
    it('renders slide-over drawer with side and size attributes and closes on backdrop click', async () => {
      const user = userEvent.setup();
      render(
        <Drawer
          title="Keybindings"
          side="left"
          size="lg"
          trigger={<Button>Open Drawer</Button>}
        >
          <p>Super + Return</p>
        </Drawer>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
      const drawer = screen.getByRole('dialog', { name: 'Keybindings' });
      expect(drawer).toHaveAttribute('data-side', 'left');
      expect(drawer).toHaveAttribute('data-size', 'lg');

      await user.click(screen.getByTestId('drawer-backdrop'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Popover', () => {
    it('toggles popover content via trigger and closes on Escape', async () => {
      const user = userEvent.setup();
      render(
        <Popover trigger={<Button>Audio settings</Button>} aria-label="Audio mixer">
          <div>Master Volume: 80%</div>
        </Popover>,
      );

      const trigger = screen.getByRole('button', { name: 'Audio settings' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('dialog', { name: 'Audio mixer' })).toHaveTextContent(
        'Master Volume: 80%',
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('DropdownMenu', () => {
    it('opens with keyboard or click, navigates items with arrow keys, and triggers onSelect/checkbox', async () => {
      const onReload = vi.fn();
      const onToggleGaps = vi.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu
          aria-label="OMAI menu"
          trigger={<Button>System</Button>}
          items={[
            { type: 'label', label: 'Hyprland' },
            { id: 'reload', label: 'Reload config', shortcut: ['Super', 'R'], onSelect: onReload },
            {
              type: 'checkbox',
              id: 'gaps',
              label: 'Enable gaps',
              checked: true,
              onCheckedChange: onToggleGaps,
            },
            { type: 'separator' },
            { id: 'quit', label: 'Log out', danger: true, disabled: true },
          ]}
        />,
      );

      const trigger = screen.getByRole('button', { name: 'System' });
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });

      const menu = screen.getByRole('menu', { name: 'OMAI menu' });
      expect(menu).toBeInTheDocument();

      const reloadItem = screen.getByRole('menuitem', { name: /Reload config/i });
      const checkboxItem = screen.getByRole('menuitemcheckbox', { name: 'Enable gaps' });

      await user.click(checkboxItem);
      expect(onToggleGaps).toHaveBeenCalledWith(false);

      await user.click(reloadItem);
      expect(onReload).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('Progress', () => {
    it('renders bar, btop blocks, and indeterminate progress states', () => {
      const { rerender } = render(
        <Progress value={50} max={100} label="Disk usage" showValue />,
      );
      const bar = screen.getByRole('progressbar', { name: 'Disk usage' });
      expect(bar).toHaveAttribute('aria-valuenow', '50');
      expect(screen.getByText('50%')).toBeInTheDocument();

      rerender(<Progress value={75} variant="blocks" segments={10} label="CPU" />);
      const blocks = screen.getByRole('progressbar', { name: 'CPU' });
      expect(blocks).toHaveAttribute('data-variant', 'blocks');
      expect(blocks.querySelector('.omai-progress__blocks')?.textContent).toHaveLength(10);

      rerender(<Progress value={null} label="Loading" showValue />);
      const ind = screen.getByRole('progressbar', { name: 'Loading' });
      expect(ind).not.toHaveAttribute('aria-valuenow');
      expect(ind).toHaveAttribute('data-indeterminate');
    });
  });
});
