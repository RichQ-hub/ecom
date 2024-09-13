import MetricCard from '../../components/MetricCard';
import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MetricDetails } from '../../types/metric';

const details: MetricDetails = {
  metric_id: '1',
  name: 'Metric 1',
  description: 'Blah Blah',
  pillar: 'G',
  data_provider: 'KeplarAI',
  unit: 'Centimeters',
  measurements: [
    {
      measure_id: 'id 1',
      value: '34',
      metric_year: '2007',
      reported_date: '2007',
      disclosure: 'A',
    },
    {
      measure_id: 'id 2',
      value: '35',
      metric_year: '2020',
      reported_date: '2020',
      disclosure: 'A',
    },
    {
      measure_id: 'id 3',
      value: '36',
      metric_year: '2022',
      reported_date: '2022',
      disclosure: 'R',
    },
  ]
}

describe('MetricCard', () => {
  it('renders the correct heading and description', () => {
    render(<MetricCard details={details} />);
    expect(screen.queryByRole('heading', { name: /Metric 1/i })).toBeInTheDocument();
    expect(screen.queryByText(/Blah Blah/i)).toBeInTheDocument();
  });

  it('initially renders the details of the most recent year for a measurement', () => {
    render(<MetricCard details={details} />);
    expect(screen.getByTestId('metric-value').textContent).toBe('36');
    expect(screen.getByTestId('metric-report-date').textContent).toBe('2022');
  });

  it('renders all the metric years as tabs in order', () => {
    render(<MetricCard details={details} />);
    const tabList = screen.queryAllByTestId('metric-tab');
    expect(tabList[0].textContent).toBe('2007');
    expect(tabList[1].textContent).toBe('2020');
    expect(tabList[2].textContent).toBe('2022');
  });

  it('renders correct measurement details when switching tabs', () => {
    render(<MetricCard details={details} />);
    const tabList = screen.getAllByTestId('metric-tab');
    fireEvent.click(tabList[0]);
    expect(screen.getByTestId('metric-value').textContent).toBe('34');
    expect(screen.getByTestId('metric-report-date').textContent).toBe('2007');
  });

  it('does not render graphical view on initial load', () => {
    render(<MetricCard details={details} />);
    expect(screen.queryByTestId('metric-chart')).not.toBeInTheDocument();
    expect(screen.queryByTestId('metric-graph-btn')?.textContent).toBe('Expand To See Graphical View');
  });

  it('renders the graphical view when the user clicks on the button', () => {
    render(<MetricCard details={details} />);
    const graphBtn = screen.getByTestId('metric-graph-btn');
    fireEvent.click(graphBtn);
    expect(screen.getByTestId('metric-chart')).toBeInTheDocument();
    expect(screen.getByTestId('metric-graph-btn').textContent).toBe('Collapse');
  });
})

