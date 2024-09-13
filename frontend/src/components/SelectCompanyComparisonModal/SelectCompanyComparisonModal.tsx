import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import useFormInputText from '../../hooks/useFormInputText';
import { IndividualCompany } from '../../types/comparison';
import ComparisonService from '../../services/ComparisonService';
import { CircularProgress } from '@mui/material';
import clsx from 'clsx';

interface Props {
  handleCloseModal: () => void;
  onCompanySelect: (company: IndividualCompany) => void;
  selectedCompanies: IndividualCompany[];
}

const INIT_COMPANIES: IndividualCompany[] = [
  {
    perm_id: '0',
    name: 'loading...',
  },
];

/**
 * SelectCompanyComparisonModal Component
 *
 * This component displays a modal allowing the user to search for and select a company to compare. It fetches company data based on the search query,
 * displays a list of companies, and handles selection of a company. It also displays error messages if the selected company is already chosen.
 *
 */
const SelectCompanyComparisonModal: React.FC<Props> = ({ handleCloseModal, onCompanySelect, selectedCompanies }) => {
  const [companies, setCompanies] = useState<IndividualCompany[]>(INIT_COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState<IndividualCompany>();
  const [loading, setLoading] = useState<boolean>(false);
  const query = useFormInputText();
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch companies based on the search query when it changes
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const companiesResponse = await ComparisonService.searchCompanies(query.value);
      setCompanies(companiesResponse);
    };
    fetchData();
    setLoading(false);
  }, [query.value]);

  const handleSubmitQuery = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const companiesResponse = await ComparisonService.searchCompanies(query.value);
    setCompanies(companiesResponse);
    setLoading(false);
  };

  /**
   * Handles the selection of a company.
   *
   * If the selected company is already in the list of selected companies, an error message is shown. Otherwise, the company is selected and
   * the modal is closed.
   */
  const handleSelectCompany = () => {
    if (selectedCompanies.some((company) => company.perm_id === selectedCompany?.perm_id)) {
      setErrorMessage('Company has already been selected');
    } else {
      onCompanySelect(selectedCompany!);
      handleCloseModal();
    }
  };

  return (
    <Modal title="Select Company" handleCloseModal={handleCloseModal}>
      {/* Search bar */}
      <form
        className="mb-4 flex items-center border-black border-[1px] rounded-lg"
        action=""
        onSubmit={handleSubmitQuery}
      >
        <label className="hidden" htmlFor="company-search-bar">
          Company Search Bar
        </label>
        <input
          className="w-full h-12 px-6 text-base bg-transparent outline-none"
          placeholder="Company Name..."
          type="text"
          onChange={query.handleChange}
          value={query.value}
        />
        <button className="w-12 p-3 rounded-full hover:bg-zinc-300" type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </button>
      </form>

      {/* Company List */}
      {loading ? (
        <CircularProgress className="mx-auto" />
      ) : companies.length <= 0 ? (
        <p className="text-center">No Companies Found</p>
      ) : (
        <ul className="mb-4 bg-white max-h-96 overflow-y-scroll scrollbar">
          {companies.map((c) => {
            return (
              <li className="block" key={c.perm_id}>
                <button
                  className={clsx('text-left divide-y divide-ecom-light-blue w-full px-4 py-2 hover:bg-slate-300', {
                    'bg-slate-200': c.perm_id === selectedCompany?.perm_id,
                  })}
                  type="button"
                  onClick={() => setSelectedCompany(c)}
                >
                  {c.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Error Message */}
      {errorMessage && <p className="text-red-600 text-center mb-4">{errorMessage}</p>}

      {/* Apply Button */}
      <button
        className="block ml-auto bg-ecom-modal-submit-btn border-[1px] border-black py-2 px-4 hover:brightness-110 disabled:brightness-50 disabled:cursor-not-allowed"
        type="button"
        disabled={!selectedCompany}
        onClick={handleSelectCompany}
      >
        Apply
      </button>
    </Modal>
  );
};

export default SelectCompanyComparisonModal;
