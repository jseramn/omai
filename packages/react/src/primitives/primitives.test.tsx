import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OmaiProvider } from '../theme';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  IconButton,
  Kbd,
  Separator,
  Skeleton,
  Tooltip,
} from './index';

describe('Primitives', () => {
  describe('Button', () => {
    it('renders with default props, forwards ref, and merges className', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Button ref={ref} className="custom-btn">
          Launch
        </Button>,
      );
      const btn = screen.getByRole('button', { name: 'Launch' });
      expect(btn).toBe(ref.current);
      expect(btn).toHaveClass('omai-button', 'custom-btn');
      expect(btn).toHaveAttribute('type', 'button');
      expect(btn).toHaveAttribute('data-variant', 'primary');
      expect(btn).toHaveAttribute('data-size', 'md');
    });

    it('supports loading, disabled, fullWidth, and icons', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Button
          variant="secondary"
          size="lg"
          loading
          fullWidth
          leadingIcon={<span data-testid="lead">+</span>}
          trailingIcon={<span data-testid="trail">→</span>}
          onClick={onClick}
        >
          Saving
        </Button>,
      );
      const btn = screen.getByRole('button', { name: 'Saving' });
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute('aria-busy', 'true');
      expect(btn).toHaveAttribute('data-loading');
      expect(btn).toHaveAttribute('data-full-width');
      expect(screen.getByTestId('lead')).toBeInTheDocument();
      expect(screen.getByTestId('trail')).toBeInTheDocument();
      await user.click(btn);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('IconButton', () => {
    it('renders square icon button with required aria-label and default ghost variant', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <IconButton
          ref={ref}
          aria-label="Close panel"
          icon={<span data-testid="x-icon">×</span>}
          size="sm"
        />,
      );
      const btn = screen.getByRole('button', { name: 'Close panel' });
      expect(btn).toBe(ref.current);
      expect(btn).toHaveClass('omai-icon-button');
      expect(btn).toHaveAttribute('data-variant', 'ghost');
      expect(btn).toHaveAttribute('data-size', 'sm');
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });
  });

  describe('Badge', () => {
    it('renders tone, variant, size, and dot indicator', () => {
      const ref = createRef<HTMLSpanElement>();
      render(
        <Badge ref={ref} tone="brand" variant="outline" size="sm" dot className="extra">
          Active
        </Badge>,
      );
      const badge = screen.getByText('Active');
      expect(badge).toBe(ref.current);
      expect(badge).toHaveClass('omai-badge', 'extra');
      expect(badge).toHaveAttribute('data-tone', 'brand');
      expect(badge).toHaveAttribute('data-variant', 'outline');
      expect(badge).toHaveAttribute('data-size', 'sm');
      expect(badge.querySelector('.omai-badge__dot')).toBeInTheDocument();
    });
  });

  describe('Kbd', () => {
    it('renders key combo joined by + or plain children', () => {
      const ref = createRef<HTMLElement>();
      const { rerender } = render(<Kbd ref={ref} keys={['Super', 'Space']} size="sm" />);
      expect(ref.current).toHaveClass('omai-kbd');
      expect(ref.current).toHaveAttribute('data-combo');
      const keys = ref.current!.querySelectorAll('.omai-kbd__key');
      expect(keys).toHaveLength(2);
      expect(keys[0]).toHaveTextContent('Super');
      expect(keys[1]).toHaveTextContent('Space');

      rerender(<Kbd ref={ref}>Esc</Kbd>);
      expect(ref.current).not.toHaveAttribute('data-combo');
      expect(ref.current).toHaveTextContent('Esc');
    });
  });

  describe('Card', () => {
    it('renders Card and all compound parts with refs and classes', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Card ref={ref} variant="outline" padding="lg" interactive data-testid="card">
          <CardHeader>
            <CardTitle>Hyprland</CardTitle>
            <CardDescription>Tiling configuration</CardDescription>
          </CardHeader>
          <CardContent>gaps_in = 5</CardContent>
          <CardFooter>Saved</CardFooter>
        </Card>,
      );
      const card = screen.getByTestId('card');
      expect(card).toBe(ref.current);
      expect(card).toHaveAttribute('data-variant', 'outline');
      expect(card).toHaveAttribute('data-padding', 'lg');
      expect(card).toHaveAttribute('data-interactive');
      expect(screen.getByRole('heading', { name: 'Hyprland' })).toHaveClass('omai-card__title');
      expect(screen.getByText('Tiling configuration')).toHaveClass('omai-card__description');
      expect(screen.getByText('gaps_in = 5')).toHaveClass('omai-card__content');
      expect(screen.getByText('Saved')).toHaveClass('omai-card__footer');
    });
  });

  describe('Separator', () => {
    it('supports decorative and semantic separator with optional label', () => {
      const { rerender } = render(<Separator data-testid="sep" />);
      const sep = screen.getByTestId('sep');
      expect(sep).toHaveAttribute('role', 'none');
      expect(sep).toHaveAttribute('data-orientation', 'horizontal');

      rerender(<Separator data-testid="sep" decorative={false} orientation="vertical" label="OR" />);
      expect(sep).toHaveAttribute('role', 'separator');
      expect(sep).toHaveAttribute('aria-orientation', 'vertical');
      expect(sep).toHaveAttribute('data-labeled');
      expect(screen.getByText('OR')).toHaveClass('omai-separator__label');
    });
  });

  describe('Avatar', () => {
    it('renders image, falls back to initials on error or missing src, and shows status', () => {
      const { rerender } = render(
        <Avatar src="https://example.com/a.png" name="Jseramn Omai" status="online" size="lg" shape="circle" />,
      );
      const img = screen.getByRole('img');
      expect(img).toHaveClass('omai-avatar__image');
      fireEvent.error(img);
      expect(screen.getByText('JO')).toHaveClass('omai-avatar__fallback');
      expect(screen.getByLabelText('online')).toHaveAttribute('data-status', 'online');

      rerender(<Avatar name="omai" />);
      expect(screen.getByText('OM')).toBeInTheDocument();
    });
  });

  describe('Skeleton', () => {
    it('renders block, pixel, and multi-line text skeletons with aria-hidden', () => {
      const { container } = render(<Skeleton variant="text" lines={3} width={200} />);
      const root = container.querySelector('.omai-skeleton')!;
      expect(root).toHaveAttribute('aria-hidden', 'true');
      expect(root).toHaveAttribute('data-variant', 'text');
      expect(root).toHaveStyle({ width: '200px' });
      expect(root.querySelectorAll('.omai-skeleton__line')).toHaveLength(3);
    });
  });

  describe('Tooltip', () => {
    it('opens on focus/hover, links aria-describedby, renders shortcut, and closes on Escape', () => {
      render(
        <OmaiProvider target="scope" storageKey={null} defaultTheme="nord">
          <Tooltip content="Open Walker" shortcut={['Super', 'Space']} delay={0}>
            <Button>Launcher</Button>
          </Tooltip>
        </OmaiProvider>,
      );

      const trigger = screen.getByRole('button', { name: 'Launcher' });
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      fireEvent.focus(trigger);
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent('Open Walker');
      expect(tooltip).toHaveAttribute('data-omai-theme', 'nord');
      expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
      expect(tooltip.querySelectorAll('.omai-kbd__key')).toHaveLength(2);

      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});
