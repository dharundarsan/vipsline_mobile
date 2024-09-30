import {createSlice} from "@reduxjs/toolkit";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";

const initialClientState = {
    isAuthenticated: false,
    isFetching: false,
    authToken: "",
    businessId: "",
    inBusiness:false,
};

export const authSlice = createSlice({
    name: "authDetails",
    initialState: initialClientState,
    reducers: {
        updateAuthStatus(state, action) {
            state.isAuthenticated = action.payload;
        },
        updateFetchingState(state, action) {
            state.isFetching = action.payload;
        },
        updateAuthToken(state, action) {
            state.authToken = action.payload;
        },
        updateBusinessId(state, action) {
            state.businessId = action.payload;
        },
        updateBusinessName(state, action) {
            state.businessName = action.payload;
        },
        clearBusinessId(state, action) {
            state.businessId = "";
        },
        updateInBusiness(state, action){
            state.inBusiness = action.payload;
        },
        clearInBusiness(state){
            state.inBusiness = false;
        },
    }
});

export const {
    updateAuthStatus,
    updateFetchingState,
    updateAuthToken,
    updateBusinessId,
    updateBusinessName,
    clearBusinessId,
    updateInBusiness,
    clearInBusiness
} = authSlice.actions;

export default authSlice.reducer;
