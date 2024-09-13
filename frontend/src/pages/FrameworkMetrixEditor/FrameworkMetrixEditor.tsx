import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HelpHeaderLayout from '../../layouts/HelpHeaderLayout/HelpHeaderLayout';
import SelectMetricModal from '../../components/SelectMetricModal';
import useModal from '../../hooks/useModal';
import { MetricDetails } from '../../types/metric';
import clsx from 'clsx';
import FrameworkService from '../../services/FrameworkService';
import { AuthContext } from '../../context/AuthContextProvider';

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

type CategoryKey = 'E' | 'S' | 'G';

const categoryMap: { [key in CategoryKey]: string } = {
  E: 'Environmental',
  S: 'Social',
  G: 'Governance'
};

interface StringIndexedObject {
  [key: string]: React.ReactNode;
}

const ESG_ICONS: StringIndexedObject = {
  environmental: <svg className='w-6 pb-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0h32c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64H64c123.7 0 224 100.3 224 224v32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320C100.3 320 0 219.7 0 96z"/></svg>,
  social: <svg className='w-6 pb-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z"/></svg>,
  governance: <svg className='w-6 pb-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M240.1 4.2c9.8-5.6 21.9-5.6 31.8 0l171.8 98.1L448 104l0 .9 47.9 27.4c12.6 7.2 18.8 22 15.1 36s-16.4 23.8-30.9 23.8H32c-14.5 0-27.2-9.8-30.9-23.8s2.5-28.8 15.1-36L64 104.9V104l4.4-1.6L240.1 4.2zM64 224h64V416h40V224h64V416h48V224h64V416h40V224h64V420.3c.6 .3 1.2 .7 1.8 1.1l48 32c11.7 7.8 17 22.4 12.9 35.9S494.1 512 480 512H32c-14.1 0-26.5-9.2-30.6-22.7s1.1-28.1 12.9-35.9l48-32c.6-.4 1.2-.7 1.8-1.1V224z"/></svg>,
}

const TRASH_ICON = (
  <svg className="w-5 pb-2 mt-1 ml-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
    <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
  </svg>
);

