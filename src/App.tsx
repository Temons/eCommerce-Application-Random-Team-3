import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// import RegistrationPage from './pages/RegistrationPage';
// import MainPage from './pages/MainPage';

const App = () => (
  <Router>
    <Routes>
      {/* <Route path="/" element={<MainPage />} /> */}
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/register" element={<RegistrationPage />} /> */}
    </Routes>
  </Router>
);

export default App;
