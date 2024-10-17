import axios from "axios";
import * as SecureStore from 'expo-secure-store';

export default async function updateAPI(response, mode_of_payment, splitUpState, clientInfo) {
    let authToken = "";
    let businessId = "";
    try {
        // authToken = await AsyncStorage.getItem('authKey') || "";
        authToken = await SecureStore.getItemAsync('authKey') || "";
        // businessId = await AsyncStorage.getItem('businessId') || "";
        businessId = await SecureStore.getItemAsync('businessId') || "";
    } catch (e) {
        console.error("Error fetching from AsyncStorage:", e);
        throw e; // Ensure that the error is propagated
    }
    // const prepaid_wallet_details = response.prepaid_wallet_details !== undefined || Object.keys(response.prepaid_wallet_details).length !== 0 ? response.prepaid_wallet_details : undefined;
    let data;
    switch (mode_of_payment) {
        case "cash":
            data = {
                status: "paid_at_venue", bookingId: response.booking_id, mode_of_payment: "CASH", transactionId: "",
                prepaid_wallet_details: Object.keys(response.prepaid_wallet_details).length !== 0 ? response.prepaid_wallet_details : undefined
            };
            break;
        case "split_payment":
            data = {
                bookingId: response.booking_id,
                mode_of_payment: "SPLIT",
                // prepaid_wallet_details: null,
                split_payments: splitUpState.filter(state => state.shown).map(state => ({
                    mode_of_payment: state.mode.toUpperCase(),
                    amount: state.amount
                })),
                status: "paid_at_venue",
                transactionId: "",
                prepaid_wallet_details: null
            };
            break;
        case "card":
            data = {
                status: "paid_at_venue", bookingId: response.booking_id, mode_of_payment: "CARD", transactionId: "",
                prepaid_wallet_details: Object.keys(response.prepaid_wallet_details).length !== 0 ? response.prepaid_wallet_details : undefined
            };
            break;
        case "digital payments":
            data = {
                status: "paid_at_venue",
                bookingId: response.booking_id,
                mode_of_payment: "DIGITAL PAYMENTS",
                transactionId: "",
                prepaid_wallet_details: Object.keys(response.prepaid_wallet_details).length !== 0 ? response.prepaid_wallet_details : undefined
            };
            break;
        case "prepaid":
            data = {
                status: "paid_at_venue", bookingId: response.booking_id, mode_of_payment: "PREPAID", transactionId: "",
                prepaid_wallet_details: Object.keys(response.prepaid_wallet_details).length !== 0 ? response.prepaid_wallet_details : undefined,
                wallet_id: clientInfo.wallet_id
            };
            break;
        case "NIL":
            data = {
                status: "paid_at_venue",
                bookingId: response.booking_id,
                mode_of_payment: "NIL",
                transactionId: "",
                prepaid_wallet_details: Object.keys(response.prepaid_wallet_details).length !== 0 ? response.prepaid_wallet_details : undefined,
                wallet_id: clientInfo.wallet_id
            };
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
        // ToastAndroid.show("updated successfully!", ToastAndroid.LONG);
        // TODO

        // Toast.show("Updated Successfully", {
        //     duration: Toast.durations.LONG,
        //     position: Toast.positions.BOTTOM,
        //     shadow: false,
        //     backgroundColor: "black",
        //     opacity: 1
        // })
    } catch (error) {
        console.error("Error during updateAPI call:", error);
        // ToastAndroid.show("not updated successfully!", ToastAndroid.LONG);
        // TODO

        // Toast.show("Not Updated Successfully", {
        //     duration: Toast.durations.LONG,
        //     position: Toast.positions.BOTTOM,
        //     shadow: false,
        //     backgroundColor: "black",
        //     opacity: 1
        // })
        throw error; // Ensure that the error is propagated
    }
}
