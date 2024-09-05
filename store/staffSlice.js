import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {loadCartFromDB} from "./cartSlice";

const initialStaffState = {
    staffs:[]
};

export const loadStaffsFromDB = () => async (dispatch, getState) => {
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/resource/getByBusiness`,
            {
                business_id: `${process.env.EXPO_PUBLIC_BUSINESS_ID}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );
        dispatch(updateStaffs(response.data.data));
    } catch (error) {
    }
}

export const updateCartItemStaff = (res_list) => async (dispatch, getState) => {
    try {
        const response = await axios.put(
            `${process.env.EXPO_PUBLIC_API_URI}/cart/updateMultipleResourceInCart2`,
            {
                business_id: `${process.env.EXPO_PUBLIC_BUSINESS_ID}`,
                res_list:res_list

            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
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
            console.log("state: "+state);
        },
    }
});

export const {
    updateStaffs,
} = staffSlice.actions;

export default staffSlice.reducer;
