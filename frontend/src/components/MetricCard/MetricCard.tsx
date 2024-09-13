import { useState } from 'react';
import clsx from 'clsx';
import { MetricDetails } from '../../types/metric';
import { Element } from 'react-scroll';
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { ChartType } from 'chart.js/auto';

const COLORS = {
  E: '#2e8b21',
  S: '#0062ff',
  G: '#ec4040',
};

const CHART_TYPES: {
  type: ChartType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    type: 'line',
    label: 'Line Chart',
    icon: (
      <svg className="w-4 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z" />
      </svg>
    ),
  },
  {
    type: 'bar',
    label: 'Bar Chart',
    icon: (
      <svg className="w-4 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
      </svg>
    ),
  },
];

const MetricCard = ({ details }: { details: MetricDetails }) => {
  const [tabIdx, setTabIdx] = useState<number>(details.measurements.length - 1);
  const [graphOpen, setGraphOpen] = useState<boolean>(false);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [chartData] = useState({
    labels: details.measurements.map((m) => m.metric_year),
    datasets: [
      {
        label: details.name,
        data: details.measurements.map((m) => m.value),
        backgroundColor: COLORS[details.pillar],
        borderColor: COLORS[details.pillar],
      },
    ],
  });

  return (
    <div className="contents font-title">
      {/* Metric Year Selection Tabs */}
      <Element name={`metric-${details.metric_id}`}>
        <ul className="flex items-end font-bold mt-4">
          {details.measurements.map((measurement, idx) => {
            return (
              <li key={idx}>
                <button
                  data-testid='metric-tab'
                  type="button"
                  className={clsx(`border-[1px] border-black px-3 hover:bg-zinc-300`, {
                    'bg-ecom-bg-metric pb-[6px]': idx === tabIdx,
                  })}
                  onClick={() => setTabIdx(idx)}
                >
                  {measurement.metric_year}
                </button>
              </li>
            );
          })}
        </ul>
      </Element>

      {/* Main Content */}
      <div className="grid grid-cols-subgrid col-[span_5] bg-ecom-bg-metric border-[1px] border-black">
        {/* Name and Description */}
        <div className="p-4">
          <div className="flex items-center mb-1">
            <h2 className="font-bold text-lg pr-2 mr-2 border-r-2 border-black">{details.name}</h2>
            <p className="text-sm font-body">
              <span className="font-semibold underline">Provider</span>:{' '}
              <span className="italic">{details.data_provider}</span>
            </p>
          </div>
          <p className="font-body">{details.description}</p>
        </div>

        {/* Value */}
        <div data-testid='metric-value' className="w-full px-6 flex items-center justify-center font-bold bg-ecom-dark-blue text-white text-lg">
          {details.measurements[tabIdx].value}
        </div>

        {/* Unit */}
        <div className="flex items-center justify-center font-bold text-center px-4 max-w-32">{details.unit}</div>

        {/* Disclosure */}
        <div className="px-8 w-full flex items-center justify-center font-bold text-white bg-[#386316] text-lg">
          {details.measurements[tabIdx].disclosure}
        </div>

        {/* Reported Date */}
        <div data-testid='metric-report-date' className="px-2 w-full flex items-center justify-center font-bold text-white bg-[#632929] text-lg">
          {details.measurements[tabIdx].reported_date ? (
            details.measurements[tabIdx].reported_date.split(' ')[0]
          ) : (
            <>N/A</>
          )}
        </div>
      </div>

      {/* Graphical view */}
      {graphOpen && (
        <div className="p-4 col-[span_5] origin-top border-[1px] border-black border-t-0 w-full">
          <h3 className="mb-4 font-semibold border-b-[1px] border-[#70707080]">TRENDS</h3>
          <div className="flex w-full">
            <div className="w-8/12 mr-8">
              <Chart
                data-testid='metric-chart'
                height={300}
                width={500}
                type={chartType}
                data={chartData}
                options={{
                  responsive: true,
                  scales: {
                    x: {
                      display: true,
                      ticks: {
                        color: '#000',
                      },
                      title: {
                        display: true,
                        text: 'Metric Year',
                        color: '#000',
                        font: {
                          family: 'Roboto',
                          size: 12,
                          weight: 'normal',
                          lineHeight: 1.2,
                        },
                      },
                    },
                    y: {
                      display: true,
                      ticks: {
                        color: '#000',
                      },
                      title: {
                        display: true,
                        text: details.unit,
                        color: '#000',
                        font: {
                          family: 'Roboto',
                          size: 12,
                          weight: 'normal',
                          lineHeight: 1.2,
                        },
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Chart Options */}
            <div className="flex-grow">
              <h3 className="underline font-semibold mb-4">Select Chart Type</h3>
              <ul>
                {CHART_TYPES.map((opt, idx) => {
                  return (
                    <li key={idx}>
                      <button
                        type="button"
                        className={clsx(
                          'flex items-center py-2 px-4 border-black border-[1px] rounded-lg mb-4 w-full hover:bg-zinc-200 font-medium',
                          {
                            'bg-slate-300': opt.type === chartType,
                          }
                        )}
                        onClick={() => setChartType(opt.type)}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
      <button
        data-testid='metric-graph-btn'
        type="button"
        className="flex items-centre col-[span_5] mb-4 px-4 py-1 border-black border-[1px] border-t-0 rounded-b-lg hover:bg-[#2a6d9c1d] font-medium"
        onClick={() => setGraphOpen(!graphOpen)}
      >
        <svg className="mr-5 w-4 self-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm96 288H448c17.7 0 32-14.3 32-32V251.8c0-7.6-2.7-15-7.7-20.8l-65.8-76.8c-12.1-14.2-33.7-15-46.9-1.8l-21 21c-10 10-26.4 9.2-35.4-1.6l-39.2-47c-12.6-15.1-35.7-15.4-48.7-.6L135.9 215c-5.1 5.8-7.9 13.3-7.9 21.1v84c0 17.7 14.3 32 32 32z" />
        </svg>
        {graphOpen ? (
          <>
            Collapse
            <svg className="ml-auto w-4 self-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z" />
            </svg>
          </>
        ) : (
          <>
            Expand To See Graphical View
            <svg className="ml-auto w-4 self-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default MetricCard;
