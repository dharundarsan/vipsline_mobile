import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import * as SecureStore from 'expo-secure-store';
import LeadStatusAPI from "../util/apis/leadStatusAPI";
import LeadSourcesAPI from "../util/apis/leadSourcesAPI";
import getLeadsAPI from "../util/apis/getLeadsAPI";
import moment from "moment";

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
    const response = await getLeadsAPI(leads.pageNo,
        leads.maxEntry,
        leads.searchTerm,
        {
            "followupDate": leads.selectedLeadFollowUpOption === "Overdue" || leads.selectedLeadFollowUpOption === null ? undefined : leads.followupDate,
            "followupEndDate": leads.selectedLeadFollowUpOption === "Overdue" || leads.selectedLeadFollowUpOption === null ? undefined : leads.followupEndDate,
            "fromDate": leads.selectedLeadDateOption !== null ? leads.fromDate : undefined,
            "toDate": leads.selectedLeadDateOption !== null ? leads.toDate : undefined,
            "gender": leads.gender,
            "leadFollowUp": leads.leadFollowUp,
            "lead_campaign": leads.lead_campaign,
            "lead_owner": leads.lead_owner,
            "lead_source": leads.lead_source,
            "lead_status": leads.lead_status,
        })
    dispatch(updateLeadsList(response.data.data[0].leadsList))
    dispatch(updateLeadsCount(response.data.data[0].count))
    return response;
}


export const initialLeadState = {
    leadStatuses: [],
    leadSources: [],
    isFetching: false,
    searchTerm: "",

    // AdvancedFilters
    followupDate: moment().toISOString(),
    followupEndDate: moment().toISOString(),
    fromDate: moment().toISOString(),
    toDate: moment().toISOString(),
    gender: undefined,
    leadFollowUp: undefined,
    lead_campaign: undefined,
    lead_owner: undefined,
    lead_source: undefined,
    lead_status: undefined,

    selectedLeadFollowUpOption: null,
    selectedLeadDateOption: null,

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
        updateAdvancedFilters(state, action) {
            console.log(action.payload)
            if (action.payload.field === "followupDate") {
                state.followupDate = action.payload.value;
            } else if (action.payload.field === "followupEndDate") {
                state.followupEndDate = action.payload.value;
            } else if (action.payload.field === "fromDate") {
                state.fromDate = action.payload.value;
            } else if (action.payload.field === "toDate") {
                state.toDate = action.payload.value;
            } else if (action.payload.field === "gender") {
                state.gender = action.payload.value;
            } else if (action.payload.field === "leadFollowUp") {
                state.leadFollowUp = action.payload.value;
            } else if (action.payload.field === "lead_campaign") {
                state.lead_campaign = action.payload.value;
            } else if (action.payload.field === "lead_owner") {
                state.lead_owner = action.payload.value;
            } else if (action.payload.field === "lead_source") {
                state.lead_source = action.payload.value;
            } else if (action.payload.field === "lead_status") {
                state.lead_status = action.payload.value;
            } else if (action.payload.field === "selectedLeadFollowUpOption") {
                state.selectedLeadFollowUpOption = action.payload.value;
            } else if (action.payload.field === "selectedLeadDateOption") {
                state.selectedLeadDateOption = action.payload.value;
            }
        },
        clearAdvancedFilters(state, action) {
            state.followupDate = undefined;
            state.followupEndDate = undefined;
            state.fromDate = undefined;
            state.gender = undefined;
            state.leadFollowUp = undefined;
            state.lead_campaign = undefined;
            state.lead_owner = undefined;
            state.lead_source = undefined;
            state.lead_status = undefined;
            state.toDate = undefined;
            state.selectedLeadFollowUpOption = null;
            state.selectedLeadDateOption = null;
        }
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
    resetPageNo,
    updateAdvancedFilters,
    clearAdvancedFilters
} = leadManagementSlice.actions;

export default leadManagementSlice.reducer;
