import React, { useState, useEffect } from 'react';

interface Metric {
  id: string;
  name: string;
  weighting: number;
}

interface AddMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (metric: Metric) => void;
  categoryMetrics: Metric[];
}

const AddMetricModal: React.FC<AddMetricModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [metricName, setMetricName] = useState('');
  const [metricWeighting, setMetricWeighting] = useState(0);
  const [searchResults, setSearchResults] = useState<Metric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  useEffect(() => {
    if (metricName) {
      const fetchMetrics = async () => {
        // Replace with actual database search logic api
        // sample case:
        const results = await new Promise<Metric[]>(resolve => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'Metric 1', weighting: 10 },
              { id: '2', name: 'Metric 2', weighting: 20 },
              { id: '3', name: 'Metric 3', weighting: 30 },
            ].filter(metric => metric.name.toLowerCase().includes(metricName.toLowerCase())));
          }, 500);
        });
        setSearchResults(results);
      };
      fetchMetrics();
    } else {
      setSearchResults([]);
    }
  }, [metricName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMetric) {
      onAdd(selectedMetric);
      setMetricName('');
      setMetricWeighting(0);
      setSelectedMetric(null);
      onClose();
    }
  };

  const handleSelectMetric = (metric: Metric) => {
    setSelectedMetric(metric);
    setMetricName(metric.name);
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Metric</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metricName">
              Metric Name
            </label>
            <input
              type="text"
              id="metricName"
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {searchResults.length > 0 && (
              <ul className="border rounded w-full mt-2 bg-white shadow-lg">
                {searchResults.map(metric => (
                  <li
                    key={metric.id}
                    onClick={() => handleSelectMetric(metric)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {metric.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metricWeighting">
              Weighting
            </label>
            <input
              type="number"
              id="metricWeighting"
              value={metricWeighting}
              onChange={(e) => setMetricWeighting(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-sky-950 hover:bg-ecom-teal text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Metric
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-sky-950 hover:bg-ecom-teal text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMetricModal;
