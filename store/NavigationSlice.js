import {createSlice} from "@reduxjs/toolkit";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";

const initialNavigationState = {
    current: "",
};

export const navigationSlice = createSlice({
    name: "navigation",
    initialState: initialNavigationState,
    reducers: {
        updateNavigationState(state, action) {
            state.current = action.payload;
        }
    }
});

export const {
    updateNavigationState,
} = navigationSlice.actions;

export default navigationSlice.reducer;
