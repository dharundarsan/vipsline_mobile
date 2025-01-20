import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../../util/Helpers";

const editStaffAPI = async (data, resource_id) => {

    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/update", {
            resource_id: resource_id,
            data: data
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: Edit Staff API")
        return e.response;

    }
}

export default editStaffAPI;