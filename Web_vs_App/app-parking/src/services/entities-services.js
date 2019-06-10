import axios from 'axios';
import { API } from '../common/constants.js';
function getAllEntities() {
    return axios.get(`${API.ENTITIES.format()}`)
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

export { getAllEntities }