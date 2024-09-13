import clsx from 'clsx';
import { Tooltip } from 'react-tooltip';

const NAME_MAP = {
  E: 'Environmental',
  S: 'Social',
  G: 'Governance',
}

const CategoryScoreBar = ({
  category,
  score,
  industryMean,
}: {
  category: 'E' | 'S' | 'G';
  score: number;
  industryMean: number;
}) => {

  return (
    <div className='mb-2'>
      <h4 className='font-title font-semibold mb-1 text-lg'>{NAME_MAP[category]}</h4>

      {/* Bar */}
      <div className='mb-1 relative w-full bg-white h-10 flex items-center'>
        <div className='absolute left-0 h-full bg-[#B7B7B7] z-10' style={{ width: `${industryMean}%` }}></div>
        <div
          data-tooltip-id='esg-score-bar'
          data-tooltip-place='right'
          data-tooltip-content={score.toString()}
          className={clsx(
            'h-4 z-20',
            {
              'bg-[#4D8323]': category === 'E',
              'bg-[#2E6D90]': category === 'S',
              'bg-[#A44B2F]': category === 'G',
            }
          )}
          style={{ width: `${score}%` }}
        ></div>
        <Tooltip id='esg-score-bar' />
      </div>

      <div className='flex items-center'>
        <p className='text-[#4E4E4E] text-sm pr-2 border-r-2 border-[#4E4E4E] mr-2'>Category Score <span className='font-semibold text-black'>{score}</span></p>
        <p className='text-[#4E4E4E] text-sm'>Industry Mean <span className='font-semibold text-black'>{industryMean}</span></p>
      </div>
    </div>
  )
}

export default CategoryScoreBar;