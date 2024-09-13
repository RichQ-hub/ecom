import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CompanyService from '../../services/CompanyService';
import { CircularProgress } from '@mui/material';

const CompanyFilter = ({
  handleToggleIndustry,
  handleToggleHQCountry,
}: {
  handleToggleIndustry: (industry: string, checked: boolean) => void;
  handleToggleHQCountry: (country: string, checked: boolean) => void;
}) => {
  const [searchParams] = useSearchParams();
  const [countries, setCountries] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const allCountries = await CompanyService.companiesCountries();
      const allIndustries = await CompanyService.companiesIndustries();
      setCountries(allCountries);
      setIndustries(allIndustries);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <form className='w-full'>
      {loading ? (
        <CircularProgress className='!block mx-auto mt-4' />
      ) : (
        <>
          {/* Countries */}
          <h3 className='font-semibold mt-2 ml-2 mb-1'>Headquarter Country</h3>
          <ul className='overflow-y-scroll max-h-64 scrollbar'>
            {countries.map((country, idx) => {
              return (
                <li key={idx}>
                  <label
                    data-testid='country'
                    htmlFor={`checkbox-${country}`}
                    className='flex items-center cursor-pointer hover:bg-slate-300 px-2'
                  >
                    <div className='relative w-4 h-4 mr-2'>
                      <input
                        type='checkbox'
                        className='peer appearance-none shrink-0 w-4 h-4 border-black border-[1px] checked:bg-zinc-300'
                        id={`checkbox-${country}`}
                        onChange={(e) => handleToggleHQCountry(country, e.target.checked)}
                        checked={searchParams.getAll('country').includes(country)}
                      />
                      <svg
                        className='absolute top-0 w-4 h-4 hidden peer-checked:block'
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    {country}
                  </label>
                </li>
              )
            })}
          </ul>

          {/* Industries */}
          <h3 className='font-semibold mt-3 ml-2 mb-1'>Industries</h3>
          <ul className='overflow-y-scroll max-h-64 scrollbar'>
            {industries.map((ind, idx) => {
              return (
                <li key={idx}>
                  <label
                    data-testid='industry'
                    htmlFor={`checkbox-${ind}`}
                    className='flex items-center cursor-pointer hover:bg-slate-300 px-2'
                  >
                    <div className='relative w-4 h-4 mr-2'>
                      <input
                        type='checkbox'
                        className='peer appearance-none shrink-0 w-4 h-4 border-black border-[1px] checked:bg-zinc-300'
                        id={`checkbox-${ind}`}
                        onChange={(e) => handleToggleIndustry(ind, e.target.checked)}
                        checked={searchParams.getAll('industry').includes(ind)}
                      />
                      <svg
                        className='absolute top-0 w-4 h-4 hidden peer-checked:block'
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    {ind}
                  </label>
                </li>
              )
            })}
          </ul>
        </>
      )}

    </form>
  )
}

export default CompanyFilter;