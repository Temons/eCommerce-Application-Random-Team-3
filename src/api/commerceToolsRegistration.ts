import axios, { AxiosError } from 'axios';

interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
    isBilling?: boolean;
    isShipping?: boolean;
  }[];
}

export const registerCustomer = async (data: RegistrationData) => {
  const clientId = process.env.REACT_APP_CTP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CTP_CLIENT_SECRET;
  const apiUrl = process.env.REACT_APP_CTP_API_URL;
  const projectKey = process.env.REACT_APP_CTP_PROJECT_KEY;

  if (!clientId || !clientSecret || !apiUrl || !projectKey) {
    throw new Error('Missing environment variables for registration');
  }

  const url = `${apiUrl}/${projectKey}/customers`;

  const customerData = {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    addresses: data.addresses,
    defaultShippingAddress: 0, // Index of the default shipping address
    defaultBillingAddress: data.addresses.length > 1 ? 1 : 0, // Index of the default billing address
  };

  try {
    const response = await axios.post(url, customerData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        if (message?.includes('email')) {
          throw new Error('EMAIL_ALREADY_EXISTS');
        }
        throw new Error('INVALID_DATA');
      }

      if (status === 401) {
        throw new Error('UNAUTHORIZED');
      }
    }

    throw new Error('REGISTRATION_FAILED');
  }
}; 