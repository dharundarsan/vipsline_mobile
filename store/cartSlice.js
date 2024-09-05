import {createSlice} from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import axios from "axios";
import {updateClientsList, updateFetchingState} from "./clientFilterSlice";

const initialCartState = {
    items: [],
    isLoading: false,
    editedItems: []
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

export const checkStaffOnCartItems = () => (dispatch, getState) => {
    const {cart} = getState();
    return cart.items.every(item => item.resource_id !== null);
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
        dispatch(updateEditedItems())
    } catch (error) {
    }
}

export const removeItemFromCart = async (itemId) => async (dispatch, getState) => {
    const {cart} = getState()

    // if (cart.items.some(item => item.item_id === itemId)) {
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
            if(cart.editedItems.some(ele => ele.itemId === itemId)){
                dispatch(removeItemFromEditedCart(itemId));
            }
            dispatch(await loadCartFromDB());
        } catch (error) {
        }
    // } else {
    //     console.log("Fuck you")
    // }
}

export const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        updateItem(state, action) {
            const transformed = action.payload
            state.items = action.payload.map(item => {
                return {
                    ...item,
                    edited: false
                }
            })
        },
        updateLoadingState(state, action) {
            state.isLoading = action.payload;
        },
        addItemToEditedCart(state, action) {
            state.editedItems = [...state.editedItems, action.payload];
        },
        removeItemFromEditedCart(state, action){
            state.editedItems = state.editedItems.filter(item => item.itemId !== action.payload);
        },
        updateEditedItems(state, action) {
            // console.log('state.editedItems.map(edited => {')

            state.editedItems = state.editedItems.map(edited => {
                return state.items.filter(item => item.membership_id === edited.id).map(item => {
                    return {
                        ...item,
                        price: edited.price,
                        id: edited.id,
                        valid_from: edited.valid_from,
                        valid_until: edited.valid_until,
                        edited: true
                    }
                })
            }).flat()

            state.items = state.items.filter(item =>
                !state.editedItems.some(edited => edited.id === item.membership_id)
            );
            // state.items = state.editedItems.map(edited => state.items.filter(item => item.membership_id !== edited.id)).flat();

            // console.log(state.editedItems)
        }
    }
});

export const {
    updateItem,
    updateLoadingState,
    addItemToEditedCart,
    updateEditedItems,
    removeItemFromEditedCart
} = cartSlice.actions;

export default cartSlice.reducer;
