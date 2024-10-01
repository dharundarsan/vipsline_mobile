import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import * as SecureStore from 'expo-secure-store';

const initialClientState = {
    listOfBusinesses: [],
    isFetching: false,
    selectedBusiness: {},
    isBusinessSelected: false,
    businessNotificationDetails:{}
};

export const loadBusinessesListFromDb = () => async (dispatch) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.error("auth token fetching error. (inside listOfBusinessSlice loadBusinessListFromDb)" + e);
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
export const loadBusinessNotificationDetails = () => async(dispatch,getState) => {
    const {authDetails} = getState();
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.error("auth token fetching error. (inside listOfBusinessSlice loadBusinessListFromDb)" + e);
    }
    
    await axios.post(process.env.EXPO_PUBLIC_API_URI+'/business/getBusinessNotificationDetails',{
        business_id: authDetails.businessId
    },
        {
            headers:{
                authorization: "Bearer " + authToken
            }
        }
    ).then(res => {
        dispatch(updateBusinessNotificationDetails(res.data));
    }).catch (error => {
        console.error("Error Fetching Business Notification Details. "+error);
    })

}
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
        // updateBusinessNotificationDetails(state, action) {
        //     state.selectedBusiness = {...state.selectedBusiness, ...action.payload};
        // },
        updateIsBusinessSelected(state, action) {
            state.isBusinessSelected = action.payload;
        },
        clearListOfBusiness(state,action) {
            state.listOfBusinesses = [],
            state.isBusinessSelected = [],
            state.isFetching = false,
            state.selectedBusiness = {},
            state.isBusinessSelected = false
        },
        updateBusinessNotificationDetails(state,action){
            state.businessNotificationDetails = action.payload;
        },
    }
});

export const {
    updateListOfBusinesses,
    updateSelectedBusinessDetails,
    updateBusinessNotificationDetails,
    updateIsBusinessSelected,
    clearListOfBusiness,
} = listOfBusinessSlice.actions;

export default listOfBusinessSlice.reducer;
