import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";

export default async function updateAPI(bookingId, mode_of_payment, splitUpState) {
    let authToken = "";
    let businessId = "";

    try {
        authToken = await AsyncStorage.getItem('authKey') || "";
        businessId = await AsyncStorage.getItem('businessId') || "";
    } catch (e) {
        console.error("Error fetching from AsyncStorage:", e);
        throw e; // Ensure that the error is propagated
    }

    let data;
    switch (mode_of_payment) {
        case "cash":
            data = { status: "paid_at_venue", bookingId: bookingId, mode_of_payment: "CASH", transactionId: "" };
            break;
        case "split_payment":
            data = {
                bookingId: bookingId,
                mode_of_payment: "SPLIT",
                prepaid_wallet_details: null,
                split_payments: splitUpState.filter(state => state.shown).map(state => ({
                    mode_of_payment: state.mode.toUpperCase(),
                    amount: state.amount
                })),
                status: "paid_at_venue",
                transactionId: ""
            };
            break;
        case "card":
            data = { status: "paid_at_venue", booking_id: bookingId, mode_of_payment: "CARD", transactionId: "" };
            break;
        case "digital payments":
            data = { status: "paid_at_venue", booking_id: bookingId, mode_of_payment: "DIGITAL PAYMENTS", transactionId: "" };
            break;
        case "prepaid":
            // Handle prepaid payment logic if necessary
            break;
        default:
            throw new Error("Unknown payment mode");
    }

    try {
        await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/appointment/bookingPayment/update`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            }
        );
        ToastAndroid.show("updated successfully!", ToastAndroid.LONG);
    } catch (error) {
        console.error("Error during updateAPI call:", error);
        ToastAndroid.show("not updated successfully!", ToastAndroid.LONG);
        throw error; // Ensure that the error is propagated
    }
}
