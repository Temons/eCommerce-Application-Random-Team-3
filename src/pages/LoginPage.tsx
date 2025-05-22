import React, { useState } from 'react';
import '../styles/LoginPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import { loginCustomer } from '../api/commerceToolsAuth';



const LoginPage = () => {
  // console.log('AUTH URL:', process.env.REACT_APP_CTP_AUTH_URL);
  // console.log('PROJECT KEY:', process.env.REACT_APP_CTP_PROJECT_KEY);
  // console.log('CLIENT ID:', process.env.REACT_APP_CTP_CLIENT_ID);
  // console.log('CLIENT SECRET:', process.env.REACT_APP_CTP_CLIENT_SECRET);
  // console.log('SCOPES:', process.env.REACT_APP_CTP_SCOPES);
  // console.log('API URL:', process.env.REACT_APP_CTP_API_URL);
  // console.log(process.env);



  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  //Email validation
  const validateEmail = (email: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) return 'Email is required';
    if (trimmedEmail !== email) return 'Email must not contain leading or trailing spaces';
    if (!trimmedEmail.includes('@')) return 'Email must contain "@" symbol';
    const [local, domain] = trimmedEmail.split('@');
    if (!local || !domain) return 'Invalid email format';
    if (!domain.includes('.')) return 'Email must contain a valid domain (e.g., example.com)';
    return undefined;
  };

  //Password validation
  const validatePassword = (password: string) => {
    const trimmed = password.trim();

    if (!trimmed) return 'Password is required';
    if (trimmed !== password) return 'Password must not contain leading or trailing spaces';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one digit';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return undefined;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      console.log('Login with:', { email, password });
      try {
        const data = await loginCustomer(email, password);
        console.log('Logged in! Access token:', data.access_token);

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('customer_id', data.customer?.id || '');
        localStorage.setItem('customer_email', data.customer?.email || '');

        navigate('/main');

      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
          setErrors((prev) => ({
            ...prev,
            password: 'Invalid email or password',
          }));
        } else {
          console.error('Unknown error:', err);
          setErrors((prev) => ({
            ...prev,
            password: 'Login failed. Please try again.',
          }));
        }
      }
    }
  };

  return (
    <div className="main-block">
      <div className="login-block">
        <h1>Login Page</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="email-block-errors">
            <div className='email-block'>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <p className="error-placeholder">
              {errors.email || ''}
            </p>
          </div>

          <div className="password-block-errors">
            <div className='password-block'>
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <p className="error-placeholder">
              {errors.password || ''}
            </p>
          </div>

          <div className="show-password-toggle">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="show-password">Show password</label>
          </div>

          <button type="submit" className="login-btn" id="login-btn">Login</button>

          <p className="register-link">
            Don’t have an account? <Link to="/register">Registration</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
