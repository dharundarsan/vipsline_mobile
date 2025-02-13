import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const createStaffAPI = async (data) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/create", {
            business_id: await SecureStore.getItemAsync('businessId'),
            data: [{...data}]
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: Get Staff API")
        throw e.response;
    }
}

export default createStaffAPI;