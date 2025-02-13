import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../../util/Helpers";

const getRegularShiftsAPI = async (resource_id) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/getStaffSchedulePattern", {
            business_id: await SecureStore.getItemAsync('businessId'),
            resource_id: resource_id,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Get REGULAR SHIFTS List API")
        return e.response;
    }
}

export default getRegularShiftsAPI;