import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function deleteClientAPI(clientId) {

    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
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