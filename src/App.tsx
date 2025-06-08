import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import MainPage from './pages/MainPage';
import { AuthProvider } from './contexts/AuthContext';
import NotFoundPage from './pages/NotFoundPage';
import UserProfilePage from './pages/UserProfilePage';
import Layout from './components/Layout';

const App = () => (
    <AuthProvider>
    <Router>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />


        <Route element={<Layout />}>
          <Route path="/main" element={<MainPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>


        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
