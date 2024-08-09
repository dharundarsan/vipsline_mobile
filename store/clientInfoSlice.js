import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";

const initialClientInfoState = {
    isClientSelected: false,
    details: {},
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
        console.error("Error fetching data: " + error);
    }
};

export const clientInfoSlice = createSlice({
    name: "clientInfo",
    initialState: initialClientInfoState,
    reducers: {
        setDetails(state, action) {
            state.isClientSelected = true;
            state.details = action.payload;
        },
        clearClientInfo(state, action) {
            state = initialClientInfoState;
        }
    }
});

export const {setDetails, clearClientInfo} = clientInfoSlice.actions;

export default clientInfoSlice.reducer;
