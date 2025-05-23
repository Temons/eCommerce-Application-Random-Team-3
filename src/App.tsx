import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// import RegistrationPage from './pages/RegistrationPage';
import MainPage from './pages/MainPage';
import { AuthProvider } from './contexts/AuthContext';

const App = () => (
  <AuthProvider>
  <Router>
    <Routes>
      <Route path="/main" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/register" element={<RegistrationPage />} /> */}
    </Routes>
  </Router>
  </AuthProvider>
);

export default App;
