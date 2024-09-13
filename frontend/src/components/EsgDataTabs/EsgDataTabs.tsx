import clsx from 'clsx';
import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const LINKS = ['Environmental', 'Social', 'Governance'];

interface StringIndexedObject {
  [key: string]: React.ReactNode;
}

const ESG_ICONS: StringIndexedObject = {
  environmental: <svg className='w-6 pb-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0h32c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64H64c123.7 0 224 100.3 224 224v32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320C100.3 320 0 219.7 0 96z"/></svg>,
  social: <svg className='w-6 pb-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3V245.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5V416c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V389.2C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112h32c24 0 46.2 7.5 64.4 20.3zM448 416V394.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176h32c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2V416c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3V261.7c-10 11.3-16 26.1-16 42.3zm144-42.3v84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2V448c0 17.7-14.3 32-32 32H288c-17.7 0-32-14.3-32-32V405.2c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112h32c61.9 0 112 50.1 112 112z"/></svg>,
  governance: <svg className='w-6 pb-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M240.1 4.2c9.8-5.6 21.9-5.6 31.8 0l171.8 98.1L448 104l0 .9 47.9 27.4c12.6 7.2 18.8 22 15.1 36s-16.4 23.8-30.9 23.8H32c-14.5 0-27.2-9.8-30.9-23.8s2.5-28.8 15.1-36L64 104.9V104l4.4-1.6L240.1 4.2zM64 224h64V416h40V224h64V416h48V224h64V416h40V224h64V420.3c.6 .3 1.2 .7 1.8 1.1l48 32c11.7 7.8 17 22.4 12.9 35.9S494.1 512 480 512H32c-14.1 0-26.5-9.2-30.6-22.7s1.1-28.1 12.9-35.9l48-32c.6-.4 1.2-.7 1.8-1.1V224z"/></svg>,
}

const EsgDataTabs = () => {
  const { companyId } = useParams();
  const location = useLocation();
  const [page, setPage] = useState<string>('Environmental');

  return (
    <ul className='flex items-center border-b-2 border-ecom-divider font-title font-semibold'>
      <div className='mr-2'>{ESG_ICONS[page.toLowerCase()]}</div>
      {LINKS.map((link, idx) => {
        const path = `/companies/${companyId}/${link.toLowerCase()}`;
        return (
          <li key={idx}>
            <Link
              to={path}
              className={clsx(
                `block relative px-6 pb-2 text-center text-lg after:absolute after:bottom-0 after:left-0
                after:right-0 after:bg-ecom-med-blue after:h-[3px] after:scale-x-0 after:transition-transform
                after:duration-300 hover:text-zinc-500`,
                {
                  'after:scale-x-100 text-ecom-med-blue': location.pathname === path
                }
              )}
              onClick={() => setPage(link)}
            >
              {link}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default EsgDataTabs;