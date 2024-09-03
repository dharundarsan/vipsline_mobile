import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";

const initialClientState = {
    listOfBusinesses: [],
    isFetching: false,
    selectedBusiness: {},

};

export const loadBusinessesListFromDb = () => async (dispatch) => {
    let response = "";
    try {
        response = await axios.get(
            process.env.EXPO_PUBLIC_API_URI + '/business/owner',
            {
                headers: {
                    authorization: "Bearer " + process.env.EXPO_PUBLIC_AUTH_KEY
                }
            }
        );
        dispatch(updateListOfBusinesses(response.data.data));

    }
    catch (e) {
        console.error(e);
    }
};

export const listOfBusinessSlice = createSlice({
    name: "businesses",
    initialState: initialClientState,
    reducers: {
        updateListOfBusinesses(state, action) {
            state.listOfBusinesses = action.payload;
        },
        updateSelectedBusinessDetails(state, action) {
            state.selectedBusiness = action.payload;
        },
        updateBusinessNotificationDetails(state, action) {
            state.selectedBusiness = {...state.selectedBusiness, ...action.payload};
        }

        }
    });

    export const {
        updateListOfBusinesses,
    updateSelectedBusinessDetails,
    updateBusinessNotificationDetails
} = listOfBusinessSlice.actions;

export default listOfBusinessSlice.reducer;
