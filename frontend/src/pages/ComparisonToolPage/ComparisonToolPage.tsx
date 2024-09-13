import { useEffect, useState } from 'react';
import HelpHeaderLayout from '../../layouts/HelpHeaderLayout/HelpHeaderLayout';
import SelectMetricsBtn from '../../components/SelectMetricsComparisonBtn/SelectMetricsComparisonBtn';
import SelectYearComparisonBtn from '../../components/SelectYearComparisonBtn/SelectYearComparisonBtn';
import CompanyComparisonCard from '../../components/CompanyComparisonCard/CompanyComparisonCard';
import SelectedMetricsComparisonCard from '../../components/SelectedMetricsComparisonCard/SelectedMetricsComparisonCard';
import AddCompanyComparisonCard from '../../components/AddCompanyComparisonCard/AddCompanyComparisonCard';
import { IndividualCompany, IndividualMetric, CompanyRequest, ComparisonMetricsResponse } from '../../types/comparison';
import ComparisonService from '../../services/ComparisonService';
import VisualisationComparison from '../../components/VisualisationComparison/VisualisationComparison';
import DownloadComparisonReportBtn from '../../components/DownloadComparisonReportBtn/DownloadComparisonReportBtn';

/**
 * Main page component for the comparison tool.
 * Allows users to add companies, select metrics, choose a year, visualize data trends, and download a report.
 *
 */
const ComparisonToolPage = () => {
  const [selectedCompanies, setSelectedCompanies] = useState<IndividualCompany[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<IndividualMetric[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [comparisonDetails, setComparisonDetails] = useState<ComparisonMetricsResponse[]>([]);
  const [companyRequest, setCompanyRequest] = useState<CompanyRequest>();

  /**
   * Adds a company to the selected companies list.
   *
   * @param company - The company to add.
   */
  const addCompany = (company: IndividualCompany) => {
    setSelectedCompanies([...selectedCompanies, company]);
  };

  /**
   * Updates the list of selected metrics.
   *
   * @param metrics - Array of metrics to be selected.
   */
  const addMetrics = (metrics: IndividualMetric[]) => {
    setSelectedMetrics([...metrics]);
  };

  /**
   * Updates the selected year for comparison.
   *
   * @param year - The year to be selected.
   */
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };

  /**
   * Removes a company from the selected companies list and corresponding comparison details.
   *
   * @param companyId - The ID of the company to remove.
   */
  const handleDelete = (companyId: string) => {
    setSelectedCompanies(selectedCompanies.filter((company) => company.perm_id !== companyId));
    setComparisonDetails(comparisonDetails.filter((company) => company.perm_id !== companyId));
  };

  // Effect to fetch comparison details whenever selected companies, metrics, or year changes
  useEffect(() => {
    const fetchData = async () => {
      const companyIds = selectedCompanies.map((company) => company.perm_id);
      const metricIds = selectedMetrics.map((metric) => metric.metric_id);

      const companyRequest: CompanyRequest = {
        companies: companyIds,
        metrics: metricIds,
        year: selectedYear,
      };

      setCompanyRequest(companyRequest);
      const details = await ComparisonService.compareCompanies(companyRequest);
      setComparisonDetails(details);
    };
    fetchData();
  }, [selectedCompanies, selectedMetrics, selectedYear]);

  return (
    <HelpHeaderLayout
      title="Comparison Tool"
      info={`Welcome to EcoM's ESG Data Comparison Tool. Follow these steps to compare companies across various ESG metrics:\n
      "1. Add Companies:" Click the Add Company (+) button to open a modal where you can search and add a company to your comparison table.\n
      "2. Select Metrics:" Use the Select Metrics button to choose the specific metrics that you want to compare. Metrics are categorized under Environmental (E), Social (S), and Governance (G).\n
      "3. Choose Year:" Click the Select Year button to select the year for which you want to view the data.\n
      "4. Visualize Data:" Scoll down and click on a metric name from the list to see the selected metric data for all the companies for the chosen year displayed as a graph.\n
      "5. Download Report:" You can also download this comparison as a PDF or Excel report after selecting some companies and metrics by clicking the Download Report button.`}
    >
      {/* Controls for selecting metrics, year, and downloading reports */}
      <div className="flex justify-center gap-5 mb-6">
        <div>
          <SelectMetricsBtn onMetricsSelect={addMetrics}></SelectMetricsBtn>
        </div>
        <div>
          <SelectYearComparisonBtn onYearSelect={handleYearSelect}></SelectYearComparisonBtn>
        </div>
        <div>
          {companyRequest &&
            companyRequest.companies.length > 0 &&
            companyRequest.metrics.length > 0 &&
            companyRequest.year !== undefined && <DownloadComparisonReportBtn compareDetails={companyRequest} />}
        </div>
      </div>

      <div className="flex overflow-auto">
        <SelectedMetricsComparisonCard selectedMetrics={selectedMetrics}></SelectedMetricsComparisonCard>
        {comparisonDetails.map((company) => (
          <CompanyComparisonCard key={company.perm_id} company={company} onDelete={handleDelete} />
        ))}
        <AddCompanyComparisonCard onCompanyAdd={addCompany} selectedCompanies={selectedCompanies} />
      </div>

      <div className="ml-4 mt-10">
        <h2 className="font-title font-bold text-4xl">Metric Trends</h2>
        <hr className="border-t-2 border-gray-400 mb-6" />
        <div className="ml-4">
          <VisualisationComparison
            metrics={selectedMetrics}
            companies={comparisonDetails}
            year={selectedYear}
          ></VisualisationComparison>
        </div>
      </div>
    </HelpHeaderLayout>
  );
};

export default ComparisonToolPage;
