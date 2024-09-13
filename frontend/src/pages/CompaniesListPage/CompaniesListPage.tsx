import { useSearchParams } from 'react-router-dom';
import CompanySearchBar from '../../components/CompanySearchBar';
import { useEffect, useState } from 'react';
import SortCompanyBtn from '../../components/SortCompanyBtn';
import CompanyList from '../../components/CompanyList';
import CompanyFilter from '../../components/CompanyFilter';
import { CompanyDetails } from '../../types/company';
import CompanyService from '../../services/CompanyService';
import { CircularProgress, Pagination } from '@mui/material';

const CompaniesListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState<CompanyDetails[]>([]);
  const [companyCount, setCompanyCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const query = searchParams.get('query') || '';
  const page = searchParams.get('page') || '1';
  const sort = searchParams.get('sortBy') || '1';
  const country = searchParams.getAll('country');
  const industry = searchParams.getAll('industry');

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const allCompanies = await CompanyService.searchCompanies(query, page, sort, country, industry);
      const companyCount = await CompanyService.countCompanies(query, country, industry);
      setCompanies(allCompanies);
      setCompanyCount(companyCount);
      setLoading(false);
    }
    fetchData();
  }, [searchParams]);

  const handleChangePage = (e: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', `${value}`);
    setSearchParams(params);
  };

  const handleSearch = (currQuery: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (currQuery) {
      params.set('query', currQuery);
    } else {
      params.delete('query');
    }

    setSearchParams(params);
  }

  const handleToggleIndustry = (industry: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);

    params.set('page', '1');

    if (checked) {
      params.append('industry', industry);
    } else {
      const industries = params.getAll('industry').filter((ind) => ind !== industry);
      params.delete('industry');
      industries.forEach((ind) => {
        params.append('industry', ind);
      });
    }
    
    setSearchParams(params);
  }

  const handleToggleHQCountry = (country: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);

    params.set('page', '1');

    if (checked) {
      params.append('country', country);
    } else {
      const countries = params.getAll('country').filter((c) => c !== country);
      params.delete('country');
      countries.forEach((c) => {
        params.append('country', c);
      });
    }

    setSearchParams(params);
  }

  return (
    <>
      {/* Header */}
      <section className='bg-ecom-header-blue h-56 flex flex-col items-center justify-center px-14 shadow-ecom-header'>
        <h1 className='mb-2 font-title text-ecom-light-blue font-bold text-4xl'>Search Companies</h1>
        <p className='text-white mb-6'>View a company's latest ESG data</p>
        <CompanySearchBar
          handleSearch={handleSearch}
        />
      </section>

      <main className='py-10 max-w-[1300px] mx-auto grid grid-rows-[min-content,1fr] grid-cols-[minmax(250px,300px),1fr]'>
        {/* Filter Sidebar */}
        <aside className='relative mr-6 col-start-1 col-end-2 row-start-2 row-end-3'>
          <div className='sticky top-20 px-6 py-4 bg-ecom-card-bg-light border-[1px] border-black shadow-ecom-card'>
            <h2 className='font-bold font-title text-xl mb-2'>Company Filter</h2>
            <CompanyFilter
              handleToggleHQCountry={handleToggleHQCountry}
              handleToggleIndustry={handleToggleIndustry}
            />
          </div>
        </aside>

        {/* Sort Options */}
        <div className='col-start-2 col-end-3 row-start-1 row-end-2'>
          <h2 className='font-title font-bold text-2xl mb-2'>{companyCount} Results</h2>

          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center'>
              <p className='mr-2 font-semibold'>Sort By:</p>
              <SortCompanyBtn />
            </div>
            <Pagination count={Math.ceil(companyCount / 50)} page={Number(page)} onChange={handleChangePage} />
          </div>
        </div>

        {/* Company List */}
        <section className='col-start-2 col-end-3 row-start-2 row-end-3 grid grid-cols-[1fr,max-content,max-content] h-min'>
          {loading ? (
            <CircularProgress className='mx-auto' data-test-id='' />
          ) : (
            <CompanyList companies={companies} />
          )}
        </section>
      </main>
    </>
  )
}

export default CompaniesListPage;