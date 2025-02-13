import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const updateShiftForTheDayAPI = async (resource_id, date, id) => {
    try {
        const response = await axios.put(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/updateShiftsForTheDay", {
            business_id: await SecureStore.getItemAsync('businessId'),
            resource_id: resource_id,
            date: date,
            shiftIds: id,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: update shift for the day API")
        return e.response;
    }
}

export default updateShiftForTheDayAPI;