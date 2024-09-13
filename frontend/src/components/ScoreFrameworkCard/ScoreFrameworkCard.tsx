import { useState } from 'react';
import useModal from '../../hooks/useModal';
import SelectFrameworkModal from '../SelectFrameworkModal';
import clsx from 'clsx';
import FrameworkScoreItem from '../FrameworkScoreItem';
import { FrameworkScores } from '../../types/framework';
import { useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

interface StringIndexedObject {
  [key: string]: number;
}

const LINKS = ['Environmental', 'Social', 'Governance'];

const ScoreFrameworkCard = ({
  scoreDetails
}: {
  scoreDetails: FrameworkScores | undefined;
}) => {
  const [searchParams] = useSearchParams();
  const modal = useModal();
  const [tabIdx, setTabIdx] = useState<number>(0);

  return (
    <div className='bg-ecom-framework-score border-black border-[1px] shadow-ecom-card py-4 rounded-xl'>
      {/* Header */}
      <div className='flex items-center px-4 mb-4'>
        <h3 className='font-title font-bold text-xl'>{searchParams.get('framework') ? scoreDetails?.framework.name : <>Select Framework</>}</h3>
        <button
          type='button'
          aria-label='Change Score Framework'
          className='w-9 ml-auto p-2 rounded-full hover:bg-zinc-400'
          onClick={() => modal.handleToggleModal(true)}
          data-tooltip-id={`select-score-framework`}
          data-tooltip-place='top'
          data-tooltip-content='Change Framework'
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/></svg>
        </button>
        <Tooltip id='select-score-framework' />
      </div>

      {/* Tabs */}
      <ul className='flex items-center bg-[#1B160E] font-title text-white font-semibold'>
        {LINKS.map((name, idx) => {
          return (
            <li key={idx} className='flex-1 flex justify-center'>
              <button
                type='button'
                className={clsx(
                  'py-2 px-3 w-full',
                  {
                    'bg-[#8A7140]': idx === tabIdx,
                  }
                )}
                onClick={() => setTabIdx(idx)}
              >
                {name}
              </button>
            </li>
          )
        })}
      </ul>

      <div className='p-4'>
        {/* Category Weighting */}
        <div className='mb-3 flex justify-between items-center p-2 border-[1px] border-black font-title font-semibold'>
          <h4>Category Weighting</h4>
          {scoreDetails && <p>{(scoreDetails.framework.categoryWeightings as StringIndexedObject)[LINKS[tabIdx].toLowerCase()]}</p>}
        </div>

        {/* Metric Weightings */}
        <div className='grid grid-cols-[1fr,max-content,max-content,max-content]'>
          {/* Column Headers */}
          <div className='grid grid-cols-subgrid col-[span_4] font-title font-semibold'>
            <p className='pl-1'>Name</p>
            <p className='px-2 justify-self-center'>Value</p>
            <p className='px-2 justify-self-center'>Weight</p>
            <p>Unit</p>
          </div>

          <ul className='grid grid-cols-subgrid col-[span_4] scrollbar overflow-y-scroll max-h-[200px]'>
            {searchParams.get('framework') && scoreDetails?.framework.metricWeightings
              .filter((m) => m.category === LINKS[tabIdx].charAt(0))
              .map((m, idx) => {
                return (
                  <FrameworkScoreItem metricWeightings={m} key={idx} />
                )
              })
            }
          </ul>
        </div>
      </div>
      
      {/* Framework Select Modal */}
      {modal.open && <SelectFrameworkModal handleCloseModal={() => modal.handleToggleModal(false)} />}
    </div>
  );
};

export default ScoreFrameworkCard;
