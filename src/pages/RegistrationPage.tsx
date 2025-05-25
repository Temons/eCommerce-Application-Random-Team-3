import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/RegistrationPage.scss';
import { registerCustomer } from '../api/commerceToolsRegistration';
import { countries } from '../constants/countries';

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  useSameAddress: boolean;
  billingStreet: string;
  billingCity: string;
  billingPostalCode: string;
  billingCountry: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { authToken } = useAuth();

  useEffect(() => {
    if (authToken) {
      navigate('/main', { replace: true });
    }
  }, [authToken, navigate]);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    useSameAddress: true,
    billingStreet: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): string | undefined => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return 'Email is required';
    if (trimmedEmail !== email) return 'Email must not contain leading or trailing spaces';
    if (!trimmedEmail.includes('@')) return 'Email must contain "@" symbol';
    const [local, domain] = trimmedEmail.split('@');
    if (!local || !domain) return 'Invalid email format';
    if (!domain.includes('.')) return 'Email must contain a valid domain (e.g., example.com)';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
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

  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value.trim()) return `${fieldName} is required`;
    return undefined;
  };

  const validateDateOfBirth = (date: string): string | undefined => {
    if (!date) return 'Date of birth is required';
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) return 'You must be at least 13 years old';
    if (age > 120) return 'Please enter a valid date of birth';
    return undefined;
  };

  const validatePostalCode = (code: string, country: string): string | undefined => {
    if (!code.trim()) return 'Postal code is required';
    // Basic validation for different country formats
    const postalCodeRegex: { [key: string]: RegExp } = {
      'US': /^\d{5}(-\d{4})?$/,  // US ZIP code
      'UK': /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/,  // UK postcode
      'CA': /^[A-Z]\d[A-Z] \d[A-Z]\d$/,  // Canadian postal code
    };
    
    if (postalCodeRegex[country] && !postalCodeRegex[country].test(code)) {
      return `Invalid postal code format for ${country}`;
    }
    return undefined;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      firstName: validateRequired(formData.firstName, 'First name'),
      lastName: validateRequired(formData.lastName, 'Last name'),
      dateOfBirth: validateDateOfBirth(formData.dateOfBirth),
      street: validateRequired(formData.street, 'Street'),
      city: validateRequired(formData.city, 'City'),
      postalCode: validatePostalCode(formData.postalCode, formData.country),
      country: validateRequired(formData.country, 'Country'),
    };

    if (!formData.useSameAddress) {
      newErrors.billingStreet = validateRequired(formData.billingStreet, 'Billing street');
      newErrors.billingCity = validateRequired(formData.billingCity, 'Billing city');
      newErrors.billingPostalCode = validatePostalCode(formData.billingPostalCode, formData.billingCountry);
      newErrors.billingCountry = validateRequired(formData.billingCountry, 'Billing country');
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const addresses = [
        {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          isDefault: true,
          isShipping: true,
          isBilling: formData.useSameAddress,
        },
      ];

      if (!formData.useSameAddress) {
        addresses.push({
          street: formData.billingStreet,
          city: formData.billingCity,
          postalCode: formData.billingPostalCode,
          country: formData.billingCountry,
          isDefault: false,
          isShipping: false,
          isBilling: true,
        });
      }

      await registerCustomer({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        addresses,
      });

      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      if (error instanceof Error) {
        switch (error.message) {
          case 'EMAIL_ALREADY_EXISTS':
            setErrors(prev => ({
              ...prev,
              email: 'This email is already registered.',
            }));
            break;
          case 'INVALID_DATA':
            setErrors(prev => ({
              ...prev,
              submit: 'Please check your input data and try again.',
            }));
            break;
          case 'UNAUTHORIZED':
            setErrors(prev => ({
              ...prev,
              submit: 'Unauthorized request. Please contact support.',
            }));
            break;
          default:
            setErrors(prev => ({
              ...prev,
              submit: 'Registration failed. Please try again later.',
            }));
        }
      }
    }
  };

  return (
    <div className="main-block">
      <div className="registration-block">
        <h1>Registration</h1>
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              <p className="error-placeholder">{errors.email}</p>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              <p className="error-placeholder">{errors.password}</p>
            </div>

            <div className="form-group checkbox">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show password</label>
          </div>

            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? 'error' : ''}
              />
              <p className="error-placeholder">{errors.firstName}</p>
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? 'error' : ''}
              />
              <p className="error-placeholder">{errors.lastName}</p>
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={errors.dateOfBirth ? 'error' : ''}
              />
              <p className="error-placeholder">{errors.dateOfBirth}</p>
            </div>
          </div>

          <div className="form-section">
            <h2>Shipping Address</h2>
            <div className="form-group">
              <label htmlFor="street">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className={errors.street ? 'error' : ''}
              />
              <p className="error-placeholder">{errors.street}</p>
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={errors.city ? 'error' : ''}
              />
              <p className="error-placeholder">{errors.city}</p>
            </div>

            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className={errors.postalCode ? 'error' : ''}
              />
              <p className="error-placeholder">{errors.postalCode}</p>
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={errors.country ? 'error' : ''}
              >
                <option value="">Select a country</option>
                {countries.map(country => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              <p className="error-placeholder">{errors.country}</p>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="useSameAddress"
                name="useSameAddress"
                checked={formData.useSameAddress}
                onChange={handleInputChange}
              />
              <label htmlFor="useSameAddress">Use same address for billing</label>
            </div>

            {!formData.useSameAddress && (
              <>
                <h2>Billing Address</h2>
                <div className="form-group">
                  <label htmlFor="billingStreet">Street</label>
                  <input
                    type="text"
                    id="billingStreet"
                    name="billingStreet"
                    value={formData.billingStreet}
                    onChange={handleInputChange}
                    className={errors.billingStreet ? 'error' : ''}
                  />
                  <p className="error-placeholder">{errors.billingStreet}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="billingCity">City</label>
                  <input
                    type="text"
                    id="billingCity"
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleInputChange}
                    className={errors.billingCity ? 'error' : ''}
                  />
                  <p className="error-placeholder">{errors.billingCity}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="billingPostalCode">Postal Code</label>
                  <input
                    type="text"
                    id="billingPostalCode"
                    name="billingPostalCode"
                    value={formData.billingPostalCode}
                    onChange={handleInputChange}
                    className={errors.billingPostalCode ? 'error' : ''}
                  />
                  <p className="error-placeholder">{errors.billingPostalCode}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="billingCountry">Country</label>
                  <select
                    id="billingCountry"
                    name="billingCountry"
                    value={formData.billingCountry}
                    onChange={handleInputChange}
                    className={errors.billingCountry ? 'error' : ''}
                  >
                    <option value="">Select a country</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <p className="error-placeholder">{errors.billingCountry}</p>
                </div>
              </>
            )}
          </div>

          <button type="submit" className="register-btn">Register</button>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
