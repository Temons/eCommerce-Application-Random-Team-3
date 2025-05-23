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

const getAnonymousToken = async () => {
  const clientId = process.env.REACT_APP_CTP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CTP_CLIENT_SECRET;
  const authUrl = process.env.REACT_APP_CTP_AUTH_URL;
  const projectKey = process.env.REACT_APP_CTP_PROJECT_KEY;
  const scopes = process.env.REACT_APP_CTP_SCOPES;

  if (!clientId || !clientSecret || !authUrl || !projectKey || !scopes) {
    throw new Error('Missing environment variables for authentication');
  }

  try {
    const response = await axios.post(
      `${authUrl}/oauth/token`,
      `grant_type=client_credentials&scope=${scopes}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Failed to get anonymous token:', error);
    throw new Error('AUTHENTICATION_FAILED');
  }
};

export const registerCustomer = async (data: RegistrationData) => {
  const clientId = process.env.REACT_APP_CTP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CTP_CLIENT_SECRET;
  const apiUrl = process.env.REACT_APP_CTP_API_URL;
  const projectKey = process.env.REACT_APP_CTP_PROJECT_KEY;

  if (!clientId || !clientSecret || !apiUrl || !projectKey) {
    throw new Error('Missing environment variables for registration');
  }

  try {
    // Get anonymous token first
    const token = await getAnonymousToken();

    const url = `${apiUrl}/${projectKey}/customers`;

    // Format the customer data according to CommerceTools API requirements
    const customerData = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      addresses: data.addresses.map((address, index) => ({
        key: `address-${index}`,
        streetName: address.street,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault || false,
        isBilling: address.isBilling || false,
        isShipping: address.isShipping || false,
      })),
      defaultShippingAddress: 0,
      defaultBillingAddress: data.addresses.length > 1 ? 1 : 0,
    };

    console.log('Sending customer data:', JSON.stringify(customerData, null, 2));

    const response = await axios.post(url, customerData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      const errors = error.response?.data?.errors;

      console.error('Registration error details:', {
        status,
        message,
        errors,
        response: error.response?.data,
      });

      if (status === 400) {
        if (message?.includes('email')) {
          throw new Error('EMAIL_ALREADY_EXISTS');
        }
        if (errors) {
          throw new Error(`INVALID_DATA: ${JSON.stringify(errors)}`);
        }
        throw new Error('INVALID_DATA');
      }

      if (status === 401) {
        throw new Error('UNAUTHORIZED');
      }
    }

    console.error('Registration failed:', error);
    throw new Error('REGISTRATION_FAILED');
  }
}; 