import useModal from '../../hooks/useModal';
import SelectCompanyComparisonModal from '../SelectCompanyComparisonModal';
import { IndividualCompany } from '../../types/comparison';

interface Props {
  onCompanyAdd: (company: IndividualCompany) => void;
  selectedCompanies: IndividualCompany[];
}

/**
 * AddCompanyComparisonCard component allows users to add companies to a comparison list.
 */

const AddCompanyComparisonCard: React.FC<Props> = ({ onCompanyAdd, selectedCompanies }) => {
  const modal = useModal();

  return (
    <div className="min-h-[72vh] flex flex-col justify-center items-center p-10 border-2 border-black border-dashed min-w-[350px] rounded-tr-3xl rounded-br-3xl">
      {selectedCompanies.length === 0 ? (
        <>
          <h2 className="text-black text-xl font-bold mb-8 text-center font-title">
            No Companies Currently In Selection.
          </h2>
          <h2 className="text-black text-lg font-medium mb-2 text-center font-title italic">Add a company</h2>
        </>
      ) : (
        <h2 className="text-center text-lg font-title font-medium mb-2 italic">Add another company</h2>
      )}
      {/* SVG icon for adding a company; toggles modal on click */}
      <svg
        width="60px"
        height="60px"
        viewBox="0 0 32 32"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => modal.handleToggleModal(true)}
        className="cursor-pointer hover:scale-110"
      >
        <defs></defs>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Icon-Set" transform="translate(-100.000000, -1035.000000)" fill="#000000">
            <path
              d="M130,1063 C130,1064.1 129.104,1065 128,1065 L104,1065 C102.896,1065 102,1064.1 102,1063 L102,1039 C102,1037.9 102.896,1037 104,1037 L128,1037 C129.104,1037 130,1037.9 130,1039 L130,1063 L130,1063 Z M128,1035 L104,1035 C101.791,1035 100,1036.79 100,1039 L100,1063 C100,1065.21 101.791,1067 104,1067 L128,1067 C130.209,1067 132,1065.21 132,1063 L132,1039 C132,1036.79 130.209,1035 128,1035 L128,1035 Z M122,1050 L117,1050 L117,1045 C117,1044.45 116.552,1044 116,1044 C115.448,1044 115,1044.45 115,1045 L115,1050 L110,1050 C109.448,1050 109,1050.45 109,1051 C109,1051.55 109.448,1052 110,1052 L115,1052 L115,1057 C115,1057.55 115.448,1058 116,1058 C116.552,1058 117,1057.55 117,1057 L117,1052 L122,1052 C122.552,1052 123,1051.55 123,1051 C123,1050.45 122.552,1050 122,1050 L122,1050 Z"
              id="plus-square"
            ></path>
          </g>
        </g>
      </svg>
      {/* Render the modal if it's open */}
      {modal.open && (
        <SelectCompanyComparisonModal
          handleCloseModal={() => modal.handleToggleModal(false)}
          onCompanySelect={(company) => {
            onCompanyAdd(company);
            modal.handleToggleModal(false);
          }}
          selectedCompanies={selectedCompanies}
        />
      )}
    </div>
  );
};

export default AddCompanyComparisonCard;