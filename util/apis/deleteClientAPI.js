import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import {ToastAndroid} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

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

    const showToast = () => {
        // ToastAndroid.show('Client deleted successfully', ToastAndroid.SHORT);
        Toast.show("Client Deleted Successfully",{
            duration:Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow:false,
            backgroundColor:"black",
            opacity:1
        })
    };

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
            showToast();
        }
    } catch (error) {
    }
}