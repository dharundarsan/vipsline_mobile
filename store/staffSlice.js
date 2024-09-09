import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {loadCartFromDB} from "./cartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialStaffState = {
    staffs:[]
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

export const loadStaffsFromDB = () => async (dispatch, getState) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
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
        const value = await AsyncStorage.getItem('authKey');
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
                res_list:res_list

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

export const staffSlice = createSlice({
    name: "staffs",
    initialState: initialStaffState,
    reducers: {
        updateStaffs(state, action) {
            state.staffs = action.payload;
            // console.log("state: "+state);
        },
    }
});

export const {
    updateStaffs,
} = staffSlice.actions;

export default staffSlice.reducer;
