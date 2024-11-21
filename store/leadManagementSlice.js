import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import * as SecureStore from 'expo-secure-store';
import LeadStatusAPI from "../util/apis/leadStatusAPI";
import LeadSourcesAPI from "../util/apis/leadSourcesAPI";
import getLeadsAPI from "../util/apis/getLeadsAPI";

export const loadLeadStatusesFromDb = () => async (dispatch) => {
    const response = await LeadStatusAPI();
    dispatch(updateLeadStatuses(response.data.data))
}

export const loadLeadSourcesFromDb = () => async (dispatch) => {
    const response = await LeadSourcesAPI();
    dispatch(updateLeadSources(response.data.data))
}

export const loadLeadsFromDb = () => async (dispatch, getState) => {
    const {leads} = getState();
    const response = await getLeadsAPI(leads.pageNo, leads.maxEntry, leads.searchTerm)
    dispatch(updateLeadsList(response.data.data[0].leadsList))
    dispatch(updateLeadsCount(response.data.data[0].count))
}


const initialLeadState = {
    leadStatuses: [],
    leadSources: [],
    isFetching: false,
    searchTerm: "",

    leads: [],
    pageNo: 0,
    maxEntry: 10,
    totalLeadCount: 0,

    searchLeads: [],
    searchPageNo: 0,
    searchMaxEntry: 10,
    totalSearch: 0,
};

export const leadManagementSlice = createSlice({
    name: "leads",
    initialState: initialLeadState,
    reducers: {
        updateLeadsList(state, action) {
            state.leads = action.payload;
        },
        updateSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        resetLeads(state, action) {
            state.clients = [];
            state.pageNo = 0;
        },
        updateFetchingState(state, action) {
            state.isFetching = action.payload;
        },
        updateMaxEntry(state, action) {
            state.maxEntry = action.payload;
        },
        updateSearchMaxEntry(state, action) {
            state.searchMaxEntry = action.payload;
        },
        resetMaxEntry(state, action) {
            state.maxEntry = 10;
            state.searchMaxEntry = 10;
        },
        incrementPageNumber(state, action) {
            state.pageNo++;
        },
        resetPageNo(state, action) {
            state.pageNo = 0;
        },
        decrementPageNumber(state, action) {
            const page_no = state.pageNo - 1;
            if (page_no < 0) {
                state.pageNo = 0;
            } else {
                state.pageNo--;
            }
        },
        incrementSearchPageNumber(state, action) {
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
        updateLeadsCount(state, action) {
            state.totalLeadCount = action.payload;
        },
        updateSearchCount(state, action) {
            state.totalSearchClients = action.payload;
        },
        updateLeadStatuses(state, action) {
            state.leadStatuses = action.payload;
        },
        updateLeadSources(state, action) {
            state.leadSources = action.payload;
        },
    }
});

export const {
    updateLeadsList,
    updateSearchCount,
    decrementSearchPageNumber,
    decrementPageNumber,
    incrementPageNumber,
    resetLeads,
    incrementSearchPageNumber,
    resetMaxEntry,
    updateMaxEntry,
    updateSearchMaxEntry,
    updateFetchingState,
    updateLeadSources,
    updateLeadStatuses,
    updateSearchTerm,
    updateLeadsCount,
    resetPageNo
} = leadManagementSlice.actions;

export default leadManagementSlice.reducer;
