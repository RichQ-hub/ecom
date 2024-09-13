import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  {
    name: 'SEARCH',
    href: '/companies',
  },
  {
    name: 'COMPARISON TOOL',
    href: '/comparison-tool',
  },
  {
    name: 'FRAMEWORKS',
    href: '/frameworks',
  }
]

const Navlinks = () => {
  const location = useLocation();

  return (
    <ul className='ml-4 h-full font-title text-white flex font-semibold text-lg'>
      {NAV_LINKS.map((link, idx) => {
        return (
          <li key={idx} className='h-full'>
            <Link
              className={clsx(
                `relative h-full flex items-center px-4 after:absolute after:bottom-0 after:left-0 
                after:right-0 after:bg-ecom-light-blue after:w-full after:h-1 after:scale-x-0 after:transition-transform
                after:duration-200 after:ease-in-out hover:after:scale-x-100`,
                {
                  'text-ecom-light-blue after:scale-x-100': link.href === location.pathname
                }
              )}
              to={link.href}
            >
              {link.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default Navlinks;