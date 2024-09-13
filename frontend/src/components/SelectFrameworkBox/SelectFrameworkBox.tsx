import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContextProvider';
import { FrameworkDetails } from '../../types/framework';
import { useSearchParams } from 'react-router-dom';
import useFormInputText from '../../hooks/useFormInputText';
import FrameworkService from '../../services/FrameworkService';
import { CircularProgress } from '@mui/material';
import clsx from 'clsx';

const SelectFrameworkBox = () => {
  const auth = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [frameworks, setFrameworks] = useState<FrameworkDetails[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<FrameworkDetails>();
  const [loading, setLoading] = useState<boolean>(false);
  const query = useFormInputText();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const frameworksResponse = await FrameworkService.searchFrameworks(auth.token, query.value, '0');
      setFrameworks(frameworksResponse);
    }
    fetchData();
    setLoading(false);
  }, []);

  const handleSubmitQuery = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const frameworksResponse = await FrameworkService.searchFrameworks(auth.token, query.value, '0');
    setFrameworks(frameworksResponse);
    setLoading(false);
  }

  const handleSelectFramework = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('framework', selectedFramework?.framework_id || '4');
    setSearchParams(newSearchParams);
  }

  return (
    <section className='max-w-4xl w-full'>
      <h2 className='font-title font-bold text-2xl mb-4'>Select A Framework To Continue</h2>
      {/* Search bar */}
      <form
        className='mb-4 flex items-center border-black border-[1px] rounded-lg'
        action=''
        onSubmit={handleSubmitQuery}
      >
        <label className='hidden' htmlFor='framework-search-bar'>Company Search Bar</label>
        <input
          className='w-full h-12 px-6 text-base bg-transparent outline-none'
          placeholder='Framework Name...'
          name='framework-search-bar'
          id='framework-search-bar'
          type='text'
          onChange={query.handleChange}
          value={query.value}
        />
        <button
          className='w-12 p-3 rounded-full hover:bg-zinc-300'
          type='submit'
          aria-label='Search Button'
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
        </button>
      </form>

      {/* Framework List */}
      {loading ? (
        <CircularProgress className='mx-auto' />
      ) : (
        <ul className='mb-4 bg-white max-h-56 overflow-y-scroll scrollbar'>
          {frameworks.map((f) => {
            return (
              <li className='block' key={f.framework_id}>
                <button
                  data-testid='framework-item'
                  className={clsx(
                    'text-left w-full px-4 py-2 hover:bg-slate-300',
                    {
                      'bg-slate-200': f.framework_id === selectedFramework?.framework_id
                    }
                  )}
                  type='button'
                  onClick={() => setSelectedFramework(f)}
                >
                  {f.name}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {/* Apply Button */}
      <button
        className='block ml-auto bg-ecom-modal-submit-btn border-[1px] border-black py-2 px-4 hover:brightness-110 disabled:brightness-50 disabled:cursor-not-allowed'
        type='button'
        disabled={!selectedFramework}
        onClick={handleSelectFramework}
      >
        Apply
      </button>
    </section>
  )
}

export default SelectFrameworkBox;