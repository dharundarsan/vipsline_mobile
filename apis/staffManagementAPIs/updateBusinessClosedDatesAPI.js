import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const updateBusinessClosedDatesAPI = async (id, name, start_date, end_date) => {
    try {
        const response = await axios.put(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/updateBusinessHoliday", {
            business_id: await SecureStore.getItemAsync('businessId'),
            start_date: start_date,
            end_date: end_date,
            business_holiday_id: id,
            name: name === "notChanged" ? undefined : name,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: update business closed dates API")
        return e.response;
    }
}

export default updateBusinessClosedDatesAPI;