import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';
import { KeyValueList } from './KeyValueList';
import { StatCard } from './StatCard';
import { Table, type TableColumn } from './Table';

interface Row {
  id: string;
  name: string;
  latency: number;
}

const columns: TableColumn<Row>[] = [
  { key: 'name', header: 'Name', accessor: 'name', sortable: true },
  { key: 'latency', header: 'Latency', accessor: 'latency', sortable: true, align: 'right' },
];

const rows: Row[] = [
  { id: '1', name: 'Waybar', latency: 12 },
  { id: '2', name: 'Alacritty', latency: 4 },
  { id: '3', name: 'Hyprland', latency: 8 },
];

describe('Table', () => {
  it('renders rows and sorts client-side when uncontrolled', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    render(
      <Table
        ref={ref}
        className="custom-table"
        columns={columns}
        data={rows}
        getRowKey={(r) => r.id}
        striped
        density="compact"
      />,
    );

    expect(ref.current).toHaveClass('omai-table', 'custom-table');
    expect(ref.current).toHaveAttribute('data-density', 'compact');
    expect(ref.current).toHaveAttribute('data-striped');

    const sortBtn = screen.getByRole('button', { name: 'Latency' });
    await user.click(sortBtn);
    expect(sortBtn.closest('th')).toHaveAttribute('aria-sort', 'ascending');

    const bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows[0]).toHaveTextContent('Alacritty');
    expect(bodyRows[2]).toHaveTextContent('Waybar');

    await user.click(sortBtn);
    expect(sortBtn.closest('th')).toHaveAttribute('aria-sort', 'descending');
    const descRows = screen.getAllByRole('row').slice(1);
    expect(descRows[0]).toHaveTextContent('Waybar');
  });

  it('supports row selection and emptyState', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    const { rerender } = render(
      <Table
        columns={columns}
        data={rows}
        getRowKey={(r) => r.id}
        selectedKeys={['2']}
        onRowClick={onRowClick}
      />,
    );

    const selectedRow = screen.getByText('Alacritty').closest('tr')!;
    expect(selectedRow).toHaveAttribute('data-state', 'selected');
    await user.click(selectedRow);
    expect(onRowClick).toHaveBeenCalledWith(rows[1], 1);

    rerender(<Table columns={columns} data={[]} emptyState="Nothing running" />);
    expect(screen.getByText('Nothing running')).toBeInTheDocument();
  });
});

describe('CodeBlock', () => {
  it('renders code with line numbers, highlighted lines, and copy button', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(
      <CodeBlock
        title="hyprland.conf"
        language="ini"
        showLineNumbers
        highlightLines={[2]}
        code={'gaps_in = 5\ngaps_out = 10'}
      />,
    );

    expect(screen.getByText('hyprland.conf')).toBeInTheDocument();
    expect(screen.getByText('ini')).toBeInTheDocument();
    const highlighted = screen.getByText('gaps_out = 10').closest('.omai-code-block__line');
    expect(highlighted).toHaveAttribute('data-highlighted');

    await user.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(writeText).toHaveBeenCalledWith('gaps_in = 5\ngaps_out = 10');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});

describe('StatCard', () => {
  it('renders value, delta, sparkline, and meter progressbar', () => {
    render(
      <StatCard
        label="CPU"
        value={42}
        unit="%"
        delta={{ value: '+4%', direction: 'up' }}
        meter={42}
        sparkline={[10, 20, 40, 80]}
      />,
    );

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('+4%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42');
  });
});

describe('KeyValueList', () => {
  it('renders definition list and copies values', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(
      <KeyValueList
        items={[
          { key: 'kernel', label: 'Kernel', value: '6.12.1-arch1', mono: true, copyable: true },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Copy Kernel' }));
    expect(writeText).toHaveBeenCalledWith('6.12.1-arch1');
  });
});
