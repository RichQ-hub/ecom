import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextProvider';

const LandingPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const gradientClasses = 'bg-gradient-to-b from-ecom-light-blue via-ecom-light-blue to-ecom-teal';
  const mainSectionStyle = {
    backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.7)), url(/images/finance_bros.jpg)`,
    backgroundSize: 'cover',
    backgroundBlendMode: 'overlay',
  };

  return (
    <div className="bg-ecom-body-bg min-h-screen">
      <main
        className="bg-ecom-header-blue flex flex-col items-center justify-center h-screen text-center"
        style={mainSectionStyle}
      >
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-ecom-light-blue to-ecom-teal bg-clip-text text-transparent">
          ecoM
        </h1>
        <div className="w-full max-w-xl">
          <p className="text-white text-xl mb-8">
            Powerful and efficient e-commerce platform designed to assist corporations and investors in managing ESG
            (Environmental, Social, Governance) reporting and metrics.
          </p>
        </div>

        {!auth.token && (
          <div className="flex space-x-4">
            <button
              name="sign-up"
              className="px-6 py-2 bg-ecom-med-blue text-white rounded-lg hover:bg-ecom-dark-blue"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
            <button
              name="login"
              className="px-6 py-2 bg-ecom-dark-blue text-white rounded-lg hover:bg-ecom-header-blue"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
          </div>
        )}
      </main>
      <section className="py-16">
        <h2 className="text-5xl font-bold text-center mb-12 text-ecom-header-blue">Included features</h2>
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-16 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-8 mb-4 lg:mb-0">
              <h3 className="text-3xl font-semibold text-ecom-header-blue mb-4">Search Options</h3>
              <p className="text-lg">
                Our platform provides advanced search options to help you find the specific ESG data you need quickly
                and efficiently.
              </p>
            </div>
            <div className={`p-2 lg:w-1/2 w-full relative rounded-lg overflow-hidden shadow-lg ${gradientClasses}`}>
              <img src="/images/search_companies.png" alt="Search Companies" className="w-full" />
            </div>
          </div>
          <div className="mb-16 flex flex-col lg:flex-row items-center">
            <div className={`p-2 lg:w-1/2 w-full relative rounded-lg overflow-hidden shadow-lg ${gradientClasses}`}>
              <img src="/images/company_esg_data.png" alt="Company ESG Comparison" className="w-full" />
            </div>
            <div className="lg:w-1/2 lg:pl-8 mb-4 lg:mb-0">
              <h3 className="text-3xl font-semibold text-ecom-header-blue mb-4">Company ESG Data</h3>
              <p className="text-lg">
                Access comprehensive ESG data for various companies to make informed investment decisions and corporate
                strategies.
              </p>
            </div>
          </div>
          <div className="mb-16 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-8 mb-4 lg:mb-0">
              <h3 className="text-3xl font-semibold text-ecom-header-blue mb-4 ">Company ESG Comparison</h3>
              <p className="text-lg">
                Compare ESG metrics across different companies to evaluate and benchmark their performance on
                sustainability and governance.
              </p>
            </div>
            <div className={`p-2 lg:w-1/2 w-full relative rounded-lg overflow-hidden shadow-lg ${gradientClasses}`}>
              <img src="/images/company_comparison.png" alt="Company ESG Comparison" className="w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
