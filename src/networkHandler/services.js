import { postRequest, getRequest } from './network';
import Cookies from 'js-cookie';

const getPUID = () => JSON.parse(Cookies.get("user"))?.id;

const createPayload = (crud, slug, extra = {}) => ({
  CrudAction: crud,
  Slug: slug,
  PUID: getPUID(),
  ...extra,
});

// ----------------------- AUTH -----------------------

export const loginUser = async (username, password) => {
  if (!username || !password) throw new Error('Username and password are required');
  try {
    return await postRequest('api/Auth/login', { username, password });
  } catch (err) {
    console.error('Login failed:', err?.message || err);
    throw err;
  }
};

// ----------------------- USER -----------------------

export const getUsers = async (filters = {}) => {
  return postRequest('api/User/manage', createPayload('VIEW', 'user', filters));
};

export const addUser = async ({ files = [], ...fields }) => {
  return postRequest('api/User/manage', createPayload('ADD', 'user', fields), files);
};

export const editUser = async ({ files = [], ...fields }) => {
  return postRequest('api/User/manage', createPayload('EDIT', 'user', fields), files);
};

export const deleteUser = async (id) => {
  return postRequest('api/User/manage', createPayload('DELETE', 'user', { id }));
};

// ----------------------- PRODUCT -----------------------

export const getProducts = async (filters = {}) => {
  return postRequest('api/Product/manage', createPayload('VIEW', 'product', filters));
};

export const addProduct = async ({ files = [], ...fields }) => {
  return postRequest('api/Product/manage', createPayload('ADD', 'product', fields), files);
};

export const editProduct = async ({ files = [], ...fields }) => {
  return postRequest('api/Product/manage', createPayload('EDIT', 'product', fields), files);
};

export const deleteProduct = async (id) => {
  return postRequest('api/Product/manage', createPayload('DELETE', 'product', { id }));
};

// ----------------------- RENTAL -----------------------

export const getRental = async (filters = {}) => {
  return postRequest('api/RentalPlan/manage', createPayload('VIEW', 'rental', filters));
};

export const addRental = async ({ files = [], ...fields }) => {
  return postRequest('api/RentalPlan/manage', createPayload('ADD', 'rental', fields), files);
};

export const editRental = async ({ files = [], ...fields }) => {
  return postRequest('api/RentalPlan/manage', createPayload('EDIT', 'rental', fields), files);
};

export const deleteRental = async (id) => {
  return postRequest('api/RentalPlan/manage', createPayload('DELETE', 'rental', { id }));
};

// ----------------------- STATIC -----------------------

export const getCityState = async () => {
  return getRequest('/api/StaticData/state-city');
};

export const getRoles = async () => {
  return getRequest('/api/StaticData/roles');
};

// ----------------------- MY PRODUCTS (ADMIN) -----------------------

export const getMyproductsAdmin = async (filters = {}) => {
  return postRequest('api/MyProduct/manage', createPayload('VIEW', 'myproduct', filters));
}

export const addMyProduct = async (filters = {}) => {
  return postRequest('api/MyProduct/manage', createPayload('ADD', 'myproduct', filters));
};

export const editMyProduct = async (filters = {}) => {
  return postRequest('api/MyProduct/manage', createPayload('EDIT', 'myproduct', filters));
};

export const deleteMyProduct = async (filters = {}) => {
  return postRequest('api/MyProduct/manage', createPayload('DELETE', 'myproduct', filters));
};

// ----------------------- Edit Status -----------------------
export const editStatus = async (filters = {}, type) => {
  return postRequest(`api/${type}/manage`, createPayload('EDITSTATUS', type, filters));
};