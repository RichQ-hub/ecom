import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({
  title,
  children,
  handleCloseModal,
} : {
  title: string;
  children: React.ReactNode;
  handleCloseModal: () => void;
}) => {
  return ReactDOM.createPortal(
    <div className='fixed flex items-center h-screen w-full top-0 z-50 bg-[#0000001f] backdrop-blur-sm'>
      <dialog open className='w-full max-w-[600px] min-w-[400px] mx-auto bg-ecom-modal-bg shadow-ecom-modal px-8 py-4 border-black border-[1px] rounded-xl'>
        {/* Header */}
        <div className='flex items-center mb-4'>
          <h2 className='font-title text-black font-bold text-2xl'>{title}</h2>

          {/* Close Button */}
          <button
            className='flex items-center justify-center ml-auto w-6 h-6 border-[1px] border-zinc-500 hover:bg-zinc-100'
            type='button'
            aria-label='Close Modal'
            onClick={handleCloseModal}
          >
            <svg className='w-1/3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
          </button>
        </div>

        {/* Body */}
        {children}
      </dialog>
    </div>, document.getElementById('portal')!
  );
}

export default Modal;