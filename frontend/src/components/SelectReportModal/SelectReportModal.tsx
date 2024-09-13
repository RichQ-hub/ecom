import { useState } from 'react';
import Modal from '../Modal';
import { CircularProgress } from '@mui/material';
import CompanyService from '../../services/CompanyService';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';

const SelectReportModal = ({
  reportType,
  handleCloseModal,
}: {
  reportType: 'pdf' | 'excel';
  handleCloseModal: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);
  const { companyId } = useParams();

  useState(() => {
    const fetchData = async () => {
      const allYears = await CompanyService.reportYears(companyId || '');
      setYears(allYears);
    }
    fetchData();
    setLoading(false);
  });

  const handleDownload = async () => {
    setDownloading(true);
    const a = document.createElement('a');
    let base64 = '';
    switch (reportType) {
      case 'pdf':
        const responsePDF = await CompanyService.downloadPDF(companyId || '', selectedYear);
        base64 = responsePDF.encoded_pdf;
        a.href = 'data:image/pdf;base64,' + base64;
        a.download = `Report_${selectedYear}.pdf`;
        a.click();
        break;
      case 'excel':
        const responseExcel = await CompanyService.downloadExcel(companyId || '', selectedYear);
        base64 = responseExcel.encoded_excel;
        a.href = 'data:image/pdf;base64,' + base64;
        a.download = `Report_${selectedYear}.xlsx`;
        a.click();
      break;
      default:
        break;
    }
    setDownloading(false);
    handleCloseModal();
  }

  return (
    <Modal
      title={`Select Year (${reportType.toUpperCase()})`}
      handleCloseModal={handleCloseModal}
    >
      {loading ? (
        <CircularProgress className='mx-auto' />
      ) : (
        <>
          <p className='mb-2'>View a company's ESG data for a specific metric year.</p>
          <ul className='mb-4 bg-white max-h-56 overflow-y-scroll scrollbar'>
            {years.map((year) => {
              return (
                <li className='block' key={year}>
                  <button
                    data-testid='framework-item'
                    className={clsx(
                      'text-left w-full px-4 py-2 hover:bg-slate-300',
                      {
                        'bg-slate-200': year === selectedYear
                      }
                    )}
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedYear(year);
                    }}
                  >
                    {year}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <button
        className='flex items-center justify-between ml-auto bg-ecom-modal-submit-btn border-[1px] border-black py-2 px-4 hover:brightness-110 disabled:brightness-50 disabled:cursor-not-allowed'
        type='button'
        disabled={!selectedYear}
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
      >
        Download
        {downloading && <CircularProgress className='w-6 ml-6' />}
      </button>
    </Modal>
  )
}

export default SelectReportModal