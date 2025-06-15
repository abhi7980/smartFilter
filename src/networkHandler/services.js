import { postRequest } from './network';

const loginUser = async (username, password, useQueryParams = false) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const credentials = { username, password };

  try {
    const response = await postRequest('api/Auth/login', credentials, {
      asQueryParams: useQueryParams,
    });
    return response;
  } catch (err) {
    console.error('Login failed:', err?.message || err);
    throw err;
  }
};

export default loginUser;
