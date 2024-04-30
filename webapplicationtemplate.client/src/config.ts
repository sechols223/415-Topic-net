import axios from 'axios';

export const Api = axios.create({
  baseURL: 'https://getagrip.ngrok.app/api',
  headers: {
    Accept: 'application/json',
  },
});
