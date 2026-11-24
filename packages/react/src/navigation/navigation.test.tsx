import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from './Breadcrumb';
import { Pagination } from './Pagination';
import { SidebarNav } from './SidebarNav';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  const items = [
    { value: 'one', label: 'One', content: <div>Panel One</div> },
    { value: 'two', label: 'Two', disabled: true, content: <div>Panel Two</div> },
    { value: 'three', label: 'Three', content: <div>Panel Three</div> },
  ];

  it('renders tablist, tabs, and active tabpanel with ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Tabs ref={ref} className="custom-tabs" items={items} aria-label="Demo tabs" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('omai-tabs', 'custom-tabs');
    expect(screen.getByRole('tablist', { name: 'Demo tabs' })).toBeInTheDocument();

    const tabOne = screen.getByRole('tab', { name: 'One' });
    const tabTwo = screen.getByRole('tab', { name: 'Two' });
    expect(tabOne).toHaveAttribute('aria-selected', 'true');
    expect(tabOne).toHaveAttribute('tabindex', '0');
    expect(tabTwo).toBeDisabled();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel One');
  });

  it('supports roving keyboard navigation skipping disabled tabs', async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);

    const tabOne = screen.getByRole('tab', { name: 'One' });
    const tabThree = screen.getByRole('tab', { name: 'Three' });
    tabOne.focus();

    await user.keyboard('{ArrowRight}');
    expect(tabThree).toHaveFocus();
    expect(tabThree).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel Three');

    await user.keyboard('{Home}');
    expect(tabOne).toHaveFocus();
    expect(tabOne).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{End}');
    expect(tabThree).toHaveFocus();
  });

  it('supports manual activation mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs items={items} activation="manual" onValueChange={onValueChange} />);

    const tabOne = screen.getByRole('tab', { name: 'One' });
    const tabThree = screen.getByRole('tab', { name: 'Three' });
    tabOne.focus();

    await user.keyboard('{ArrowRight}');
    expect(tabThree).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();

    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('three');
    expect(tabThree).toHaveAttribute('aria-selected', 'true');
  });
});

describe('Breadcrumb', () => {
  it('marks last item aria-current="page" and collapses middle items when maxItems is set', async () => {
    const user = userEvent.setup();
    render(
      <Breadcrumb
        maxItems={3}
        items={[
          { label: 'Home', href: '/' },
          { label: 'Docs', href: '/docs' },
          { label: 'Themes', href: '/docs/themes' },
          { label: 'Tokyo Night' },
        ]}
      />,
    );

    expect(screen.getByText('Tokyo Night')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('Docs')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show full breadcrumb path' }));
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });
});

describe('SidebarNav', () => {
  it('marks active item with aria-current="page" and expands nested groups', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      <SidebarNav
        activeId="tokens"
        onNavigate={onNavigate}
        sections={[
          {
            id: 'main',
            title: 'System',
            items: [
              { id: 'overview', label: 'Overview', href: '#overview' },
              {
                id: 'design',
                label: 'Design',
                items: [{ id: 'tokens', label: 'Tokens', href: '#tokens' }],
              },
            ],
          },
        ]}
      />,
    );

    const activeLink = screen.getByRole('link', { name: 'Tokens' });
    expect(activeLink).toHaveAttribute('aria-current', 'page');

    const groupBtn = screen.getByRole('button', { name: 'Design' });
    expect(groupBtn).toHaveAttribute('aria-expanded', 'true');
    await user.click(groupBtn);
    expect(groupBtn).toHaveAttribute('aria-expanded', 'false');
    expect(onNavigate).toHaveBeenCalled();
  });
});

describe('Pagination', () => {
  it('navigates pages and emits onPageChange', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination pageCount={5} defaultPage={2} onPageChange={onPageChange} />);

    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  });
});
