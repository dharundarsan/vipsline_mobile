import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function createGreetingsAPI(props) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/createGreetings`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            ...props
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: create greetings API")
        return e.response;
    }
}