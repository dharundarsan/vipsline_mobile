import {createSlice} from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import axios from "axios";
import {updateClientsList, updateFetchingState} from "./clientFilterSlice";

const initialCartState = {
    items: []
};

export const addItemToCart = (data) => async (dispatch, getState) => {
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/cart/addItemsToCheckout`,
            {
                business_id: `${process.env.EXPO_PUBLIC_BUSINESS_ID}`,
                ...data
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

export const loadCartFromDB = () => async (dispatch, getState) => {
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/cart/getCheckoutItemsInCart2ByBusiness`,
            {
                business_id: `${process.env.EXPO_PUBLIC_BUSINESS_ID}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );
        dispatch(updateItem(response.data.data));
    } catch (error) {
    }
}

export const removeItemFromCart = (itemId) => async (dispatch, getState) => {
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/cart/removeFromCart2`,
            {
                business_id: `${process.env.EXPO_PUBLIC_BUSINESS_ID}`,
                item_id: itemId
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

export const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        updateItem(state, action) {
            state.items = action.payload;
        },
    }
});

export const {
    updateItem,
} = cartSlice.actions;

export default cartSlice.reducer;
