import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function updateLiveStatusAPI(bookingId) {

    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside update updatelivestatus api)" + e);
    }

    const api = process.env.EXPO_PUBLIC_API_URI + "/appointment/updateLiveStatusUsingBookingId";
    try {
        const response = await axios.post(api,
            {
                booking_id: bookingId,
                status: "COMPLETED"
            },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

    } catch (e) {
            }
}