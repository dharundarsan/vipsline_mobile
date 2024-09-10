import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialClientState = {
    listOfBusinesses: [],
    isFetching: false,
    selectedBusiness: {},
    isBusinessSelected: false,

};

export const loadBusinessesListFromDb = () => async (dispatch) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside listOfBusinessSlice loadBusinessListFromDb)" + e);
    }


    let response = "";
    try {
        response = await axios.get(
            process.env.EXPO_PUBLIC_API_URI + '/business/owner',
            {
                headers: {
                    authorization: "Bearer " + authToken
                }
            }
        );
                 dispatch(updateListOfBusinesses(response.data.data));

    } catch (e) {
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
        },
        updateIsBusinessSelected(state, action) {
            state.isBusinessSelected = action.payload;
        }
    }
});

export const {
    updateListOfBusinesses,
    updateSelectedBusinessDetails,
    updateBusinessNotificationDetails,
    updateIsBusinessSelected,
} = listOfBusinessSlice.actions;

export default listOfBusinessSlice.reducer;
