import {configureStore} from '@reduxjs/toolkit';
import cartReducer from "./cartSlice";
import catalogueReducer from "./catalogueSlice";
import clientReducer from "./clientSlice";
import clientFilterReducer from "./clientFilterSlice";
import clientInfoReducer from "./clientInfoSlice";
import staffReducer from "./staffSlice";
import businessesReducer from "./listOfBusinessSlice";
import loginUserReducer from "./loginUserSlice";
import authReducer from "./authSlice";
import invoiceReducer from "./invoiceSlice";
import checkoutActionReducer from "./CheckoutActionSlice";
import toastReducer from "./toastSlice";
const store = configureStore({
    reducer: {
        cart: cartReducer,
        catalogue: catalogueReducer,
        client: clientReducer,
        clientFilter: clientFilterReducer,
        clientInfo: clientInfoReducer,
        staff: staffReducer,
        businesses: businessesReducer,
        loginUser: loginUserReducer,
        authDetails: authReducer,
        invoice: invoiceReducer,
        checkoutAction:checkoutActionReducer,
        toast: toastReducer,
    },
});

export default store;
