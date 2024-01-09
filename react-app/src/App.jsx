import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import RegistrationPage from './pages/RegistrationPage.jsx'

export const App = () => {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/wallet" element={<PersonalWalletPage />} />
        <Route path="/details" element={<CryptoDetailsPage />} />
        <Route path="/game" element={<GamePage />} /> */}
      </Routes>
    </Router>
  );
};

export default App
