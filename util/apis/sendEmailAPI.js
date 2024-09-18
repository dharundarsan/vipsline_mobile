import axios from "axios";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

export default async function sendEmailAPI(email, bookingId) {

    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside send email api)" + e);
    }

    let businessId = ""
    try {
        const value = await AsyncStorage.getItem('businessId');
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

        // ToastAndroid.show("Email sent successfully!", ToastAndroid.LONG);
        Toast.show("Email Sent Successfully",{
            duration:Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow:false,
            backgroundColor:"black",
            opacity:1
        })
    } catch (error) {
        // ToastAndroid.show("Failed to send email.", ToastAndroid.LONG);
        Toast.show("Failed To Send Email",{
            duration:Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow:false,
            backgroundColor:"black",
            opacity:1
        })
    }
}
