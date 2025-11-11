import axios from 'axios';



const baseURL = 'http://localhost:5000/api/';

export const instance = axios.create({
  baseURL: baseURL,
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});