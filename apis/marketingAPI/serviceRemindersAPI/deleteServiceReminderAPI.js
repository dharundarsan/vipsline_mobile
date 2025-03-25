import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function deleteServiceReminderAPI(id) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/deleteServiceReminder`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            id: id
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: delete service reminder API")
        return e.response;
    }
}