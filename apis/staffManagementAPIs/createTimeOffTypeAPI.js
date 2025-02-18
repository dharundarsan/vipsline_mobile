import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const createTimeOffTypeAPI = async (name, type) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/createTimeOffType", {
            business_id: await SecureStore.getItemAsync('businessId'),
            name: name,
            type: type
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: create time off type API")
        return e.response;
    }
}

export default createTimeOffTypeAPI;