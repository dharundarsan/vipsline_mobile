import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const updateShiftTimingAPI = async (id, name, start_time, end_time) => {
    try {
        const response = await axios.put(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/update", {
            business_id: await SecureStore.getItemAsync('businessId'),
            start_time: start_time,
            end_time: end_time,
            shift_id: id,
            name: name === "notChanged" ? undefined : name,
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

export default updateShiftTimingAPI;