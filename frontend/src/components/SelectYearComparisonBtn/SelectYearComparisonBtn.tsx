import React, { useState } from 'react';

interface Props {
  onYearSelect: (year: number) => void;
}

const SORT_OPTIONS = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

/**
 * Component that allows users to select a year from a dropdown menu.
 * It toggles the visibility of the dropdown and updates the selected year.
 *
 */
const SelectYearComparisonBtn: React.FC<Props> = ({ onYearSelect }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center">
        <button
          className="relative border-[1px] border-black flex items-center justify-between px-4 py-2 min-w-[85px] font-title font-medium bg-ecom-comparison-card-bg-200 hover:bg-ecom-comparison-card-bg-900"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="mr-2 font-semibold">Select Year: {selectedYear}</p>
          {/* Toggle icon based on the dropdown state */}
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512">
              <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512">
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          )}
          {/* Dropdown menu with year options */}
          {isOpen && (
            <ul className="absolute top-[calc(100%+1px)] right-0 left-0 border-2 border-gray-300 bg-slate-200 text-black z-20 shadow-lg font-body font-normal">
              {SORT_OPTIONS.map((opt, idx) => {
                const year = Number(opt);
                return (
                  <li key={idx}>
                    <div
                      className="flex justify-start w-full px-4 py-2 hover:bg-slate-300"
                      onClick={() => {
                        setSelectedYear(year);
                        onYearSelect(year);
                        setIsOpen(false);
                      }}
                    >
                      {year}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </button>
      </div>
    </div>
  );
};

export default SelectYearComparisonBtn;
