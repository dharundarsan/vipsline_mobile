import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const deleteTimeOffRequestAPI = async (id) => {

    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/deleteTimeOffRequest", {
            business_id: await SecureStore.getItemAsync('businessId'),
            time_off_request_id: id
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: delete time off request API")
        return e.response;

    }
}

export default deleteTimeOffRequestAPI;