const FrameworkEditor: React.FC = () => {
  const { frameworkId } = useParams<{ frameworkId: string }>();
  const auth = useContext(AuthContext);
  const modal = useModal();
  const navigate = useNavigate();

  const [frameworkName, setFrameworkName] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([
    { name: 'Environmental', weighting: 0, metrics: [] },
    { name: 'Social', weighting: 0, metrics: [] },
    { name: 'Governance', weighting: 0, metrics: [] },
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('Environmental');

  const action = new URLSearchParams(location.search).get('action');

  useEffect(() => {
    if (frameworkId) {
      const fetchData = async () => {
        const viewFramework = await FrameworkService.updateView(auth.token, frameworkId);
        console.log(viewFramework);

        const transformedCategories = viewFramework.categories.map((cat: { category: CategoryKey; weight: number; }) => ({
          name: categoryMap[cat.category],
          weighting: cat.weight * 100,
          metrics: []
        }));

        viewFramework.metrics.forEach((metric: { metric_id: string; weight: number; pillar: CategoryKey; metric_name: string; }) => {
          const category = transformedCategories.find((cat: { name: CategoryKey; }) => cat.name === categoryMap[metric.pillar]);
          if (category) {
            category.metrics.push({
              id: metric.metric_id,
              name: metric.metric_name,
              weighting: metric.weight * 100
            });
          }
        });

          setCategories(transformedCategories);
          setFrameworkName(viewFramework.name);
      }
      fetchData();
    }
  }, [frameworkId]);

  const handleAddMetric = (selectedMetric: MetricDetails) => {
    const newMetric: Metric = {
      id: selectedMetric.metric_id,
      name: selectedMetric.name,
      weighting: 0,
    };
    setCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.name === activeCategory) {
          const metricExists = category.metrics.some(metric => metric.id === newMetric.id);
          if (metricExists) {
            return category;
          }
          return { ...category, metrics: [...category.metrics, newMetric] };
        }
        return category;
      })
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

  const handleSubmit = async () => {
    let transformedData = {
      name: frameworkName,
      framework_id: '',
      categories: categories.map(category => ({
        category: getCategoryAbbreviation(category.name),
        weight: category.weighting / 100,
      })),
      metrics: categories.flatMap(category =>
        category.metrics.map(metric => ({
          metric_id: metric.id,
          weight: metric.weighting / 100,
        }))
      ),
    };

    try {
      let result;
      if (action === 'edit' && frameworkId) {
        transformedData.framework_id = frameworkId;
        result = await FrameworkService.edit(auth.token, frameworkId, transformedData);
      } else {
        result = await FrameworkService.create(auth.token, transformedData);
      }
      navigate('/frameworks');
    } catch (error) {
      console.error('Creation error:', error);
    }
  };

  function getCategoryAbbreviation(categoryName: string): 'E' | 'S' | 'G' | string {
    switch (categoryName) {
      case 'Environmental':
        return 'E';
      case 'Social':
        return 'S';
      case 'Governance':
        return 'G';
      default:
        return categoryName;
    }
  }

  const handleCancel = () => {
    navigate('/frameworks');
  };

  const getTotalWeighting = () => {
    return categories.reduce((total, category) => total + category.weighting, 0);
  };

  const getTotalMetricWeighting = () => {
    const allMetrics = categories.flatMap(category => category.metrics);
    return allMetrics.reduce((total, metric) => total + metric.weighting, 0);
  };

  const validateForm = () => {
    const totalWeighting = getTotalMetricWeighting();
    const isFrameworkNameSet = frameworkName.trim() !== '';

    if (totalWeighting !== 100) return false;

    return isFrameworkNameSet;
  };

  const isFormValid = validateForm();
  
  return (
    <HelpHeaderLayout
        title="Frameworks Editor"
        info={`Frameworks are comprised of the three categories - Environmental, Social and Governance. Under each category, are a set of unique metrics which you can vary the weighting depending on which factors you find most important. This unique set of weightings will derive an overall ESG score for a specified company. Please follow these steps:
                "1. Enter Framework Name"
                Name Field: Enter a name for your new framework.
                "2. Set Category Weightings"
                Tabs: Navigate through the tabs for Environmental, Social and Governance categories.
                Category Weightings: Assign a percentage weight to each category. The total weight for all categories must total to 100%.
                "3. Configure Metrics"
                Select Metrics: For each category, choose relevant metrics.
                Set Metric Weightings: Assign a percentage weight to each metric. The total weight of all metrics must total to 100%.
                "4. Save Framework"
                Save: Click "Save" to finalise and save changes made.`}
      >
        <p className="text-lg text-gray-1000"></p>
        <div className="mb-10 flex justify-between items-center">
          <div className="mr-auto">
            <input 
              type="text" 
              value={frameworkName} 
              onChange={(e) => setFrameworkName(e.target.value)}
              className="p-2 hover:bg-gray-300 border rounded border-[1px] border-black"
              style={{ width: '600px' }}
              placeholder="Add New Framework Name"
            />
          </div>

          <div className="flex space-x-4">
            <button
              className={`px-5 py-2 font-title font-semibold border-[1px] border-black shadow-ecom-btn rounded-lg ${
                isFormValid
                  ? 'bg-ecom-green'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Save
            </button>
            <button 
              className="px-5 py-2 bg-red-500 font-title font-semibold border-[1px] border-black shadow-ecom-btn rounded-lg"
              onClick={handleCancel}>Return to frameworks
            </button>
          </div>
        </div>

        <ul className="flex items-center border-b-2 border-ecom-divider font-title font-semibold">
          <div className='mr-2'>{ESG_ICONS[activeCategory.toLowerCase()]}</div>
          <div className="mr-2"></div>
          {categories.map((category) => (
            <li key={category.name}>
              <div
                className={clsx(
                  `block relative px-6 pb-2 text-center text-lg after:absolute after:bottom-0 after:left-0
                  after:right-0 after:bg-ecom-med-blue after:h-[3px] after:scale-x-0 after:transition-transform
                  after:duration-300 hover:text-zinc-500 cursor-pointer`,
                  {
                    'after:scale-x-100 text-ecom-med-blue': activeCategory === category.name,
                  }
                )}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </div>
          </li>
          ))}
          <div className="ml-auto flex items-center space-x-4">
            <span className="font-title font-semibold text-lg">
              Total Category Weightings: {getTotalWeighting()}%
            </span>

            {getTotalWeighting() === 100 ? (
              <svg
                width="20px"
                height="20px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className={`ml-2 ${getTotalWeighting() === 100 ? 'fill-ecom-green' : 'fill-red-500'}`}
              >
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/>
              </svg>
            ) : (
              <svg
                width="20px"
                height="20px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className={`ml-2 ${getTotalWeighting() === 100 ? 'fill-ecom-green' : 'fill-red-500'}`}
              >
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
              </svg>
            )}

            <div className="h-8 border-r border-gray-300" />

            <span className="font-title font-semibold text-lg">
              Total Metric Weighting: {getTotalMetricWeighting()}%
            </span>
            
            {getTotalMetricWeighting() === 100 ? (
              <svg
                width="20px"
                height="20px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="ml-2 fill-ecom-green"
              >
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/>
              </svg>
            ) : (
              <svg
                width="20px"
                height="20px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="ml-2 fill-red-500"
              >
                <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
              </svg>
            )}
          </div>
        </ul>

        <div>
          <h2 className="text-2xl font-bold mt-4">Category Weighting</h2>
          <span className="text-sm italic mt-4 mb-4">Note: Category weightings range from 0 to 100.</span>
          
          {categories.map(category =>
            category.name === activeCategory && (
              <div key={category.name}>
                <div className="flex items-center justify-between bg-ecom-green mt-1 w-full border-[1px] border-black shadow-ecom-card p-2">
                  <span>{category.name} weight</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={category.weighting}
                      onChange={e => handleWeightingChange(category.name, Number(e.target.value))}
                      className="text-center w-20 mr-1 p-1 border-[1px] border-black"
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Chosen metrics</h2>
                  </div>

                  <span className="text-sm italic mt-4 mb-4">Note: Metric weightings range from 0 to 100.</span>

                  {category.metrics.map(metric => (
                    <div
                      aria-label={`metric-${metric.name}`}
                      key={metric.id}
                      className="flex items-center justify-between bg-ecom-bg-metric p-2 mb-4 border-[1px] border-black shadow-ecom-card mt-1"
                    >
                      <span>{metric.name}</span>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={metric.weighting}
                          onChange={e => handleMetricWeightingChange(metric.id, Number(e.target.value))}
                          className="text-center w-20 mr-2 p-1 border-[1px] border-black"
                          step="1"
                        />
                        <span>%</span>
                        <button onClick={() => handleDeleteMetric(metric.id)} className="hover:text-red-500">
                          {TRASH_ICON}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Metric Button */}
                  <button onClick={() => modal.handleToggleModal(true)} className="mt-1 block w-full border border-dashed border-black shadow-sm p-2 hover:bg-[#2a6d9c1d]">
                    Add Metric +
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {modal.open && (
          <SelectMetricModal
            handleCloseModal={() => modal.handleToggleModal(false)}
            onSelectMetric={handleAddMetric}
            activeCategory={activeCategory}
          />
        )}
      </HelpHeaderLayout>
  );
};

export default FrameworkEditor;