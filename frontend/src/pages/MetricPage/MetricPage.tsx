import MetricCard from '../../components/MetricCard';
import { Link } from 'react-scroll';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MetricDetails } from '../../types/metric';
import MetricService from '../../services/MetricService';

const METRIC_NAMES = {
  E: 'Environmental',
  S: 'Social',
  G: 'Governance',
}

const MetricPage = ({
  category,
}: {
  category: 'E' | 'S' | 'G';
}) => {
  const { companyId } = useParams();
  const [metrics, setMetrics] = useState<MetricDetails[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const allMetrics = await MetricService.obtainMetrics(companyId || '', category.toLowerCase());
      setMetrics(allMetrics);
    }
    fetchData();
  }, []);

  return (
    <div className='ml-4 my-4 grid grid-cols-[minmax(100px,280px),1fr]'>
      {/* Sidebar */}
      <aside className='mr-10'>
        <div className='font-title sticky top-20'>
          <h3 className='text-lg font-bold mb-3'>Contents</h3>
          <ul className='font-medium max-h-96 overflow-y-scroll scrollbar overflow-x-hidden'>
            {metrics
              .map((metric, idx) => {
                return (
                  <li
                    key={idx}
                  >
                    <Link
                      to={`metric-${metric.metric_id}`}
                      spy={true}
                      smooth={true}
                      duration={500}
                      className={`
                        block relative cursor-pointer pl-3 py-1 after:absolute after:left-0 after:bottom-0 after:top-0
                        after:bg-[#CCCCCC] after:w-[2px] hover:text-ecom-med-blue hover:after:bg-ecom-med-blue
                      `}
                    >
                      {metric.name}
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </aside>

      {/* Metrics */}
      <div>
        <ul className='grid grid-cols-[1fr,max-content,max-content,max-content,max-content]'>
          {/* Metric Header */}
          <div className='grid grid-cols-subgrid col-[span_5] font-title font-bold text-lg'>
            <h2 className='font-title font-bold text-2xl mb-2'>{METRIC_NAMES[category]} ({metrics.length} Results)</h2>
            <h3 className='justify-self-center self-end'>Value</h3>
            <h3 className='justify-self-center self-end'>Unit</h3>
            <h3 className='justify-self-center self-end px-2'>Disclosure</h3>
            <h3 className='justify-self-center self-end px-2'>Date Reported</h3>
          </div>

          {/* Metrics List */}
          {metrics
            .map((metric, idx) => {
              return (
                <li
                  key={idx}
                  className='contents'
                >
                  <MetricCard details={metric} />
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default MetricPage;