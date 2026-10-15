import axios from 'axios';

const instance = axios.create({
    // Use an empty string so the browser uses the current host and port
    // automatically, allowing the app to work on any network device.
    baseURL: '' 
});

export default instance;
