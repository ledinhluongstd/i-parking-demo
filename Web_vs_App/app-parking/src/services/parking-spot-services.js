import axios from 'axios';
import { API } from '../common/constants.js';
function getAllParkingSpot(params) {
    return axios.get(`${API.ENTITIES}`)
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

export { getAllParkingSpot }