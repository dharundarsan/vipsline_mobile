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
import dashboardReducer from './dashboardSlice';
import invoiceReducer from "./invoiceSlice";
import checkoutActionReducer from "./CheckoutActionSlice";
import toastReducer from "./toastSlice";
import businessDetailReducer from "./BusinessDetailSlice";
import leadManagementReducer from "./leadManagementSlice";
import ExpensesReducer from './ExpensesSlice';
import navigationReducer from "./NavigationSlice";
import reportReducer from "./reportSlice";
import appointmentsReducer from "./appointmentsSlice";
import newBookingReducer from "./newBookingSlice";

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
        checkoutAction: checkoutActionReducer,
        businessDetail: businessDetailReducer,
        toast: toastReducer,
        leads: leadManagementReducer,
        expenses: ExpensesReducer,
        dashboardDetails: dashboardReducer,
        navigation: navigationReducer,
        report: reportReducer,
        appointments: appointmentsReducer,
        newBooking: newBookingReducer
    },
});

export default store;
