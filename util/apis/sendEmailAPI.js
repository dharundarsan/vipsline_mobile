import axios from "axios";
import { ToastAndroid } from "react-native";
// import Toast from "react-native-root-toast";
import * as SecureStore from 'expo-secure-store';

export default async function sendEmailAPI(email, bookingId) {

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside send email api)" + e);
    }

    let businessId = ""
    try {
        // const value = await AsyncStorage.getItem('businessId');
        const value = await SecureStore.getItemAsync('businessId');
        if (value !== null) {
            businessId = value;
        }
    } catch (e) {
        console.log("businessId fetching error. (inside send email api)" + e);
    }


    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/appointment/sendInvoice`,
            {
                business_id: businessId,
                booking_id: bookingId,
                user_mail: email.trim(),
            },
            {
                headers: {
                    Authorization: "Bearer " + authToken,
                }
            }
        );

        return "success";

        // ToastAndroid.show("Email sent successfully!", ToastAndroid.LONG);
    } catch (error) {
                ToastAndroid.show("Failed to send email.", ToastAndroid.LONG);
    }
}
