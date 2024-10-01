import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import * as SecureStore from 'expo-secure-store';

const initial = {
    clients: [],
    pageNo: 0,
    maxEntry: 10,
    isFetching: false,
    totalClients: 0,

    searchClients: [],
    searchPageNo: 0,
    searchMaxEntry: 10,
    isFetchingSearchClient: false,
    totalSearchClients: 0,

}

async function getBusinessId() {
    let businessId = ""
    try {
        // const value = await AsyncStorage.getItem('businessId');
        const value = await SecureStore.getItemAsync('businessId');
        if (value !== null) {
            return value;
        }
    } catch (e) {
            }
}


export const loadClientFiltersFromDb = (pageSize, filter) => async (dispatch, getState) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside loadClientFilterFromDb)" + e);
    }

    const { clientFilter } = getState();
    if (clientFilter.isFetching) return;

    try {
        dispatch(updateFetchingState(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/client/getClientReportBySegmentForBusiness?pageNo=${clientFilter.pageNo}&pageSize=${pageSize}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: "",
                sortItem: "name",
                sortOrder: "asc",
                toDate: "",
                type: filter,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateTotalClientCount(response.data.data.pop().count));
        dispatch(updateClientsList(response.data.data));
        dispatch(updateFetchingState(false));
    } catch (error) {
        console.error("Error fetching data11: ", error);
        dispatch(updateFetchingState(false));
    }
};

export const loadSearchClientFiltersFromDb = (pageSize, filter, query) => async (dispatch, getState) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clientFilterSlice loadSearchClientFilterFromDb)" + e);
    }

    const { clientFilter } = getState();
    if (clientFilter.isFetchingSearchClient) return;

    try {
        dispatch(updateSearchClientFetchingState(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/client/searchClientSegment?pageNo=${clientFilter.searchPageNo}&pageSize=${pageSize}`,
            {
                business_id: `${await getBusinessId()}`,
                query: query,
                type: filter,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateTotalSearchClientCount(response.data.data.pop().count));
        dispatch(updateSearchClientList(response.data.data));
        dispatch(updateSearchClientFetchingState(false));

    } catch (error) {
        console.error("Error fetching data2: ", error);
        dispatch(updateSearchClientFetchingState(false));
    }
}




export const clientFilterSlice = createSlice({
    name: "clientFilter",
    initialState: initial,
    reducers: {
        updateClientsList(state, action) {
            state.clients = [...action.payload];
        },
        resetClientFilter(state, action) {
            state.clients = [];
            state.pageNo = 0;
        },
        updateFetchingState(state, action) {
            state.isFetching = action.payload;
        },
        incrementPageNumber(state, action)  {
            state.pageNo++;
        },
        decrementPageNumber(state, action)  {
            const page_no = state.pageNo - 1;
            if(page_no < 0) {
                state.pageNo = 0;
            }
            else {
                state.pageNo--;
            }
        },
        updateMaxEntry(state, action) {
            state.maxEntry = action.payload;
        },
        updateTotalClientCount(state, action) {
            state.totalClients = action.payload;
        },
        updateSearchClientList(state, action) {
            state.searchClients = [...action.payload];
        },
        updateSearchClientFetchingState(state, action) {
            state.isFetchingSearchClient = action.payload;
        },
        resetSearchClientFilter(state, action) {
            state.searchClients = [];
            state.searchPageNo = 0;
        },
        incrementSearchClientPageNumber(state, action) {
            state.searchPageNo++;
        },
        decrementSearchPageNumber(state, action)  {
            const page_no = state.searchPageNo - 1;
            if(page_no < 0) {
                state.searchPageNo = 0;
            }
            else {
                state.searchPageNo--;
            }
        },
        updateTotalSearchClientCount(state, action) {
            state.totalSearchClients = action.payload;
        },
        updateSearchClientMaxEntry(state, action) {
            state.searchMaxEntry = action.payload;
        },
        resetMaxEntry(state, action) {
            state.maxEntry = 10;
            state.searchClientMaxEntry = 10;
        }

    }
});

export const {
    updateClientsList,
    updateFetchingState,
    decrementPageNumber,
    incrementPageNumber,
    updateMaxEntry,
    resetClientFilter ,
    updateSearchClientFetchingState,
    updateSearchClientList,
    resetSearchClientFilter,
    updateTotalClientCount,
    incrementSearchClientPageNumber,
    decrementSearchPageNumber,
    updateTotalSearchClientCount,
    updateSearchClientMaxEntry,
    updateAnalyticDetails,
    resetMaxEntry,
} = clientFilterSlice.actions;

export default clientFilterSlice.reducer;
