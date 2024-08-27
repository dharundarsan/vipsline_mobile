import {configureStore} from '@reduxjs/toolkit';
import cartReducer from "./cartSlice";
import catalogueReducer from "./catalogueSlice";
import clientReducer from "./clientSlice";
import clientFilterReducer from "./clientFilterSlice";
import clientInfoReducer from "./clientInfoSlice";
import staffReducer from "./staffSlice";

const store = configureStore({
    reducer: {
        cart: cartReducer,
        catalogue: catalogueReducer,
        client: clientReducer,
        clientFilter: clientFilterReducer,
        clientInfo: clientInfoReducer,
        staff: staffReducer,
    },
});

export default store;
