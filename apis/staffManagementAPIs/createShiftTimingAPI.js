import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const CreateShiftTimingAPI = async (name, start_time, end_time) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/createShiftTimings", {
            business_id: await SecureStore.getItemAsync('businessId'),
            name: name,
            start_time: start_time,
            end_time: end_time
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: Get Shift Timing API")
        return e.response;
    }
}

export default CreateShiftTimingAPI;