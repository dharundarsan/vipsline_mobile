import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function updateGreetingsAPI(props) {
    try {
        const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/updateGreetings`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            ...props
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: update greetings API")
        return e.response;
    }
}