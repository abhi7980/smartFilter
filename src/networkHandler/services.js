import { postRequest } from './network';
import Cookies from 'js-cookie';

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



export const addUser = async ({
  PageNo = 1,
  PageSize = 10,
  Search = '',
  CrudAction = 'ADD',
  Slug = 'user',
  PUID = JSON.parse(Cookies.get("user"))?.id,
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


export const editUser = async ({
  PageNo = 1,
  PageSize = 10,
  Search = '',
  CrudAction = 'EDIT',
  Slug = 'user',
  PUID = JSON.parse(Cookies.get("user"))?.id,
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

export const deleteUser = async ({
  CrudAction = 'DELETE',
  Slug = 'user',
  PUID = JSON.parse(Cookies.get("user"))?.id,
  id,
} = {}) => {
  const queryParams = {
    CrudAction,
    Slug,
    PUID,
    id,
  };

  console.log("queryParams",queryParams)

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

