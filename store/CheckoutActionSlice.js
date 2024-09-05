import { createSlice } from "@reduxjs/toolkit";

const initial = {
    additionalDiscounts: [],
    chargesData: [],
    salesNotes: "",
};

export const checkoutActionSlice = createSlice({
    name: "checkoutAction",
    initialState: initial,
    reducers:{
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
})

export const {
    updateDiscount,
    updateChargeData,
    updateSalesNotes
} = checkoutActionSlice.actions

export default checkoutActionSlice.reducer