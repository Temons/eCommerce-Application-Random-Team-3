import axios, { AxiosError } from 'axios';

interface Address {
  id: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CustomerProfile {
  version: number;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  addresses: Address[];
  defaultBillingAddressId?: string;
  defaultShippingAddressId?: string;
}

export const loginCustomer = async (email: string, password: string) => {
  const clientId = process.env.REACT_APP_CTP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CTP_CLIENT_SECRET;
  const authUrl = process.env.REACT_APP_CTP_AUTH_URL;
  const scopes = process.env.REACT_APP_CTP_SCOPES;
  const projectKey = process.env.REACT_APP_CTP_PROJECT_KEY;

  if (!clientId || !clientSecret || !authUrl || !projectKey) {
    throw new Error('Missing environment variables for authentication');
  }


  const url = `${authUrl}/oauth/${projectKey}/customers/token`;

  const body = new URLSearchParams({
    grant_type: 'password',
    username: email,
    password: password,
    scope: scopes || '',
  });

  const authHeader = btoa(`${clientId}:${clientSecret}`);

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400 && message?.includes('credentials')) {
        throw new Error('INVALID_CREDENTIALS');
      }

      if (status === 401) {
        throw new Error('UNAUTHORIZED');
      }
    }

    throw new Error('LOGIN_FAILED');
  }
};

export const getCustomerProfile = async (accessToken: string): Promise<CustomerProfile> => {

  const apiUrl = process.env.REACT_APP_CTP_API_URL;
  const projectKey = process.env.REACT_APP_CTP_PROJECT_KEY;

  console.log('API URL:', apiUrl);
  console.log('Project Key:', projectKey);

  if (!apiUrl || !projectKey) {
    throw new Error('Missing API URL or Project Key in environment variables');
  }


  const url = `${apiUrl}/${projectKey}/me`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });


  console.log('Fetched profile:', response.data);

const data = response.data;

return {
  version: data.version,
  email: data.email,
  firstName: data.firstName,
  lastName: data.lastName,
  dateOfBirth: data.dateOfBirth,
  addresses: data.addresses,
  defaultBillingAddressId: data.defaultBillingAddressId,
  defaultShippingAddressId: data.defaultShippingAddressId,
};

};

export const updateCustomerProfile = async (token: string, updatedData: {
  version: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
}) => {



  const apiUrl = process.env.REACT_APP_CTP_API_URL;
  const projectKey = process.env.REACT_APP_CTP_PROJECT_KEY;

  const response = await fetch(`${apiUrl}/${projectKey}/me`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: updatedData.version,
      actions: [
        { action: 'setFirstName', firstName: updatedData.firstName },
        { action: 'setLastName', lastName: updatedData.lastName },
        { action: 'setDateOfBirth', dateOfBirth: updatedData.dateOfBirth },
        { action: 'changeEmail', email: updatedData.email },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  const result = await response.json();
  return { version: result.version };
};
