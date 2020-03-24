import axios from 'axios';

const BaseURL = 'http://212.237.35.40:3030';
// const BaseURL = 'http://87e5907d.ngrok.io';

const API = axios.create({
  baseURL: BaseURL
})

export {
  API, BaseURL
}