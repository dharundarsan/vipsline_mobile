import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import * as SecureStore from 'expo-secure-store';

const initialState = {
    details: {},
    isFetching: false,
    booking_id1: "",
    invoiceDetails: {},
    walletBalance: {},
};


async function getBusinessId() {
    let businessId = ""
    try {
        // const value = await AsyncStorage.getItem('businessId');
        const value = await SecureStore.getItemAsync('businessId');
        if (value !== null) {
            return value;
        }
    } catch (e) {
    }
}


export const loadBookingDetailsFromDb = (bookingId) => async (dispatch, getState) => {
    const {invoice} = getState();
    let response;

    try {
        response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + '/appointment/getPaidBookingDetails',
            {
                business_id: await getBusinessId(),
                booking_id: bookingId
            }
        );
        dispatch(updateInvoiceDetails(response.data.data[0]));
    } catch (e) {
        console.error("Error fetching booking details:", e);
        throw e;
    }
};

export const loadInvoiceDetailsFromDb = (bookingId) => async (dispatch, getState) => {
    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + '/appointment/invoice',
            {
                business_id: await getBusinessId(),
                booking_id: bookingId
            }
        );
        dispatch(updateMoreInvoiceDetails(response.data.data[0]));
    } catch (e) {
        console.error("Error fetching invoice details:", e);
        throw e;
    }

};

export const loadWalletPriceFromDb = (clientId) => async (dispatch) => {

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside invoiceSlice loadWalletPriceFromDb)" + e);
    }

    let response = "";
    try {
        response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + '/wallet/getWalletBalanceForClient',
            {
                business_id: await getBusinessId(),
                client_id: clientId,

            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        if(response.data.message === "Something went wrong") {
            dispatch(updateWalletBalance({wallet_balance: 0}));
        }
        else {
            dispatch(updateWalletBalance(response.data.data[0]));
        }

    } catch (e) {
        // console.error(e + " wallet error");
    }
}


export const invoiceSlice = createSlice({
    name: "invoice",
    initialState: initialState,
    reducers: {
        updateInvoiceDetails(state, action) {
            state.details = action.payload;
        },
        updateMoreInvoiceDetails(state, action) {
            state.invoiceDetails = action.payload;
        },
        updateWalletBalance(state, action) {
            state.walletBalance = action.payload;
        },
        updateBookingId(state, action) {
            state.booking_id1 = action.payload;
        }

    }
});

export const {
    updateInvoiceDetails,
    updateMoreInvoiceDetails,
    updateWalletBalance,
    updateBookingId
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
