import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../../util/Helpers";

const checkStaffAvailability = async (data) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + `/calendarBookings/checkStaffAvailabilityByDateAndTime`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            ...data
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: Check staff availability API")
        throw e.response;
    }
}

export default checkStaffAvailability;