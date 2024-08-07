import {configureStore} from '@reduxjs/toolkit';
import cartReducer from "./cartSlice";
import catalogueReducer from "./catalogueSlice";
import clientReducer from "./clientSlice";
import clientFilterReducer from "./clientFilterSlice";

const store = configureStore({
    reducer: {
        cart: cartReducer,
        catalogue: catalogueReducer,
        client: clientReducer,
        clientFilter: clientFilterReducer,
    },
});

export default store;
