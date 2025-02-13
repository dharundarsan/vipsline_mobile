import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../../util/Helpers";

const getStaffListAPI = async () => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/get", {
            business_id: await SecureStore.getItemAsync('businessId'),
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Get Staff List API")
    }
}

export default getStaffListAPI;