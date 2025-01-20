import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import * as SecureStore from 'expo-secure-store';

import moment from "moment";
import getFutureBookingsAPI from "../apis/appointmentsAPIs/getFutureBookingsAPI";
import getHistoryBookingsAPI from "../apis/appointmentsAPIs/getBookingsHistoryFromDB";

export const loadFutureBookingsFromDB = () => async (dispatch, getState) => {
    const {appointments} = getState();
    const response = await getFutureBookingsAPI(appointments.futureBookingsPageNo,
        appointments.futureBookingsMaxEntry,
        {
            fromDate: "2025-01-16",
            resource_id: "",
            toDate: "2025-01-16"
        })
    dispatch(updateFutureBookingsList(response.data.data))
    dispatch(updateFutureBookingsCount(response.data.data[0].total_bookings))
    return response;
}

export const loadBookingsHistoryFromDB = () => async (dispatch, getState) => {
    const {appointments} = getState();
    dispatch(updateBookingsHistoryFetchingState(true))
    const response = await getHistoryBookingsAPI(appointments.bookingsHistoryPageNo,
        appointments.bookingsHistoryMaxEntry,
        {
            fromDate: "2025-01-07",
            resource_id: "",
            toDate: "2025-01-07",
        })
    dispatch(updateBookingsHistoryList(response.data.data))
    dispatch(updateBookingsHistoryCount(response.data.data[0].total_bookings))
    dispatch(updateBookingsHistoryFetchingState(false))
    return response;
}


export const initialAppointmentsState = {
    futureBookings: [],
    futureBookingsPageNo: 0,
    futureBookingsMaxEntry: 10,
    futureBookingsCount: 0,
    futureBookingsIsFetching: false,
    futureBookingsFilterDate: new Date(),

    bookingsHistory: [],
    bookingsHistoryPageNo: 0,
    bookingsHistoryMaxEntry: 10,
    bookingsHistoryCount: 0,
    bookingsHistoryIsFetching: false,
    bookingsHistoryFilterDate: new Date(),
};

export const appointmentsSlice = createSlice({
    name: "appointments",
    initialState: initialAppointmentsState,
    reducers: {
        updateFutureBookingsList(state, action) {
            state.futureBookings = action.payload;
        },
        updateFutureBookingsCount(state, action) {
            state.futureBookingsCount = action.payload;
        },
        updateFutureBookingsFetchingState(state, action) {
            state.futureBookingsIsFetching = action.payload;
        },
        updateFutureBookingsMaxEntry(state, action) {
            state.futureBookingsMaxEntry = action.payload;
        },
        resetFutureBookingsMaxEntry(state, action) {
            state.futureBookingsMaxEntry = 10;
        },
        incrementFutureBookingsPageNumber(state, action) {
            state.futureBookingsPageNo++;
        },
        resetFutureBookingsPageNo(state, action) {
            state.futureBookingsPageNo = 0;
        },
        decrementFutureBookingsPageNumber(state, action) {
            const page_no = state.futureBookingsPageNo - 1;
            if (page_no < 0) {
                state.futureBookingsPageNo = 0;
            } else {
                state.futureBookingsPageNo--;
            }
        },
        setFutureBookingsFilterDate(state, action) {
            state.futureBookingsFilterDate = action.payload;
        },

        updateBookingsHistoryList(state, action) {
            state.bookingsHistory = action.payload;
        },
        updateBookingsHistoryCount(state, action) {
            state.bookingsHistoryCount = action.payload;
        },
        updateBookingsHistoryFetchingState(state, action) {
            state.bookingsHistoryIsFetching = action.payload;
        },
        updateBookingsHistoryMaxEntry(state, action) {
            state.bookingsHistoryMaxEntry = action.payload;
        },
        resetBookingsHistoryMaxEntry(state, action) {
            state.bookingsHistoryMaxEntry = 10;
        },
        incrementBookingsHistoryPageNumber(state, action) {
            state.bookingsHistoryMaxEntry++;
        },
        resetBookingsHistoryPageNo(state, action) {
            state.bookingsHistoryMaxEntry = 0;
        },
        decrementBookingsHistoryPageNumber(state, action) {
            const page_no = state.bookingsHistoryMaxEntry - 1;
            if (page_no < 0) {
                state.bookingsHistoryMaxEntry = 0;
            } else {
                state.bookingsHistoryMaxEntry--;
            }
        },
        setBookingsHistoryFilterDate(state, action) {
            state.bookingsHistoryFilterDate = action.payload;
        },
    }
});

export const {
    updateFutureBookingsMaxEntry,
    updateFutureBookingsFetchingState,
    decrementFutureBookingsPageNumber,
    incrementFutureBookingsPageNumber,
    resetFutureBookingsMaxEntry,
    resetFutureBookingsPageNo,
    updateFutureBookingsList,
    updateFutureBookingsCount,
    setFutureBookingsFilterDate,

    updateBookingsHistoryList,
    updateBookingsHistoryCount,
    updateBookingsHistoryFetchingState,
    updateBookingsHistoryMaxEntry,
    resetBookingsHistoryMaxEntry,
    incrementBookingsHistoryPageNumber,
    resetBookingsHistoryPageNo,
    decrementBookingsHistoryPageNumber,
    setBookingsHistoryFilterDate
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
