import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {loadCartFromDB} from "./cartSlice";
import * as SecureStore from 'expo-secure-store';

const initialStaffState = {
    staffs: [],
    allServices: [],
    isFetching: false,
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

export const loadStaffsFromDB = () => async (dispatch, getState) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside staffSlice loadStaffsFromDb)" + e);
    }


    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/resource/getByBusiness`,
            {
                business_id: `${await getBusinessId()}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateStaffs(response.data.data));
    } catch (error) {
    }
}

export const updateCartItemStaff = (res_list) => async (dispatch, getState) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside staffSLice updateCartItemsStaff)" + e);
    }

    try {
        const response = await axios.put(
            `${process.env.EXPO_PUBLIC_API_URI}/cart/updateMultipleResourceInCart2`,
            {
                business_id: `${await getBusinessId()}`,
                res_list: res_list

            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(loadCartFromDB());
    } catch (error) {
    }
}

export const getAllServicesFromDb = (resource_id) => async (dispatch, getState) => {
    const {staff} = getState();

    console.log(1)
    if(staff.isFetching) return;

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside staffSlice loadServices)" + e);
    }


    try {
        dispatch(updateIsFetching(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/resource/getAllResourceDetails`,
            {
                business_id: `${await getBusinessId()}`,
                resource_id: resource_id
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateAllServices(response.data.data[0]));
        dispatch(updateIsFetching(false));
    } catch (error) {
        dispatch(updateIsFetching(false));
    }
}

export const staffSlice = createSlice({
    name: "staffs",
    initialState: initialStaffState,
    reducers: {
        updateStaffs(state, action) {
            state.staffs = action.payload;
        },
        updateAllServices(state, action) {
            state.allServices = action.payload;
        },
        updateIsFetching(state, action) {
            state.isFetching = action.payload;
        }
    }
});

export const {
    updateStaffs,
    updateAllServices,
    updateIsFetching
} = staffSlice.actions;

export default staffSlice.reducer;
