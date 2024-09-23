import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

export default async function cancelInvoiceAPI(status, bookingId) {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. inside cancelInvoiceAPI()" + e);
    }



    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/appointment/cancelInvoice`,
            {
                bookingCancelStatus: status,
                bookingCancelledBy: "Business",
                bookingId: bookingId,
            },
            {
                headers: {
                    Authorization: "Bearer " + authToken,
                }
            }
        );

        // ToastAndroid.show("Invoice Cancelled successfully!", ToastAndroid.LONG);
        Toast.show("Invoice Cancelled Succuessfully",{
            duration:Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow:false,
            backgroundColor:"black",
            opacity:1
        })
    } catch (error) {
                // ToastAndroid.show("Failed to cancel Invoice", ToastAndroid.LONG);
        Toast.show("Falied To Cancel Invoice",{
            duration:Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow:false,
            backgroundColor:"black",
            opacity:1
        })
    }
}
