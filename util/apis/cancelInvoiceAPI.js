import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

        return "Invoice Cancelled successfully!";

        // ToastAndroid.show("Invoice Cancelled successfully!", ToastAndroid.LONG);
        // TODO

        // Toast.show("Invoice Cancelled Succuessfully", {
        //     duration: Toast.durations.LONG,
        //     position: Toast.positions.BOTTOM,
        //     shadow: false,
        //     backgroundColor: "black",
        //     opacity: 1
        // })
    } catch (error) {
        return "Failed to cancel Invoice";
        // ToastAndroid.show("Failed to cancel Invoice", ToastAndroid.LONG);
        // TODO

        // Toast.show("Falied To Cancel Invoice", {
        //     duration: Toast.durations.LONG,
        //     position: Toast.positions.BOTTOM,
        //     shadow: false,
        //     backgroundColor: "black",
        //     opacity: 1
        // })
    }
}
