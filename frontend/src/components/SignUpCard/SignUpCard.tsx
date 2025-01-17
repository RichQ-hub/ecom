import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContextProvider';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import PasswordStrengthMeter from '../PasswordStrengthMeter/PasswordStrengthMeter';
import * as EmailValidator from 'email-validator';
import zxcvbn from 'zxcvbn';

const SignUpCard = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [isPasswordSecure, setIsPasswordSecure] = useState(false);

  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const auth = useContext(AuthContext);

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await AuthService.register({
        email,
        name,
        password,
      });

      localStorage.setItem('token', result.token);
      localStorage.setItem('name', result.name);
      auth.setToken(result.token);
      auth.setName(result.name);
      navigate('/companies');
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailValid(EmailValidator.validate(e.target.value));
  };

  useEffect(() => {
    setIsPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    const passwordStrength = zxcvbn(password).score >= 3;
    setIsPasswordSecure(passwordStrength);
  }, [password]);

  return (
    <>
      <div className="bg-auth-modal-bg rounded-xl mx-auto px-8 max-w-lg font-title">
        <div className="flex min-h-full flex-1 flex-col justify-center py-6">
          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            {errorMessage && (
              <div className="bg-red-500 mb-4 text-white text-center font-medium p-2 rounded-md">{errorMessage}</div>
            )}

            <form className="space-y-6" onSubmit={handleSignUpSubmit}>
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-white">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    className="block w-full px-1.5 py-1.5 font-body text-black focus:outline-none focus:outline-offset-0 focus:outline-ecom-light-blue bg-ecom-body-bg"
                    value={email}
                    required
                    type="email"
                    onChange={handleEmailChange}
                  />
                </div>
                {!isEmailValid && (
                  <p className="text-red-500 mt-1" style={{ fontFamily: 'Roboto', fontWeight: 300 }}>
                    Please enter a valid email address
                  </p>
                )}{' '}
              </div>

              <div>
                <label htmlFor="name" className="block text-lg font-medium text-white">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    className="block w-full px-1.5 py-1.5 font-body text-black focus:outline-none focus:outline-offset-0 focus:outline-ecom-light-blue bg-ecom-body-bg"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-lg font-medium text-white">
                    Password
                  </label>
                </div>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-1.5 py-1.5 font-body text-black focus:outline-none focus:outline-offset-0 focus:outline-ecom-light-blue bg-ecom-body-bg pr-8"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="flex items-center justify-center m-0 p-0"
                  >
                    {showPassword ? (
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.1"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M16.8494 7.05025C14.1158 4.31658 9.6836 4.31658 6.94993 7.05025L4.82861 9.17157C3.49528 10.5049 2.82861 11.1716 2.82861 12C2.82861 12.8284 3.49528 13.4951 4.82861 14.8284L6.94993 16.9497C9.6836 19.6834 14.1158 19.6834 16.8494 16.9497L18.9707 14.8284C20.3041 13.4951 20.9707 12.8284 20.9707 12C20.9707 11.1716 20.3041 10.5049 18.9707 9.17157L16.8494 7.05025ZM12.0002 8.75C10.2053 8.75 8.75019 10.2051 8.75019 12C8.75019 13.7949 10.2053 15.25 12.0002 15.25C13.7951 15.25 15.2502 13.7949 15.2502 12C15.2502 10.2051 13.7951 8.75 12.0002 8.75Z"
                          fill="#323232"
                        />
                        <path
                          d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                          stroke="#323232"
                          stroke-width="2"
                        />
                        <path
                          d="M6.94975 7.05025C9.68342 4.31658 14.1156 4.31658 16.8492 7.05025L18.9706 9.17157C20.3039 10.5049 20.9706 11.1716 20.9706 12C20.9706 12.8284 20.3039 13.4951 18.9706 14.8284L16.8492 16.9497C14.1156 19.6834 9.68342 19.6834 6.94975 16.9497L4.82843 14.8284C3.49509 13.4951 2.82843 12.8284 2.82843 12C2.82843 11.1716 3.49509 10.5049 4.82843 9.17157L6.94975 7.05025Z"
                          stroke="#323232"
                          stroke-width="2"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.1"
                          d="M6.29528 7.87634L5 9.17162C3.66667 10.505 3 11.1716 3 12C3 12.8285 3.66667 13.4951 5 14.8285L7.12132 16.9498C9.85499 19.6835 14.2871 19.6835 17.0208 16.9498L17.4322 16.5384L14.5053 14.2619C13.9146 14.8713 13.0873 15.2501 12.1716 15.2501C10.3766 15.2501 8.92157 13.795 8.92157 12.0001C8.92157 11.3746 9.09827 10.7904 9.40447 10.2946L6.29528 7.87634Z"
                          fill="#323232"
                        />
                        <path
                          d="M3.17139 5.12988L21.1714 19.1299"
                          stroke="#323232"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M14.3653 13.8456C13.8162 14.5483 12.9609 15 12 15C10.3431 15 9 13.6569 9 12C9 11.3256 9.22253 10.7032 9.59817 10.2021"
                          stroke="#323232"
                          stroke-width="2"
                        />
                        <path
                          d="M9 5.62667C11.5803 4.45322 14.7268 4.92775 16.8493 7.05025L19.8511 10.052C20.3477 10.5486 20.5959 10.7969 20.7362 11.0605C21.0487 11.6479 21.0487 12.3521 20.7362 12.9395C20.5959 13.2031 20.3477 13.4514 19.8511 13.948V13.948L19.799 14"
                          stroke="#323232"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M7.01596 8.39827C7.40649 8.00774 7.40649 7.37458 7.01596 6.98406C6.62544 6.59353 5.99228 6.59353 5.60175 6.98406L7.01596 8.39827ZM7.65685 16.2427L5.53553 14.1213L4.12132 15.5356L6.24264 17.6569L7.65685 16.2427ZM16.1421 16.2427C13.799 18.5858 10 18.5858 7.65685 16.2427L6.24264 17.6569C9.36684 20.7811 14.4322 20.7811 17.5563 17.6569L16.1421 16.2427ZM5.53553 9.8787L7.01596 8.39827L5.60175 6.98406L4.12132 8.46449L5.53553 9.8787ZM16.7465 15.6383L16.1421 16.2427L17.5563 17.6569L18.1607 17.0526L16.7465 15.6383ZM5.53553 14.1213C4.84888 13.4347 4.40652 12.9893 4.12345 12.6183C3.85798 12.2704 3.82843 12.1077 3.82843 12H1.82843C1.82843 12.7208 2.1322 13.3056 2.53341 13.8315C2.917 14.3342 3.47464 14.8889 4.12132 15.5356L5.53553 14.1213ZM4.12132 8.46449C3.47464 9.11116 2.917 9.6658 2.53341 10.1686C2.1322 10.6944 1.82843 11.2792 1.82843 12H3.82843C3.82843 11.8924 3.85798 11.7297 4.12345 11.3817C4.40652 11.0107 4.84888 10.5654 5.53553 9.8787L4.12132 8.46449Z"
                          fill="#323232"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {password && <PasswordStrengthMeter password={password} />}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="confirm-password" className="block text-lg font-medium text-white">
                    Confirm Password
                  </label>
                </div>
                <div className="mt-2 mb-1 relative">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-1.5 py-1.5 font-body text-black focus:outline-none focus:outline-offset-0 focus:outline-ecom-light-blue bg-ecom-body-bg"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="flex items-center justify-center m-0 p-0"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.1"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M16.8494 7.05025C14.1158 4.31658 9.6836 4.31658 6.94993 7.05025L4.82861 9.17157C3.49528 10.5049 2.82861 11.1716 2.82861 12C2.82861 12.8284 3.49528 13.4951 4.82861 14.8284L6.94993 16.9497C9.6836 19.6834 14.1158 19.6834 16.8494 16.9497L18.9707 14.8284C20.3041 13.4951 20.9707 12.8284 20.9707 12C20.9707 11.1716 20.3041 10.5049 18.9707 9.17157L16.8494 7.05025ZM12.0002 8.75C10.2053 8.75 8.75019 10.2051 8.75019 12C8.75019 13.7949 10.2053 15.25 12.0002 15.25C13.7951 15.25 15.2502 13.7949 15.2502 12C15.2502 10.2051 13.7951 8.75 12.0002 8.75Z"
                          fill="#323232"
                        />
                        <path
                          d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                          stroke="#323232"
                          stroke-width="2"
                        />
                        <path
                          d="M6.94975 7.05025C9.68342 4.31658 14.1156 4.31658 16.8492 7.05025L18.9706 9.17157C20.3039 10.5049 20.9706 11.1716 20.9706 12C20.9706 12.8284 20.3039 13.4951 18.9706 14.8284L16.8492 16.9497C14.1156 19.6834 9.68342 19.6834 6.94975 16.9497L4.82843 14.8284C3.49509 13.4951 2.82843 12.8284 2.82843 12C2.82843 11.1716 3.49509 10.5049 4.82843 9.17157L6.94975 7.05025Z"
                          stroke="#323232"
                          stroke-width="2"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.1"
                          d="M6.29528 7.87634L5 9.17162C3.66667 10.505 3 11.1716 3 12C3 12.8285 3.66667 13.4951 5 14.8285L7.12132 16.9498C9.85499 19.6835 14.2871 19.6835 17.0208 16.9498L17.4322 16.5384L14.5053 14.2619C13.9146 14.8713 13.0873 15.2501 12.1716 15.2501C10.3766 15.2501 8.92157 13.795 8.92157 12.0001C8.92157 11.3746 9.09827 10.7904 9.40447 10.2946L6.29528 7.87634Z"
                          fill="#323232"
                        />
                        <path
                          d="M3.17139 5.12988L21.1714 19.1299"
                          stroke="#323232"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M14.3653 13.8456C13.8162 14.5483 12.9609 15 12 15C10.3431 15 9 13.6569 9 12C9 11.3256 9.22253 10.7032 9.59817 10.2021"
                          stroke="#323232"
                          stroke-width="2"
                        />
                        <path
                          d="M9 5.62667C11.5803 4.45322 14.7268 4.92775 16.8493 7.05025L19.8511 10.052C20.3477 10.5486 20.5959 10.7969 20.7362 11.0605C21.0487 11.6479 21.0487 12.3521 20.7362 12.9395C20.5959 13.2031 20.3477 13.4514 19.8511 13.948V13.948L19.799 14"
                          stroke="#323232"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M7.01596 8.39827C7.40649 8.00774 7.40649 7.37458 7.01596 6.98406C6.62544 6.59353 5.99228 6.59353 5.60175 6.98406L7.01596 8.39827ZM7.65685 16.2427L5.53553 14.1213L4.12132 15.5356L6.24264 17.6569L7.65685 16.2427ZM16.1421 16.2427C13.799 18.5858 10 18.5858 7.65685 16.2427L6.24264 17.6569C9.36684 20.7811 14.4322 20.7811 17.5563 17.6569L16.1421 16.2427ZM5.53553 9.8787L7.01596 8.39827L5.60175 6.98406L4.12132 8.46449L5.53553 9.8787ZM16.7465 15.6383L16.1421 16.2427L17.5563 17.6569L18.1607 17.0526L16.7465 15.6383ZM5.53553 14.1213C4.84888 13.4347 4.40652 12.9893 4.12345 12.6183C3.85798 12.2704 3.82843 12.1077 3.82843 12H1.82843C1.82843 12.7208 2.1322 13.3056 2.53341 13.8315C2.917 14.3342 3.47464 14.8889 4.12132 15.5356L5.53553 14.1213ZM4.12132 8.46449C3.47464 9.11116 2.917 9.6658 2.53341 10.1686C2.1322 10.6944 1.82843 11.2792 1.82843 12H3.82843C3.82843 11.8924 3.85798 11.7297 4.12345 11.3817C4.40652 11.0107 4.84888 10.5654 5.53553 9.8787L4.12132 8.46449Z"
                          fill="#323232"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="mb-10">
                  {confirmPassword.length > 0 && !isPasswordMatch && (
                    <p className="text-red-500" style={{ fontFamily: 'Roboto', fontWeight: 300 }}>
                      Please ensure your passwords match
                    </p>
                  )}{' '}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!isEmailValid || !isPasswordMatch || !isPasswordSecure}
                  className={`flex w-full justify-center rounded-md py-1.5 text-xl font-semibold text-black shadow-sm hover:bg-ecom-light-blue-900 ${!isEmailValid || email.length === 0 || name.length === 0 || !isPasswordMatch || !isPasswordSecure ? 'bg-gray-300 cursor-not-allowed opacity-50' : 'bg-ecom-light-blue'} transition duration-150 ease-in-out`}
                >
                  Sign Up
                </button>
              </div>
            </form>

            <p className="mt-3 mb-6 text-center text-base font-semibold text-white">
              Already have an account?{' '}
              <Link
                to="/login"
                className="leading-6 text-ecom-light-blue hover:text-ecom-light-blue-900 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpCard;
