import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    details: {},
    isFetching: false,
    booking_id1: "",
};


async function getBusinessId() {
    let businessId = ""
    try {
        const value = await AsyncStorage.getItem('businessId');
        if (value !== null) {
            return value;
        }
    } catch (e) {
        console.log("business token fetching error." + e);
    }
}


export const loadBookingDetailsFromDb = (bookingId) => async (dispatch, getState) => {
    const { invoice } = getState();
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
        throw e; // Ensure that the error is propagated
    }

    try {
        const response1 = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + '/appointment/invoice',
            {
                business_id: await getBusinessId(),
                booking_id: bookingId
            }
        );
        dispatch(updateMoreInvoiceDetails(response1.data.data[0]));
    } catch (e) {
        console.error("Error fetching invoice details:", e);
        // Handle errors if necessary
    }
};

export const loadWalletPriceFromDb = (clientId) => async (dispatch) => {

    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
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
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }

        );

        dispatch(updateWalletBalance(response.data.data[0]));

    }
    catch (e) {
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
            state.details = {...state.details, ...action.payload};
        },
        updateWalletBalance(state, action) {
            state.details = {...state.details, ...action.payload};
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
