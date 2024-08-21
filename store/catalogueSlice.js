import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";

const initialCatalogueState = {
    services: {
        women: [],
        men: [],
        kids: [],
        general: []
    },
    products: {
        items: [],
    },
    memberships: {
        items: [],
    },
    packages: {
        items: []
    }
};

export const loadServicesDataFromDb = (gender) => async (dispatch) => {
    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/resourceCategory/getListOfAllServicesOfBusiness",
            {
                business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
                gender: gender,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );
        dispatch(setServices({data: response.data.data, gender: gender}));
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

export const loadProductsDataFromDb = () => async (dispatch) => {
    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/product/getAllProductsOfBusiness",
            {
                business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );
        dispatch(setProducts({data: response.data.data}));
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

export const loadMembershipsDataFromDb = () => async (dispatch) => {
    try {
        const response = await axios.post(
             process.env.EXPO_PUBLIC_API_URI + "/membership/getListOfMembershipByBusiness",
            {
                business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );
        dispatch(setMemberships({data: response.data.data}));
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

export const loadPackagesDataFromDb = () => async (dispatch) => {
    try {
        const response = await axios.post(
              process.env.EXPO_PUBLIC_API_URI + "/package/getListOfPackagesByBusiness",
            {
                business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
                status: true
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );
        dispatch(setPackages({data: response.data.data}));
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

export const catalogueSlice = createSlice({
    name: "catalogue",
    initialState: initialCatalogueState,
    reducers: {
        setServices(state, action) {
            switch (action.payload.gender) {
                case "women":
                    state.services.women = action.payload.data;
                    break;
                case "kids":
                    state.services.kids = action.payload.data;
                    break;
                case "men":
                    state.services.men = action.payload.data;
                    break;
                case "general":
                    state.services.general = action.payload.data;
                    break;
            }
        },
        setMemberships(state, action) {
            state.memberships.items = action.payload.data;
        },
        setProducts(state, action) {
            state.products.items = action.payload.data;
        },
        setPackages(state, action) {
            state.packages.items = action.payload.data;
        }
    }
});

export const {setServices, setMemberships, setPackages, setProducts} = catalogueSlice.actions;

export default catalogueSlice.reducer;
