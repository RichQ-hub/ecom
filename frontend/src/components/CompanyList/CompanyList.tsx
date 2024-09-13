import { CompanyDetails } from '../../types/company';
import CompanyCard from '../CompanyCard';

const CompanyList = ({
  companies,
}: {
  companies: CompanyDetails[];
}) => {
  return (
    <>
      {/* List Header */}
      <div className='grid grid-cols-subgrid col-[span_3] font-title font-medium text-lg mb-2'>
        <h3>Name</h3>
        <h3 className='px-3'>HQ Country</h3>
        <h3 className='px-3'>Metric Count</h3>
      </div>
      
      {/* Company List */}
      <ul className='contents'>
        {companies.map((comp, idx) => {
          return (
            <CompanyCard key={idx} details={comp} />
          )
        })}
      </ul>
    </>
  )
}

export default CompanyList;