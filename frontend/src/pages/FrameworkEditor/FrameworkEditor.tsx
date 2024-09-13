import React, { useState } from 'react';
import TitleHeaderLayout from '../../layouts/TitleHeaderLayout/TitleHeaderLayout';
// editing
interface Metric {
  id: string;
  name: string;
  weighting: number;
}

interface Category {
  name: string;
  weighting: number;
  metrics: Metric[];
}

const FrameworkEditor: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      name: 'Environmental',
      weighting: 80,
      metrics: [
        { id: '1', name: 'Metric 1', weighting: 80 },
        { id: '2', name: 'Metric 2', weighting: 80 },
        { id: '3', name: 'Metric 3', weighting: 80 },
        { id: '4', name: 'Metric 4', weighting: 80 },
      ],
    },
    { name: 'Social', weighting: 0, metrics: [] },
    { name: 'Governance', weighting: 0, metrics: [] },
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('Environmental');

  const handleAddMetric = () => {
    const newMetric: Metric = { id: Date.now().toString(), name: 'New Metric', weighting: 0 };
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.name === activeCategory
          ? { ...category, metrics: [...category.metrics, newMetric] }
          : category
      )
    );
  };

  const handleDeleteMetric = (metricId: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.name === activeCategory
          ? { ...category, metrics: category.metrics.filter(metric => metric.id !== metricId) }
          : category
      )
    );
  };

  const handleWeightingChange = (categoryName: string, value: number) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.name === categoryName ? { ...category, weighting: value } : category
      )
    );
  };

  const handleMetricWeightingChange = (metricId: string, value: number) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.name === activeCategory
          ? {
              ...category,
              metrics: category.metrics.map(metric =>
                metric.id === metricId ? { ...metric, weighting: value } : metric
              ),
            }
          : category
      )
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <TitleHeaderLayout title="Framework Editor">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Add New Framework</h1>
          <div>
            <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </TitleHeaderLayout>

      <div className="container mx-auto px-4">
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Framework Metrics</h2>

          <div className="flex mb-4">
            {categories.map(category => (
              <button
                key={category.name}
                className={`mr-2 px-4 py-2 rounded ${
                  activeCategory === category.name ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {categories.map(
            category =>
              category.name === activeCategory && (
                <div key={category.name}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Category Weighting</label>
                    <input
                      type="number"
                      value={category.weighting}
                      onChange={e => handleWeightingChange(category.name, Number(e.target.value))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  {category.metrics.map(metric => (
                    <div key={metric.id} className="flex items-center justify-between bg-gray-100 p-2 mb-2 rounded">
                      <span>{metric.name}</span>
                      <div>
                        <input
                          type="number"
                          value={metric.weighting}
                          onChange={e => handleMetricWeightingChange(metric.id, Number(e.target.value))}
                          className="w-20 mr-2 p-1 border rounded"
                        />
                        <button onClick={() => handleDeleteMetric(metric.id)} className="text-red-500">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  <button onClick={handleAddMetric} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Add Metric +
                  </button>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default FrameworkEditor;
