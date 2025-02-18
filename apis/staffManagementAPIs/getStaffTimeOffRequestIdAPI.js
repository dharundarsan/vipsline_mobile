import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const getTimeOffRequestIdAPI = async (time_off_id) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/getStaffTimeOffReqById", {
            business_id:  await SecureStore.getItemAsync('businessId'),
            time_off_req_id: time_off_id,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: get time off request API")
        return e.response;
    }
}

export default getTimeOffRequestIdAPI;