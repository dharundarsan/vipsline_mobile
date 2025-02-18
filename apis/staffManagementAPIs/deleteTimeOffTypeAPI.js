import axios from "axios";
import * as SecureStore from 'expo-secure-store';

export const deleteTimeOffTypeAPI = async (id) => {

    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/deleteTimeOffType", {
            business_id: await SecureStore.getItemAsync('businessId'),
            timeOffTypeId: id
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: delete time off type API")
        return e.response;

    }
}
