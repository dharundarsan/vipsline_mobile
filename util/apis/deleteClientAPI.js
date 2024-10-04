import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import * as SecureStore from 'expo-secure-store';

export default async function deleteClientAPI(clientId) {

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error.(inside deleteClientAPI)" + e);
    }

    try {
        const response = await axios.put(
            process.env.EXPO_PUBLIC_API_URI + "/client/deleteClient",
            {
                client_id: clientId,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        if (response.data.message === "Client deleted ") {
        }
    } catch (error) {
    }
}