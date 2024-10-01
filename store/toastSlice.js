import {createSlice} from "@reduxjs/toolkit";
import {useRef} from "react";

const initialRefState = {
    currentRef: null
};

export const toastSlice = createSlice({
    name: "toast",
    initialState: initialRefState,
    reducers: {
        updateToastRef(state, action) {
            console.log(action.payload)
            state.currentRef = action.payload;
        },
    }
});

export const {
    updateToastRef
} = toastSlice.actions;

export default toastSlice.reducer;
