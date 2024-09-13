import Routes from './Routes';
import AuthContextProvider from './context/AuthContextProvider';

function App() {
  return (
    <AuthContextProvider>
      <body className='font-body'>
        <Routes />
      </body>
    </AuthContextProvider>
  );
}


export default App;
