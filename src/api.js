import axios from "axios";

const baseUrl = "https://fipe.parallelum.com.br/api/v2";

export const getBrands = async (vehicleType) => {
  const response = await axios.get(`${baseUrl}/${vehicleType}/brands`);
  return response.data;
};

export const getModels = async (vehicleType, brandId) => {
  const response = await axios.get(`${baseUrl}/${vehicleType}/brands/${brandId}/models`);
  return response.data;
};

export const getYears = async (vehicleType, brandId, modelId) => {
  const response = await axios.get(`${baseUrl}/${vehicleType}/brands/${brandId}/models/${modelId}/years`);
  return response.data;
};

export const getFipe = async (vehicleType, brandId, modelId, yearId) => {
  const response = await axios.get(`${baseUrl}/${vehicleType}/brands/${brandId}/models/${modelId}/years/${yearId}`);
  return response.data;
};