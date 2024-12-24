import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY} from "@env";
import * as SecureStore from 'expo-secure-store';

export default async function getDiscountAPI(data) {

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside getDiscountAPI)" + e);
    }



    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/cart/getDiscountAmount",
            data,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        )
        return(response.data.data[0].percent_amount);
    } catch (error) {
            }
}