import {createSlice} from "@reduxjs/toolkit";
import uuid from "react-native-uuid";

const initialCartState = {
    items: []
};

const addItem = (state, action) => {
    state.items.push({key: uuid.v4(), ...action.payload});
};

const deleteItem = (state, action) => {
    state.items = state.items.filter(item => {
        return item.key !== action.payload;
    });
};

const editItem = (state, action) => {
    const {id, changes} = action.payload;
    const itemIndex = state.items.findIndex(item => item.id === id);
    if (itemIndex >= 0) {
        state.items[itemIndex] = {
            ...state.items[itemIndex],
            ...changes
        };
    }
};

export const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        addItem,
        deleteItem,
        editItem
    }
});

export const {
    addItem: addItemToCart,
    deleteItem: deleteItemFromCart,
    editItem: editItemInCart
} = cartSlice.actions;

export default cartSlice.reducer;
