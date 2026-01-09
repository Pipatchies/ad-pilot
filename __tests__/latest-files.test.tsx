import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LatestFiles from '@/components/latest-files';

// Mock child components to focus on LatestFiles integration logic
vi.mock('@/components/card/details-card', () => ({
  default: ({ title }: { title: string }) => <div data-testid='details-card'>{title}</div>,
}));

vi.mock('@/components/cta-button', () => ({
  default: ({ props }: { props: { text: string } }) => <button>{props.text}</button>,
}));

test('LatestFiles integrates data correctly and renders list', () => {
  const mockData = [
    {
      title: 'Campaign 1',
      url: '/c1',
      fileData: { url: '', type: '', publicId: '', title: '' },
    },
    {
      title: 'Campaign 2',
      url: '/c2',
      fileData: { url: '', type: '', publicId: '', title: '' },
    },
  ];

  render(<LatestFiles title='Recent Campaigns' variant='campaign' data={mockData} />);

  // Assert Title Integration
  expect(screen.getByText('Recent Campaigns')).toBeDefined();

  // Assert List Integration (Data -> UI mapping)
  const items = screen.getAllByTestId('details-card');
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent('Campaign 1');
  expect(items[1]).toHaveTextContent('Campaign 2');
});

test('LatestFiles renders empty message when data is empty', () => {
  render(
    <LatestFiles title='Empty List' variant='default' data={[]} emptyMessage='No files found' />,
  );

  expect(screen.getByText('No files found')).toBeDefined();
});
