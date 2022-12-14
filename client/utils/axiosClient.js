import axios from 'axios';

const axiosClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
      Host: 'ticketing.dev',
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
};

export default axiosClient;
