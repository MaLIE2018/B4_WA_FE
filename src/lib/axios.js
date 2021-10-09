import axios from 'axios';

const axiosClient = axios.create();
axiosClient.defaults.baseURL = process.env.REACT_APP_BE_URL;
console.log(axiosClient.defaults.baseURL);
axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
};
axiosClient.defaults.timeout = 20000;
axiosClient.defaults.withCredentials = true;

export const getRequest = (URL, options = {}) =>
  axiosClient.get(`/${URL}`, options).then((response) => response);

export const postRequest = (URL, payload) =>
  axiosClient.post(`/${URL}`, payload).then((response) => response);

export const putRequest = (URL, payload, options = {}) =>
  axiosClient.put(`/${URL}`, payload, options).then((response) => response);

export const deleteRequest = (URL) =>
  axiosClient.delete(`/${URL}`).then((response) => response);


