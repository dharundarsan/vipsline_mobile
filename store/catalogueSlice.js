import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

async function getBusinessId() {
    let businessId = ""
    try {
        const value = await AsyncStorage.getItem('businessId');
        if (value !== null) {
            return value;
        }
    } catch (e) {
            }
}

export const loadServicesDataFromDb = (gender) => async (dispatch) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside catalogueSlice loadServiceDataFromDb)" + e);
    }

    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/resourceCategory/getListOfAllServicesOfBusiness",
            {
                business_id:await getBusinessId(),
                gender: gender,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(setServices({data: response.data.data, gender: gender}));
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

export const loadProductsDataFromDb = () => async (dispatch) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside catalogueSLice loadProductsDataFromDb)" + e);
    }
    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/product/getAllProductsOfBusiness",
            {
                business_id: await getBusinessId(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(setProducts({data: response.data.data}));
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

export const loadMembershipsDataFromDb = () => async (dispatch) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside catalogueSlice loadMembershipsDataFromDb)" + e);
    }
    try {
        const response = await axios.post(
             process.env.EXPO_PUBLIC_API_URI + "/membership/getListOfMembershipByBusiness",
            {
                business_id: await getBusinessId(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(setMemberships({data: response.data.data}));
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

export const loadPackagesDataFromDb = () => async (dispatch) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside catalogueSlice loadPackagesDataFromDb)" + e);
    }
    try {
        const response = await axios.post(
              process.env.EXPO_PUBLIC_API_URI + "/package/getListOfPackagesByBusiness",
            {
                business_id:await getBusinessId(),
                status: true
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
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
