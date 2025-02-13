import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const updateTimeOffRequestAPI = async (resource_id, start_date, end_date, start_time, end_time, time_off_id, time_off_request_id, reason, type) => {
    try {
        const response = await axios.put(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/updateTimeOffRequest", {
            business_id:  await SecureStore.getItemAsync('businessId'),
            resource_id: resource_id,
            start_date: start_date,
            end_date: type === "permission" ? start_date : end_date,
            start_time: type === "permission" ? start_time : "",
            end_time: type === "permission" ? end_time : "",
            time_off_type_id: time_off_id,
            time_off_request_id: time_off_request_id,
            reason: reason
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: create time off request API")
        return e.response;
    }
}

export default updateTimeOffRequestAPI;