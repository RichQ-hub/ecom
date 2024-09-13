import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContextProvider';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const ProtectedRoutes = () => {
  const auth = useContext(AuthContext);

  if (!auth.token) {
    return <Navigate to='/' />
  }

  return (
    <>
      <Navbar />
      <div className="bg-ecom-body-bg pt-12 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}

export default ProtectedRoutes