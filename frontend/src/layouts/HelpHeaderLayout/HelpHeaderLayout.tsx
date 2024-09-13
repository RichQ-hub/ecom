import React from 'react';
import useModal from '../../hooks/useModal';
import HelpInfoModal from '../../components/HelpInfoModal/HelpInfoModal';

const HelpHeaderLayout = ({ children, title, info }: { children: React.ReactNode; title: string; info: string }) => {
  const modal = useModal();

  return (
    <>
      <div className="h-20 bg-ecom-header-blue font-title text-ecom-light-blue font-bold flex items-center text-4xl px-14 shadow-ecom-header relative">
        <h1 className="mr-4">{title}</h1>
        <div
          className="absolute right-5 flex items-center cursor-pointer"
          onClick={() => modal.handleToggleModal(true)}
        >
          <h2 className="text-white font-medium text-xl mr-2">Help</h2>
          <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title />
            <g id="Complete">
              <g id="info-circle">
                <g>
                  <circle
                    cx="12"
                    cy="12"
                    data-name="--Circle"
                    fill="none"
                    id="_--Circle"
                    r="10"
                    stroke="#ffffff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <line
                    fill="none"
                    stroke="#ffffff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    x1="12"
                    x2="12"
                    y1="12"
                    y2="16"
                  />
                  <line
                    fill="none"
                    stroke="#ffffff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    x1="12"
                    x2="12"
                    y1="8"
                    y2="8"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
        {modal.open && <HelpInfoModal handleCloseModal={() => modal.handleToggleModal(false)} info={info} />}
      </div>
      <main className="py-10 px-14">{children}</main>
    </>
  );
};

export default HelpHeaderLayout;
