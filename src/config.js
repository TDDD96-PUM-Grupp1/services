/*
Configuration file for different project parameters.
*/

const settings = {
  communication: {
    host_ip: 'deepstream:6020',
    credentials_url: 'http://authenticator:3000/getAuthToken',
    pingrate: 1,
    service_name: 'game',
  },
};

export default settings;
