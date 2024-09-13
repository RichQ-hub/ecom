import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RootLayout from './layouts/RootLayout';
import SignupPage from './pages/SignUpPage';
import CompaniesListPage from './pages/CompaniesListPage';
import ComparisonToolPage from './pages/ComparisonToolPage';
import FrameworksPage from './pages/FrameworksPage';
import EsgDataPage from './pages/EsgDataPage';
import MetricPage from './pages/MetricPage';
import EsgScoresPage from './pages/EsgScoresPage/EsgScoresPage';
import FrameworkMetrixEditor from './pages/FrameworkMetrixEditor';
import ProtectedRoutes from './layouts/ProtectedRoutes';

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'signup',
          element: <SignupPage />,
        },
      ],
    },
    {
      path: '/',
      element: <ProtectedRoutes />,
      children: [
        {
          path: 'companies',
          element: <CompaniesListPage />,
        },
        {
          path: 'comparison-tool',
          element: <ComparisonToolPage />,
        },
        {
          path: 'frameworks',
          children: [
            {
              index: true,
              element: <FrameworksPage />,
            },
            {
              path: 'deleted',
              element: <FrameworksPage />,
            },
            {
              path: 'create',
              element: <FrameworkMetrixEditor />,
            },
            {
              path: 'edit/:frameworkId',
              element: <FrameworkMetrixEditor />,
            },
            {
              path: 'duplicate/:frameworkId',
              element: <FrameworkMetrixEditor />,
            },
          ],
        },
        {
          path: 'companies/:companyId',
          element: <EsgDataPage />,
          children: [
            {
              index: true,
              element: <Navigate to="environmental" />,
            },
            {
              path: 'environmental',
              element: <MetricPage category="E" key="env" />,
            },
            {
              path: 'social',
              element: <MetricPage category="S" key="soc" />,
            },
            {
              path: 'governance',
              element: <MetricPage category="G" key="gov" />,
            },
          ],
        },
        {
          path: 'companies/:companyId/esg-scores',
          element: <EsgScoresPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
