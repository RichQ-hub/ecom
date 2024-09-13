import { Tooltip } from 'react-tooltip';


const FrameworkScoreItem = ({
  metricWeightings,
}: {
  metricWeightings: {
    name: string;
    category: "E" | "S" | "G";
    weight: number;
    unit: string;
    value: number;
    scaled_value: number;
  }
}) => {
  return (
    <li className='grid grid-cols-subgrid col-[span_4] border-[#00000040] border-t-[1px] font-medium text-white text-sm'>
      <p
        className='py-2 pl-1 text-black text-ellipsis text-nowrap overflow-hidden'
        data-tooltip-id={`score-metric-${metricWeightings.name}`}
        data-tooltip-place='top'
        data-tooltip-content={metricWeightings.name}
      >
        {metricWeightings.name}
      </p>
      <p className='bg-[#644B26] flex justify-center items-center px-1'>{metricWeightings.value}</p>
      <p className='bg-[#7B2626] flex justify-center items-center'>{metricWeightings.weight}</p>
      <div
        className='flex justify-center items-center px-1'
        data-tooltip-id={`score-metric-unit-${metricWeightings.name}`}
        data-tooltip-place='right'
        data-tooltip-content={metricWeightings.unit}
      >
        <svg className='w-4 fill-[#1B160E]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
      </div>
      <Tooltip className='z-50' id={`score-metric-unit-${metricWeightings.name}`} />
      <Tooltip id={`score-metric-${metricWeightings.name}`} />
    </li>
  )
}

export default FrameworkScoreItem;