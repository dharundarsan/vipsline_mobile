import {createSlice} from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import axios from "axios";
import {updateClientsList, updateFetchingState} from "./clientFilterSlice";
import calculateCartPriceAPI from "../util/apis/calculateCartPriceAPI";

const initialCartState = {
    items: [],
    isLoading: false,
    editedMembership: [],
    editedCart: [],
    calculatedPrice: [],
    customItems: [],
    additionalDiscounts: [],
    chargesData: [{
        name: "",
        amount: 0,
        index: 0,
    }],
    salesNotes: "",
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
    const {cart} = getState();
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
        dispatch(updateEditedMembership({type:"map"}))
        dispatch(updateEditedCart());
        dispatch(updateCalculatedPrice());
    } catch (error) {
    }
}

export const updateCalculatedPrice = () => async (dispatch, getState) => {
    const {cart} = getState();
    calculateCartPriceAPI({
        additional_discounts: cart.additionalDiscounts,
        additional_services: cart.customItems,
        cart: cart.items.map(item => {
            return {id: item.item_id}
        }),
        coupon_code: "",
        edited_cart: [...cart.editedMembership.map(item => {
            return {
                amount: item.price,
                bonus_value: 0,
                disc_value: 0,
                itemId: item.item_id,
                membership_id: item.id,
                membership_number: "",
                res_cat_id: 282773,
                resource_id: item.resource_id,
                type: "AMOUNT",
                valid_from: item.valid_from,
                valid_till: item.valid_until,
                wallet_amount: 0,
            }
        }),
            // ...cart.editedCart
            ...cart.editedCart.map(item => {
                if (item.gender === "Products")
                    return {
                        amount: item.amount,
                        bonus_value: 0,
                        disc_value: item.disc_value,
                        itemId: item.item_id,
                        membership_id: 0,
                        product_id:item.product_id,
                        resource_id: item.resource_id,
                        type: "AMOUNT",
                        valid_from: "",
                        valid_till: "",
                        wallet_amount: 0,
                    }
                else
                    return item
            })
        ],
        extra_charges: cart.chargesData,
        isWalletSelected: false,
        promo_code: "",
        user_coupon: "",
        walkin: "yes",
        wallet_amt: 0
    }).then(response => {
        console.log("RESPONSE")
        console.log(response)
        dispatch(setCalculatedPrice(response))
    })

}

export const removeItemFromCart = async (itemId) => async (dispatch, getState) => {
    const {cart} = getState()

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
        if (cart.editedMembership.some(ele => ele.itemId === itemId)) {
            dispatch(removeItemFromEditedMembership(itemId));
        }
        if (cart.editedCart.some(ele => ele.itemId === itemId)) {
            dispatch(removeItemFromEditedCart(itemId));
        }
        dispatch(await loadCartFromDB());
    } catch (error) {
    }
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
        addItemToEditedMembership(state, action) {
            state.editedMembership = [...state.editedMembership, action.payload];
        },
        addItemToEditedCart(state, action) {
            if (state.editedCart.some(item => item.item_id === action.payload.item_id))
                state.editedCart = state.editedCart.map(edited => {
                    if (edited.item_id === action.payload.item_id) {
                        return {
                            edited,
                            ...action.payload
                        }
                    }
                    return edited;
                })
            else
                state.editedCart = [...state.editedCart, action.payload];
        },
        removeItemFromEditedCart(state, action) {
            state.editedCart = state.editedCart.filter(item => item.itemId !== action.payload);
        },
        removeItemFromEditedMembership(state, action) {
            state.editedMembership = state.editedMembership.filter(item => item.itemId !== action.payload);
        },
        updateEditedCart(state, action) {
            state.items = state.items.filter(item =>
                !state.editedCart.some(edited => edited.item_id === item.item_id)
            )

            // state.editedCart = state.editedCart.map(edited => {
            //     return state.items.filter(item => {
            //         return item.item_id === edited.itemId;
            //     }).map(item => {
            //         console.log("ITEM NAME")
            //         console.log(item)
            //         console.log("EDITED NAME")
            //         console.log(edited)
            //         return {
            //             ...item,
            //             ...edited,
            //             price: edited.amount,
            //             amount: edited.amount,
            //             name: item.resource_category_name,
            //             resource_category_name: item.resource_category_name
            //         }
            //     })
            // }).flat();

        },
        updateCustomItem(state, action) {
            state.customItems = state.customItems.map(edited => {
                if (edited.item_id === action.payload.item_id) {
                    return {
                        ...edited,
                        ...action.payload
                    }
                }
                return edited;
            })
        },
        updateEditedMembership(state, action) {
            if(action.payload.type === "map") {
                state.editedMembership = state.editedMembership.map(edited => {
                    return state.items.filter(item => {
                        return item.membership_id === edited.id

                    }).map(item => {
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
                    !state.editedMembership.some(edited => edited.id === item.membership_id)
                );
            } else if(action.payload.type === "edit"){
                state.editedMembership = state.editedMembership.map(edited => {
                    if(edited.item_id === action.payload.id){
                        return {
                            ...edited,
                            itemId:edited.item_id,
                            item_Id:edited.item_id,
                            membership_id: edited.membership_id,
                            membership_number: "",
                            res_cat_id: action.payload.data.res_cat_id,
                            resource_id:edited.resource_id,
                            disc_value: action.payload.data.disc_value,
                            amount:action.payload.data.amount,
                            price: action.payload.data.amount,
                            total_price: action.payload.data.amount,
                            type: action.payload.data.type,
                            valid_from: edited.valid_from,
                            valid_till: edited.valid_until,
                            wallet_amount: 0,
                        }
                    }
                    return edited;
                })
            }
            // state.items = state.editedMembership.map(edited => state.items.filter(item => item.membership_id !== edited.id)).flat();

            // console.log(state.editedMembership)
        },
        setCalculatedPrice(state, action) {
            state.calculatedPrice = action.payload;
        },
        addCustomItems(state, action) {
            const data = {
                ...action.payload,
                id: Math.floor(Math.random() * 90000) + 10000
            }
            state.customItems = [...state.customItems, data];
        },
        removeCustomItems(state, action) {
            state.customItems = state.customItems.filter(oldItem => oldItem.id !== action.payload);
        },
        //Bhaski reducers
        updateDiscount(state,action){
            state.additionalDiscounts.pop();
            state.additionalDiscounts = [action.payload];
        },
        updateChargeData(state,action){
            state.chargesData = action.payload;
        },
        updateSalesNotes(state,action){
            state.salesNotes = action.payload;
        }
    }
});

export const {
    updateItem,
    updateLoadingState,
    addItemToEditedMembership,
    updateEditedMembership,
    removeItemFromEditedMembership,
    addItemToEditedCart,
    removeItemFromEditedCart,
    updateEditedCart,
    setCalculatedPrice,
    addCustomItems,
    removeCustomItems,
    updateCustomItem,
    updateDiscount,
    updateChargeData,
    updateSalesNotes
} = cartSlice.actions;

export default cartSlice.reducer;
