import React from 'react';
import { IndividualMetric } from '../../types/comparison';

interface Props {
  selectedMetrics: IndividualMetric[];
}

/**
 * SelectedMetricsComparisonCard Component
 *
 * This component displays a card with a list of selected metrics categorized by their pillars (Environmental, Social, Governance).
 * If no metrics are selected, it shows a message prompting the user to select metrics.
 *
 */
const SelectedMetricsComparisonCard: React.FC<Props> = ({ selectedMetrics }) => {
  /**
   * Renders metrics for a given pillar.
   *
   * @param {string} pillar - The pillar to filter metrics by.
   * @returns {JSX.Element[]} - The list of metrics for the specified pillar.
   */
  const renderMetrics = (pillar: string) => {
    return selectedMetrics
      .filter((metric) => metric.pillar === pillar)
      .map((metric) => (
        <div key={metric.metric_id}>
          <h4 className="text-black text-md font-medium bold font-title text-center my-1 mx-3 overflow-hidden whitespace-nowrap">
            {metric.metric_name} ({metric.unit})
          </h4>
          <div className="bg-ecom-comparison-metric-divide h-0.5 flex items-center justify-center"></div>
        </div>
      ));
  };

  return (
    <div className="relative bg-ecom-comparison-card-bg min-h-[72vh] border-2 border-black min-w-[350px] rounded-tl-3xl rounded-bl-3xl">
      {/* Conditional rendering based on whether metrics are selected */}
      {selectedMetrics.length === 0 ? (
        <>
          <h2 className="text-black text-xl font-bold mt-5 mb-8 text-center font-title">No Metrics Selected.</h2>
          <h2 className="text-black text-lg font-medium mb-0 text-center font-title italic">
            Click the <span className="font-bold"> 'Select Metrics' </span> button above
          </h2>
          <h2 className="text-black text-lg font-medium mt-0 text-center font-title italic">to add metrics</h2>
        </>
      ) : (
        <>
          <h2 className="text-black text-xl font-bold my-4 text-center">Selected Metrics</h2>
          <div className="bg-ecom-comparison-metric-divide h-0.5 flex items-center justify-center"></div>

          {/* Environmental Metrics */}
          <div className="bg-ecom-comparison-pillar h-10 flex items-center justify-center">
            <h4 className="text-white text-lg font-medium bold font-title text-center">Environmental</h4>
          </div>
          <div className="bg-ecom-comparison-metric-divide h-0.5 flex items-center justify-center"></div>
          {renderMetrics('E')}

          {/* Social Metrics */}
          <div className="bg-ecom-comparison-pillar h-10 flex items-center justify-center">
            <h4 className="text-white text-lg font-medium bold font-title text-center">Social</h4>
          </div>
          <div className="bg-ecom-comparison-metric-divide h-0.5 flex items-center justify-center"></div>
          {renderMetrics('S')}

          {/* Governance Metrics */}
          <div className="bg-ecom-comparison-pillar h-10 flex items-center justify-center">
            <h4 className="text-white text-lg font-medium bold font-title text-center">Governance</h4>
          </div>
          <div className="bg-ecom-comparison-metric-divide h-0.5 flex items-center justify-center"></div>
          {renderMetrics('G')}
        </>
      )}
    </div>
  );
};

export default SelectedMetricsComparisonCard;
