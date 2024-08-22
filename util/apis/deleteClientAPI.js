import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import {ToastAndroid} from "react-native";

export default async function deleteClientAPI(clientId) {
    const showToast = () => {
        ToastAndroid.show('Client deleted successfully', ToastAndroid.SHORT);
    };

    try {
        const response = await axios.put(
            process.env.EXPO_PUBLIC_API_URI + "/client/deleteClient",
            {
                client_id: clientId,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        )
        // console.log(response.data.message);
        if(response.data.message === "Client deleted ") {
            showToast();
        }
    }
    catch (error) {
        console.log(error);
    }
}