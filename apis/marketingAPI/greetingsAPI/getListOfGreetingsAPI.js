import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getListOfGreetingsAPI() {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/getListOfGreetings`, {
            business_id: await SecureStore.getItemAsync('businessId'),
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: get List Of Service Reminders API")
        throw e.response;
    }
}