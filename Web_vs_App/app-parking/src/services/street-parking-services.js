import axios from 'axios';
import { API } from '../common/constants.js';
function getAllStreetParking() {
    return axios.get(`${API.PARKING_STREET}`)
        .then(res => {
            if (res.data) {
                return res.data;
            }
            else {
                return null
            }
        })
        .catch(error => {
            return false
        });
}

export { getAllStreetParking }