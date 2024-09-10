import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import {clearSalesNotes, loadCartFromDB} from "../../store/cartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function clearCartAPI() {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clearCartAPI)" + e);
    }

    let businessId = ""
    try {
        const value = await AsyncStorage.getItem('businessId');
        if (value !== null) {
            businessId = value;
        }
    } catch (e) {
        console.log("businessId fetching error. (inside clearCartAPI)" + e);
    }


    const api = process.env.EXPO_PUBLIC_API_URI + "/cart/clearCart2ByUser";
    try {
        const response = await axios.post(api,
            {
                business_id: businessId
            },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });


    } catch (e) {
        // throw e.response.data.other_message;
    }
}