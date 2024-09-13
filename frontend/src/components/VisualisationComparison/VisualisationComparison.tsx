import { useState } from 'react';
import { Link } from 'react-scroll';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { IndividualMetric, ComparisonMetricsResponse } from '../../types/comparison';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const COLORS = {
  E: '#2e8b21',
  S: '#0062ff',
  G: '#ec4040',
};

interface VisualisationComparisonProps {
  metrics: IndividualMetric[];
  companies: ComparisonMetricsResponse[];
  year: number;
}

/**
 * Component that visualizes metric comparisons across different companies using a bar chart.
 * Allows users to select a metric and view its comparison across companies for the specified year.
 *
 */
const VisualisationComparison: React.FC<VisualisationComparisonProps> = ({ metrics, companies, year }) => {
  const [selectedMetric, setSelectedMetric] = useState<IndividualMetric | null>(null);

  /**
   * Handles the selection of a metric by the user.
   *
   * @param metric - The selected metric.
   */
  const handleMetricSelect = (metric: IndividualMetric) => {
    setSelectedMetric(metric);
  };

  /**
   * Filters metrics by their pillar type.
   *
   * @param pillar - The pillar type to filter by ('E', 'S', 'G').
   * @returns Array of metrics that belong to the specified pillar.
   */
  const getMetricsByPillar = (pillar: string) => {
    return metrics.filter((metric) => metric.pillar === pillar);
  };

  /**
   * Prepares the data for the bar chart based on the selected metric.
   *
   * @returns Object containing chart data and configuration for Chart.js.
   */
  const prepareChartData = () => {
    if (!selectedMetric) return { labels: [], datasets: [] };

    const labels: string[] = [];
    const data: number[] = [];

    companies.forEach((company) => {
      const metric = company.metrics.find((m) => m.metric_id === selectedMetric.metric_id.toString());

      if (metric && metric.value !== null && metric.value !== undefined) {
        labels.push(company.name);
        data.push(metric.value);
      }
    });

    // Check if no data was collected
    if (labels.length === 0 || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    return {
      labels,
      datasets: [
        {
          label: selectedMetric.metric_name,
          data,
          borderColor: COLORS[selectedMetric.pillar],
          backgroundColor: `${COLORS[selectedMetric.pillar]}80`,
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = prepareChartData();

  return (
    <div className="flex">
      {metrics.length === 0 ? (
        <h3 className="text-lg font-bold mb-3 underline">No Metric Trends to Display.</h3>
      ) : (
        <aside className="mr-10">
          <div className="font-title sticky">
            <h3 className="text-lg font-bold mb-3 underline">Choose a Metric</h3>
            <ul className="font-medium max-h-96 overflow-y-scroll scrollbar overflow-x-hidden">
              {/* Environmental Metrics */}
              <li className="mb-4">
                <h4 className="text-md font-bold">Environmental (E)</h4>
                <ul>
                  {getMetricsByPillar('E').map((metric) => (
                    <li key={metric.metric_id}>
                      <Link
                        to={`metric-${metric.metric_id}`}
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => handleMetricSelect(metric)}
                        className="block relative cursor-pointer pl-3 py-1 after:absolute after:left-0 after:bottom-0 after:top-0 after:bg-[#CCCCCC] after:w-[2px] hover:text-ecom-med-blue hover:after:bg-ecom-med-blue"
                      >
                        {metric.metric_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Social Metrics */}
              <li className="mb-4">
                <h4 className="text-md font-bold">Social (S)</h4>
                <ul>
                  {getMetricsByPillar('S').map((metric) => (
                    <li key={metric.metric_id}>
                      <Link
                        to={`metric-${metric.metric_id}`}
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => handleMetricSelect(metric)}
                        className="block relative cursor-pointer pl-3 py-1 after:absolute after:left-0 after:bottom-0 after:top-0 after:bg-[#CCCCCC] after:w-[2px] hover:text-ecom-med-blue hover:after:bg-ecom-med-blue"
                      >
                        {metric.metric_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Governance Metrics */}
              <li className="mb-4">
                <h4 className="text-md font-bold">Governance (G)</h4>
                <ul>
                  {getMetricsByPillar('G').map((metric) => (
                    <li key={metric.metric_id}>
                      <Link
                        to={`metric-${metric.metric_id}`}
                        spy={true}
                        smooth={true}
                        duration={500}
                        onClick={() => handleMetricSelect(metric)}
                        className="block relative cursor-pointer pl-3 py-1 after:absolute after:left-0 after:bottom-0 after:top-0 after:bg-[#CCCCCC] after:w-[2px] hover:text-ecom-med-blue hover:after:bg-ecom-med-blue"
                      >
                        {metric.metric_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </aside>
      )}

      <div className="flex-grow">
        {/* Display message if no data is available */}
        {selectedMetric ? (
          metrics.some((metric) => metric.metric_id === selectedMetric.metric_id) ? (
            chartData.labels.length === 0 ? (
              <h3 className="text-lg font-semibold mb-3 ml-20 italic">
                No companies' data can be found for the metric: {selectedMetric.metric_name}
              </h3>
            ) : (
              <div>
                <div className="flex w-full">
                  <div className="w-11/12">
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: `Year: ${year}`,
                            padding: {
                              top: 10,
                              bottom: 20,
                            },
                            font: {
                              size: 20,
                              weight: 'bolder',
                            },
                            color: '#000',
                          },
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                return `${context.dataset.label}: ${context.raw}`;
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Companies',
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: selectedMetric.unit,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          ) : // If the previously graphed metric has now been removed from metric list, then display nothing
          null
        ) : // If a metric has not been selected yet, display nothing
        null}
      </div>
    </div>
  );
};

export default VisualisationComparison;
