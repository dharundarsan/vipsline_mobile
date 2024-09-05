import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";

const initialState = {
    details: {},
    isFetching: false,
};

export const loadBookingDetailsFromDb = () => async (dispatch) => {
    let response = "";
    try {
        response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + '/appointment/getPaidBookingDetails',
            {

            business_id: "2db7d255-7797-4cce-9590-fc59d2019577",
            booking_id: "2e54d6dd-3fd4-4962-b481-b801c8e0c53c"

            },

        );

        dispatch(updateInvoiceDetails(response.data.data[0]));

    }
    catch (e) {
        console.error(e);
    }

    let response1 = "";
    try {
        response1 = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + '/appointment/invoice',
            {

            business_id: "2db7d255-7797-4cce-9590-fc59d2019577",
            booking_id: "2e54d6dd-3fd4-4962-b481-b801c8e0c53c"

            },

        );

        dispatch(updateMoreInvoiceDetails(response1.data.data[0]));

    }
    catch (e) {
        console.error(e);
    }


};

export const loadWalletPriceFromDb = (clientId) => async (dispatch) => {
    let response = "";
    try {
        response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + '/wallet/getWalletBalanceForClient',
            {
                business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
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
        console.error(e + "wallet error");
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

    }
});

export const {
    updateInvoiceDetails,
    updateMoreInvoiceDetails,
    updateWalletBalance
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
