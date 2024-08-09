import {configureStore} from '@reduxjs/toolkit';
import cartReducer from "./cartSlice";
import catalogueReducer from "./catalogueSlice";
import clientReducer from "./clientSlice";
import clientFilterReducer from "./clientFilterSlice";
import clientInfoReducer from "./clientInfoSlice";

const store = configureStore({
    reducer: {
        cart: cartReducer,
        catalogue: catalogueReducer,
        client: clientReducer,
        clientFilter: clientFilterReducer,
        clientInfo: clientInfoReducer,
    },
});

export default store;
