import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SORT_OPTIONS = [
  'Alphabetical',
  'Metric Count (High - Low)',
  'Metric Count (Low - High)'
]

const SortCompanyBtn = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <button
      className='relative border-[1px] border-black flex items-center justify-between px-4 py-2 min-w-[220px] font-title font-medium hover:bg-slate-200'
      type='button'
      onClick={() => setIsOpen(!isOpen)}
    >
      <p>{SORT_OPTIONS[Number(searchParams.get('sortBy')) ?? 0]}</p>
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512"><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
      )}

      {isOpen &&
        <ul className='absolute top-[calc(100%+1px)] right-0 left-0 bg-[#242526] text-white z-20'>
          {SORT_OPTIONS.map((opt, idx) => {
            return (
              <li key={idx}>
                <div
                  className='flex justify-start w-full px-4 py-2 hover:bg-[#525357]'
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', '1');
                    params.set('sortBy', idx.toString());
                    setSearchParams(params);
                  }}
                >
                  {opt}
                </div>
              </li>
            )
          })}
        </ul>
      }
    </button>
  )
}

export default SortCompanyBtn;