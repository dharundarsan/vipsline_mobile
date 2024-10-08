import axios from "axios";
import { ToastAndroid } from "react-native";
import * as SecureStore from 'expo-secure-store';

export default async function sendSMSAPI(name, mobile) {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside sms)" + e);
    }

    let businessId = ""
    try {
        // const value = await AsyncStorage.getItem('businessId');
        const value = await SecureStore.getItemAsync('businessId');
        if (value !== null) {
            businessId = value;
        }
    } catch (e) {
        console.log("businessID fetching error. ((inside sms))" + e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/appointment/sendInvoiceLink`,
            {
                business_id: businessId,
                booking_id: "2e54d6dd-3fd4-4962-b481-b801c8e0c53c",
                user_mobile: mobile,
                name: name
            },
            {
                headers: {
                    Authorization: "Bearer " + authToken,
                }
            }
        );

        // ToastAndroid.show("SMS send successfully!", ToastAndroid.LONG);
        // TODO

        // Toast.show("SMS Send Successfully",{
        //     duration:Toast.durations.LONG,
        //     position: Toast.positions.BOTTOM,
        //     shadow:false,
        //     backgroundColor:"black",
        //     opacity:1
        // })
        return "SMS sent successfully!"
    } catch (error) {
        // ToastAndroid.show("Failed to send SMS.", ToastAndroid.LONG);
        // TODO

        // Toast.show("Failed To Send SMS",{
        //     duration:Toast.durations.LONG,
        //     position: Toast.positions.BOTTOM,
        //     shadow:false,
        //     backgroundColor:"black",
        //     opacity:1
        // })
        return "Failed to send SMS."
    }
}
