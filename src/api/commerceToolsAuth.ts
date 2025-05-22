import axios, { AxiosError } from 'axios';

// console.log('CLIENT_ID:', process.env.REACT_APP_CTP_CLIENT_ID);
// console.log('AUTH_URL:', process.env.REACT_APP_CTP_AUTH_URL);
// console.log('PROJECT_KEY:', process.env.REACT_APP_CTP_PROJECT_KEY);
// console.log('SCOPES:', process.env.REACT_APP_CTP_SCOPES);

export const loginCustomer = async (email: string, password: string) => {
  const REACT_APP_CTP_CLIENT_ID = process.env.REACT_APP_CTP_CLIENT_ID;
  const REACT_APP_CTP_CLIENT_SECRET = process.env.REACT_APP_CTP_CLIENT_SECRET;
  const REACT_APP_CTP_AUTH_URL = process.env.REACT_APP_CTP_AUTH_URL;
  const REACT_APP_CTP_SCOPES = process.env.REACT_APP_CTP_SCOPES;
  const REACT_APP_CTP_PROJECT_KEY = process.env.REACT_APP_CTP_PROJECT_KEY;

  console.log('ENV VARS:', {
    REACT_APP_CTP_AUTH_URL,
    REACT_APP_CTP_PROJECT_KEY,
    REACT_APP_CTP_CLIENT_ID,
    REACT_APP_CTP_CLIENT_SECRET,
  });

  if (!REACT_APP_CTP_AUTH_URL || !REACT_APP_CTP_PROJECT_KEY || !REACT_APP_CTP_CLIENT_ID || !REACT_APP_CTP_CLIENT_SECRET) {
    throw new Error('Missing environment variables for authentication');
  }

  const url = `${REACT_APP_CTP_AUTH_URL}/oauth/${REACT_APP_CTP_PROJECT_KEY}/customers/token`;

  const body = new URLSearchParams({
    grant_type: 'password',
    username: email,
    password: password,
    scope: REACT_APP_CTP_SCOPES || '',
  });

  const authHeader = btoa(`${REACT_APP_CTP_CLIENT_ID}:${REACT_APP_CTP_CLIENT_SECRET}`);

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message;
      if (message) {
        throw new Error(message);
      }
    }

    throw new Error('Login failed. Please try again.');
  }
};
