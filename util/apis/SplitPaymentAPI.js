import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default async function splitPaymentAPI(data) {

    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside payment api)" + e);
    }



    // console.log("DATA")
    // console.log(data)
    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/appointment/getDifferenceInAmount",
            data,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        )
        console.log("API")
        console.log(response.data.data)
        return(response.data.data)
    } catch (error) {
        console.log("sendOtp error: " + error.response.message);
    }
}