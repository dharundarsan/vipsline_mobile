import axios from "axios";
import * as SecureStore from "expo-secure-store";


export default async function createServiceReminderAPI(props) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/createServiceReminder`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            ...props
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: create service reminder API")
        return  e.response;
    }
}