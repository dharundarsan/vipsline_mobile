import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const createBusinessClosedDatesAPI = async (name, start_date, end_date) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/createBusinessHoliday", {
            business_id: await SecureStore.getItemAsync('businessId'),
            name: name,
            start_date: start_date,
            end_date: end_date
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: add business closed dates API")
        return e.response;
    }
}

export default createBusinessClosedDatesAPI;