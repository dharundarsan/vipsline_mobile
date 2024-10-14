import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import {useSelector} from "react-redux";
import * as SecureStore from 'expo-secure-store';

const initialBusinessDetailState = {
    detail:[]
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

export const loadBusinessDetail = () => async (dispatch) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clientSlice loadClientFromDb)" + e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/business/detail`,
            {
                business_id: await getBusinessId(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateDetail(response.data.data));
    } catch (error) {
        console.error("Error on business detail api")
    }
};

export const businessDetailSlice = createSlice({
    name: "businessDetail",
    initialState: initialBusinessDetailState,
    reducers: {
        updateDetail(state, action) {
            state.detail = action.payload;
        },
    }
});

export const {updateDetail} = businessDetailSlice.actions;

export default businessDetailSlice.reducer;
