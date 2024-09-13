import EsgDataTabs from '../../components/EsgDataTabs';
import TitleHeaderLayout from '../../layouts/TitleHeaderLayout/TitleHeaderLayout';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { CompanyDetails } from '../../types/company';
import CompanyService from '../../services/CompanyService';
import { AuthContext } from '../../context/AuthContextProvider';
import clsx from 'clsx';
import DownloadMetricReportBtn from '../../components/DownloadMetricReportBtn';

const EsgDataPage = () => {
  const { companyId } = useParams();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({} as CompanyDetails);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const details = await CompanyService.companyDetails(companyId || '');
      setCompanyDetails(details);
    };
    fetchData();
  }, []);

  return (
    <TitleHeaderLayout title={`ESG Data`}>
      <div className="flex items-center">
        <h1 className="font-title font-bold text-4xl mb-2">{companyDetails.name}</h1>

        {/* Download reports */}
        <DownloadMetricReportBtn />

        {/* View ESG Scores Button */}
        <Link
          to="esg-scores"
          className={clsx(
            'flex px-5 py-2 bg-ecom-green font-title items-center font-semibold border-[1px] border-black shadow-ecom-btn rounded-lg',
            {
              'cursor-not-allowed opacity-50 pointer-events-none': !auth.token,
            }
          )}
        >
          {auth.token ? <>View ESG Scores</> : <>Login to View ESG Scores</>}
          <svg className="ml-4 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
          </svg>
        </Link>
      </div>

      {/* Industry and HQ Country */}
      <div className="flex items-center gap-4 mb-6">
        <p className="flex items-center pr-2 border-r-2 border-black">
          <span className="block font-semibold underline">HQ Country</span>: {companyDetails.headquarter_country}
        </p>
        <p className="flex items-center">
          <span className="block font-semibold underline">Industry</span>: {companyDetails.industry}
        </p>
      </div>

      <EsgDataTabs />
      <Outlet />
    </TitleHeaderLayout>
  );
};

export default EsgDataPage;
