import { CompanyDetails } from '../../types/company';
import { Link } from 'react-router-dom';

const CompanyCard = ({
  details,
}: {
  details: CompanyDetails;
}) => {
  return (
    <li className='contents'>
      <Link
        to={`${details.perm_id}/environmental`}
        className={`
          relative h-min grid grid-cols-subgrid col-[span_3] bg-[#8fbed859] items-center text-white font-semibold
          after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[6px] after:bg-ecom-dark-blue
          after:hover:bg-ecom-light-blue hover:bg-[#83cbf35e] hover:outline hover:outline-1 hover:outline-[#83ccf3e1]
          hover:z-10
        `}
      >
        <h3 className='py-3 pl-6 pr-3 font-title text-black text-lg'>{details.name}</h3>

        {/* HQ Country */}
        <div className='bg-ecom-dark-blue h-full px-4 flex items-center justify-center'>
          <p>{details.headquarter_country || 'N/A'}</p>
        </div>

        {/* Metric Count */}
        <div className='h-full px-4 flex items-center justify-center bg-[#2A838F]'>
          <p>{details.nb_points_of_observations}</p>
        </div>
      </Link>
    </li>
  )
}

export default CompanyCard;