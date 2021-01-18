import Axios from 'axios';

const axiosApi = Axios.create({
 // baseURL: process.env.URL,
// headers: { 'content-type': 'application/x-www-form-urlencoded' },
});

export default axiosApi;
