import { postRequest } from './network';

export const loginUser = async (username, password, useQueryParams = false) => {
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



export const getUsers = async ({
  PageNo = 1,
  PageSize = 10,
  Search = '',
  CrudAction = 'VIEW',
  Slug = 'user',
  PUID = '',
  ...otherFilters
} = {}) => {
  const queryParams = {
    PageNo,
    PageSize,
    Search,
    CrudAction,
    Slug,
    PUID,
    ...otherFilters, // e.g., filters like Name, Email, etc.
  };

  try {
    const response = await postRequest('api/User/manage', queryParams, {
      asQueryParams: true,
    });
    return response;
  } catch (err) {
    console.error('Fetching users failed:', err?.message || err);
    throw err;
  }
};



