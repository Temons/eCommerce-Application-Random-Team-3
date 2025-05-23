import axios from 'axios';

// console.log('CLIENT_ID:', process.env.REACT_APP_CTP_CLIENT_ID);
// console.log('AUTH_URL:', process.env.REACT_APP_CTP_AUTH_URL);
// console.log('PROJECT_KEY:', process.env.REACT_APP_CTP_PROJECT_KEY);
// console.log('SCOPES:', process.env.REACT_APP_CTP_SCOPES);

export const loginCustomer = async (email: string, password: string) => {
  const {
    REACT_APP_CTP_CLIENT_ID,
    REACT_APP_CTP_CLIENT_SECRET,
    REACT_APP_CTP_AUTH_URL,
    REACT_APP_CTP_SCOPES,
    REACT_APP_CTP_PROJECT_KEY,
  } = process.env;

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
