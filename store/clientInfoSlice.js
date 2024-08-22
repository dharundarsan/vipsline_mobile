import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";

const initialClientInfoState = {
    isClientSelected: false,
    details: {},

    fetchingAnalytics: false,
    analyticDetails: [],

    clientId: "",
};

export const loadClientInfoFromDb = (clientId) => async (dispatch) => {
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/business/getClientDetailById`,
            {
                client_id: clientId,
                business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );
        dispatch(setDetails(response.data.data[0]));
    } catch (error) {
        console.error("Error fetching data client info slice: " + error);
    }
};

export const loadAnalyticsClientDetailsFromDb = (pageSize, pageNo, user_id) => async (dispatch, getState) => {
    // const {clientFilter} = getState();
    // if(clientFilter.fetchingAnalytics) return;

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getAnalyticsForBusinessByCustomer?pageSize=${pageSize}&pageNo=${pageNo}`,
            {
                business_id: `${process.env.EXPO_PUBLIC_BUSINESS_ID}`,
                user_id: user_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );

        dispatch(updateAnalyticDetails(response.data.data[0]));
    }
    catch (e) {
        console.log(e);
    }

    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/analytics/getFeedbackByClient?pageNo=0&pageSize=100",
            {
                business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
                client_id: user_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`,
                }
            }
        );
        // console.log(response.data.data[0].no_of_feedbacks);
        dispatch(updateFeedback(response.data.data[0].no_of_feedbacks));
    }
    catch (e) {
        console.log(e);
    }

}

export const clientInfoSlice = createSlice({
    name: "clientInfo",
    initialState: initialClientInfoState,
    reducers: {
        setDetails(state, action) {
            state.isClientSelected = true;
            state.details = action.payload;
        },
        clearClientInfo(state, action) {
            state.details = initialClientInfoState;
        },
        updateAnalyticDetails(state, action) {
            state.analyticDetails = action.payload;
        },
        updateFeedback(state, action) {
            state.analyticDetails["feedbacks"] = action.payload;
        },
        updateClientId(state, action) {
            state.clientId = action.payload;
        }
    }
});



export const {
    setDetails,
    clearClientInfo,
    updateAnalyticDetails,
    updateFeedback,
    updateClientId
} = clientInfoSlice.actions;

export default clientInfoSlice.reducer;
