import { createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import { getBusinessId } from './cartSlice';

const initialState = {
    total_count: 10,
    totalSalesValue: 0,
    totalNetSalesValue: 0,
    salesReportList: [],

    pageNo:0,
    maxEntry: 10,
    pageSize:10,
    searchMaxEntry: 10,
};

export const fetchSalesReportByBusiness = (initialPage, finalPage,fromDate,toDate,query,sortItem="invoice_issued_on",sortOrder="desc") => async (dispatch, getState) => {
    let authToken = "";
    const {pageNo} = getState().report;
    try {
        const value = await SecureStore.getItemAsync("authKey");
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("Auth token fetching error: ", e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getSalesReportByBusiness?pageNo=${pageNo ?? 0}&pageSize=${finalPage ?? 10}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: fromDate,
                toDate: toDate,
                sortItem: sortItem === null ? "invoice_issued_on" : sortItem,
                sortOrder: sortOrder,
                query: query !== undefined ? query : "",
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return response.data; // Return the data explicitly
    } catch (e) {
        console.error(e.response?.data || "Error fetching sales report");
        throw e; // Optionally throw to propagate error
    }
};


const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        updateTotalCount(state, action) {
            if (action.payload.type === 'update') {
                state.total_count = action.payload.value;
            }
            else if(action.payload.type === 'reset') {
                state.total_count = 10;
            }
        },
        updateTotalSalesValue(state, action) {
            if(action.payload.type === 'update') {
                state.totalSalesValue = action.payload.value;
            }
            else if(action.payload.type === 'reset') {
                state.totalSalesValue = 0;
            }
        },
        updateTotalNetSalesValue(state, action) {
            if(action.payload.type === 'update') {
                state.totalNetSalesValue = action.payload.value;
            }
            else if(action.payload.type === 'reset') {
                state.totalNetSalesValue = 0;
            }
        },
        updateSalesReportList(state, action) {
            if(action.payload.type === 'update') {
                state.salesReportList = action.payload.value;
            }
            else if(action.payload.type === 'reset') {
                state.salesReportList = [];
            }
        },
        updateDateChangeValue(state, action) {
            if (action.payload.type === 'update') {
                Object.keys(action.payload.values).forEach(key => {
                    if (state.hasOwnProperty(key)) {
                        state[key] = action.payload.values[key];
                    }
                });
            } else if (action.payload.type === 'reset') {
                state.total_count = 10;
                state.totalSalesValue = 0;
                state.totalNetSalesValue = 0;
                state.salesReportList = [];
            }
        },
        updatePageNo(state, action) {
            if (action.payload.type === 'update') {
                state.pageNo = action.payload.value;
                state.pageSize = action.payload.pageSize;
            }
            else if (action.payload.type === 'reset') {
                state.pageNo = 0;
                state.pageSize = 10;
            }
        },
        incrementSearchReportPageNumber(state, action) {
            state.searchPageNo++;
        },
        decrementSearchPageNumber(state, action) {
            const page_no = state.searchPageNo - 1;
            if (page_no < 0) {
                state.searchPageNo = 0;
            } else {
                state.searchPageNo--;
            }
        },
        incrementPageNumber(state, action) {
            state.pageNo++;
        },
        decrementPageNumber(state, action) {
            const page_no = state.pageNo - 1;
            if (page_no < 0) {
                state.pageNo = 0;
            } else {
                state.pageNo--;
            }
        },
        updateMaxEntry(state, action) {
            state.maxEntry = action.payload;
        },
    },
});

export const {
    updateTotalCount,
    updateTotalSalesValue,
    updateTotalNetSalesValue,
    updateDateChangeValue,
    updateSalesReportList,
    updatePageNo,
    incrementPageNumber,
    decrementPageNumber,
    updateMaxEntry,
    incrementSearchReportPageNumber,
    decrementSearchPageNumber,
} = reportSlice.actions;

export default reportSlice.reducer;