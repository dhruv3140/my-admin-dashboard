import axiosInstance from './axiosInstance';

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProducts = async (limit = 10, skip = 0 ) =>{
    try {
        const response = await axiosInstance.get('/products?limit=' + limit + '&skip=' + skip);
        return response.data;
    } catch (error) {
        throw error;
    }   
};

export const SearchProducts = async (q, limit, skip) => {
    try {
        const response = await axiosInstance.get('/products/search', { params: { q, limit, skip } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await axiosInstance.get('/products/categories');   
        return response.data;
    } catch (error) {
        throw error;
    }   
};

export const getProductsCategories = async (category, limit =10, skip = 0) => {
    try {
        const response = await axiosInstance.get(`/products/category/${encodeURIComponent(category)}`, {
      params: { limit, skip } });   
        return response.data;
    } catch (error) {
        throw error;
    }   
};

export const getProductsById = async (id) => {
    try {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addProduct = async (productData) => {
    try {
        const response = await axiosInstance.post('/products/add', productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editProduct = async (id, productData) => {
    try {
        const response = await axiosInstance.put(`/products/${id}`, productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
