import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HelpHeaderLayout from '../../layouts/HelpHeaderLayout/HelpHeaderLayout';
import clsx from 'clsx';
import FrameworkService from '../../services/FrameworkService';
import { FrameworkDetails } from '../../types/framework';
import { AuthContext } from '../../context/AuthContextProvider';

const FrameworksPage = () => {
  const navigate = useNavigate();

  const [frameworks, setFrameworks] = useState<FrameworkDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [activeTab, setActiveTab] = useState<'active'>('active');
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const allFrameworks = await FrameworkService.searchFrameworks(auth.token, '', '0');
      setFrameworks(allFrameworks);
    };
    fetchData();
  }, [searchTerm]);

  const filteredFrameworks = frameworks?.filter((framework) =>
    framework.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFrameworks = filteredFrameworks?.length
    ? [...filteredFrameworks].sort((a, b) => {
        switch (sortBy) {
          case 'alphabetical':
            return a.name.localeCompare(b.name);
          case 'date':
            return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
            return 0;
          default:
            return 0;
        }
      })
    : [];

  const handleCreateNewFramework = () => {
    navigate('/frameworks/create');
  };

  const handleEditMatrix = (frameworkId: string) => {
    navigate(`/frameworks/edit/${frameworkId}?action=edit`);
  };

  const handleDuplicateMatrix = (frameworkId: string) => {
    navigate(`/frameworks/duplicate/${frameworkId}?action=duplicate`);
  };

  const handleDeleteFramework = async (frameworkId: string) => {
    try {
      const result = await FrameworkService.delete(auth.token, frameworkId);
      setFrameworks(frameworks.filter(framework => framework.framework_id !== frameworkId));
    } catch (error) {
      console.error('Deletionj error:', error);
    }
  };

  const TABS = [
    { label: 'Active Frameworks', value: 'active' },
  ];

  const DUPLICATE_ICON = (
    <svg className="w-6 pb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M288 448L64 448l0-224 64 0 0-64-64 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l224 0c35.3 0 64-28.7 64-64l0-64-64 0 0 64zm-64-96l224 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L224 0c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64z"/>
    </svg>
  );

  const EDIT_ICON = (
    <svg className="w-6 pb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
      <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"/>
    </svg>
  );

  const TRASH_ICON = (
    <svg className="w-5 pb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
      <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
    </svg>
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const SORT_OPTIONS = [
    'Alphabetical',
    'Date'
  ];

  return (
    <HelpHeaderLayout
      title="Frameworks Page"
      info={`"What are ESG Frameworks?"
              ESG (Environmental, Social and Governance) frameworks are guidelines for measuring and reporting a company's sustainability and ethical impact.
              "Default Frameworks:"
              This section displays a list of pre-existing ESG frameworks. These frameworks are widely recognised and used by organisations globally.
              "Custom Frameworks:"
              This section displays the frameworks that you have created. Custom frameworks allow you to tailor ESG reporting to your specific needs.
              "Actions:"
              "Create Framework:" Click to build a new one. Enter the name, category / metric weightings then save.
              "Edit:" Click to update details and save.
              "Duplicate Framework:" Click to copy an existing framework and modify.
              "Delete Framework:" Click to remove.`}
    >
      <p className="text-lg text-gray-1000"></p>
      <div className="mb-10 flex justify-center items-center">
        <div className="relative mr-8">
          <input
            type="text"
            placeholder="Search frameworks..."
            className="p-2 pr-12 hover:bg-gray-300 border rounded border-[1px] border-black"
            style={{ width: '600px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute right-2 top-2 w-8 h-8 p-1 rounded-full hover:bg-zinc-300"
            type="submit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            </svg>
          </button>
        </div>
        <button
          onClick={handleCreateNewFramework}
          className="flex px-5 py-2 bg-ecom-green font-title items-center font-semibold border-[1px] border-black shadow-ecom-btn rounded-lg"
        >
          Create New Framework +
        </button>
      </div>

      <ul className="flex items-center border-b-2 border-ecom-divider font-title font-semibold">
        <div className="mr-2"></div>
        {TABS.map((tab, idx) => (
          <li key={idx}>
            <div
              className={clsx(
                `block relative px-6 pb-2 text-center text-lg after:absolute after:bottom-0 after:left-0
                after:right-0 after:bg-ecom-med-blue after:h-[3px] after:scale-x-0 after:transition-transform
                after:duration-300 hover:text-zinc-500 cursor-pointer`,
                {
                  'after:scale-x-100 text-ecom-med-blue': activeTab === tab.value,
                }
              )}
              onClick={() => setActiveTab('active')}
            >
              {tab.label}
            </div>
          </li>
        ))}
      </ul>

      <div className="ml-4 my-4">
        <div className="ml-4 my-4 flex items-center">
          <span className="text-lg font-semibold mr-2">Sort by:</span> {/* Added this line */}
          <div className="relative">
            <button
              className='relative border-[1px] border-black flex items-center justify-between px-4 py-2 min-w-[220px] font-title font-medium hover:bg-slate-200'
              type='button'
              onClick={() => setIsOpen(!isOpen)}
            >
              <p>{SORT_OPTIONS[Number(searchParams.get('sortBy')) ?? 0]}</p>
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512">
                  <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512">
                  <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/>
                </svg>
              )}

              {isOpen &&
                <ul className='absolute top-[calc(100%+1px)] right-0 left-0 bg-[#242526] text-white z-20'>
                  {SORT_OPTIONS.map((opt, idx) => {
                    return (
                      <li key={idx}>
                        <div
                          className='flex justify-start w-full px-4 py-2 hover:bg-[#525357]'
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', '1');
                            params.set('sortBy', idx.toString());
                            setSearchParams(params);
                            setSortBy(idx === 0 ? 'alphabetical' : 'date');
                            setIsOpen(false);
                          }}
                        >
                          {opt}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              }
            </button>
          </div>
        </div>

        <div>
            <>
              <h2 className="text-2xl font-bold mt-4">Default Frameworks</h2>
              <div className="grid grid-cols-10 mb-2">
                <div className="col-span-9">
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm font-bold">Duplicate</span>
                </div>
              </div>
              {sortedFrameworks
                .filter((framework) => framework.type == 'DEFAULT')
                .map((framework) => (
                  <div className="grid grid-cols-10 bg-ecom-bg-metric border-[1px] border-black shadow-ecom-card mb-4">
                    {/* Name and Description */}
                    <div className='col-span-9 p-4 flex items-center'>
                      <div>
                        <h2 className="font-bold text-lg pr-2 mr-2">{framework.name}</h2>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDuplicateMatrix(framework.framework_id)}
                      className='flex items-center justify-center font-bold text-center border-l border-black hover:text-ecom-light-blue'
                    >
                      {DUPLICATE_ICON}
                    </button>
                  </div>
                ))}

              {sortedFrameworks.some(framework => framework.type === 'SAVED') && (
                <>
                  <h2 className="text-2xl font-bold mt-10">Custom Frameworks</h2>
                  <div className="grid grid-cols-10 mb-2">
                    <div className="col-span-6"></div>
                    <div className="col-span-1 text-center">
                      <span className="text-sm font-bold">Date created</span>
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-sm font-bold">Duplicate</span>
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-sm font-bold">Edit</span>
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-sm font-bold">Delete</span>
                    </div>
                  </div>
                  {sortedFrameworks
                    .filter((framework) => framework.type === 'SAVED')
                    .map((framework) => (
                      <div
                        aria-label={`framework-${framework.name}`}
                        key={framework.framework_id}
                        className="grid grid-cols-10 bg-ecom-bg-metric border-[1px] border-black shadow-ecom-card mb-4"
                      >
                        <div className="col-span-6 p-4 flex items-center">
                          <div>
                            <h2 className="font-bold text-lg pr-2 mr-2">{framework.name}</h2>
                          </div>
                        </div>
                        <div className="flex items-center justify-center font-bold bg-ecom-dark-blue text-white text-lg">
                          {framework.date_created}
                        </div>
                        <button
                          aria-label='Fork Framework'
                          onClick={() => handleDuplicateMatrix(framework.framework_id)}
                          className='flex items-center justify-center font-bold text-center border-r border-black hover:text-ecom-light-blue'
                        >
                          {DUPLICATE_ICON}
                        </button>
                        <button
                          aria-label='Edit Framework'
                          onClick={() => handleEditMatrix(framework.framework_id)}
                          className='flex items-center justify-center font-bold text-lg border-r border-black hover:text-ecom-green'
                        >
                          {EDIT_ICON}
                        </button>
                        <button
                          aria-label='Delete Framework'
                          onClick={() => handleDeleteFramework(framework.framework_id)}
                          className="flex items-center justify-center font-bold text-lg hover:text-red-500"
                        >
                          {TRASH_ICON}
                        </button>
                      </div>
                    ))}
                </>
              )}
            </>
        </div>
      </div>
    </HelpHeaderLayout>
  );
};

export default FrameworksPage;
