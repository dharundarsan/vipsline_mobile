import axios from "axios";
import { ToastAndroid } from "react-native";

export default async function cancelInvoiceAPI(status, bookingId) {
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
                    Authorization: "Bearer " + process.env.EXPO_PUBLIC_AUTH_KEY,
                }
            }
        );

        ToastAndroid.show("Invoice Cancelled successfully!", ToastAndroid.LONG);
    } catch (error) {
        console.log(error);
        ToastAndroid.show("Failed to cancel Invoice", ToastAndroid.LONG);
    }
}
