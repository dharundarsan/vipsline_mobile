import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const updateTimeOffTypeAPI = async (id, name, type) => {
    try {
        const response = await axios.put(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/updateTimeOffType", {
            business_id: await SecureStore.getItemAsync('businessId'),
            timeOffTypeId: id,
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
        console.log("Error: update Shift Timing API")
        return e.response;
    }
}

export default updateTimeOffTypeAPI;