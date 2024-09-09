import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

    export default async function updateClientAPI(clientId, data) {

        let authToken = ""
        try {
            const value = await AsyncStorage.getItem('authKey');
            if (value !== null) {
                authToken = value;
            }
        } catch (e) {
            console.log("auth token fetching error. (inside update client api)" + e);
        }

        const api = process.env.EXPO_PUBLIC_API_URI + "/client/editClient";
        // console.log(data);
        // console.log("clientId: "+clientId);
        try {
            const response = await axios.put(api,
                {
                    client_id: clientId,
                    data: data
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

            // console.log(response.data)
        } catch (e) {
            // throw e.response.data.other_message;
            // console.log(e.response.data);
        }
}