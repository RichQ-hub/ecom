import { useState } from 'react';
import ComparisonService from '../../services/ComparisonService';
import { CompanyRequest } from '../../types/comparison';

interface DownloadComparisonReportBtnProps {
  compareDetails: CompanyRequest; // Details of the company to be included in the report
}

const DownloadComparisonReportBtn: React.FC<DownloadComparisonReportBtnProps> = ({ compareDetails }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**
   * Handles the download of the report in the selected format.
   * @param selectedType - The format to download the report in ('pdf' or 'excel')
   */
  const handleDownload = async (selectedType: 'pdf' | 'excel') => {
    const a = document.createElement('a');
    let base64 = '';
    switch (selectedType) {
      case 'pdf': {
        const responsePDF = await ComparisonService.downloadComparisonPDF(compareDetails);
        base64 = responsePDF.encoded_pdf;
        a.href = 'data:image/pdf;base64,' + base64;
        a.download = `Comparison_Report.pdf`;
        a.click();
        break;
      }
      case 'excel': {
        const responseExcel = await ComparisonService.downloadComparisonExcel(compareDetails);
        base64 = responseExcel.encoded_excel;
        a.href = 'data:image/pdf;base64,' + base64;
        a.download = `Comparison_Report.xlsx`;
        a.click();
        break;
      }
      default:
        break;
    }
  };

  return (
    <button
      className="relative ml-auto mr-4 font-title font-semibold py-2 px-3 bg-[#47B4CC] flex items-center justify-between w-48"
      type="button"
      onClick={() => setIsOpen(!isOpen)}
    >
      Download Report
      <svg className="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 128-168 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l168 0 0 112c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM384 336l0-48 110.1 0-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39L384 336zm0-208l-128 0L256 0 384 128z" />
      </svg>
      {isOpen && (
        <ul className="absolute top-[calc(100%+1px)] right-0 left-0 border-2 border-gray-300 bg-slate-200 text-black z-20 shadow-lg font-body font-normal">
          <li>
            <button
              className="flex w-full px-4 py-2 hover:bg-slate-300 items-center justify-between"
              onClick={() => {
                handleDownload('pdf');
              }}
            >
              PDF
              <svg className="fill-black w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M64 464l48 0 0 48-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 304l-48 0 0-144-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" />
              </svg>
            </button>
          </li>
          <li>
            <button
              className="flex w-full px-4 py-2 hover:bg-slate-300 items-center justify-between"
              onClick={() => {
                handleDownload('excel');
              }}
            >
              Excel
              <svg className="fill-black w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z" />
              </svg>
            </button>
          </li>
        </ul>
      )}
    </button>
  );
};

export default DownloadComparisonReportBtn;
