import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import {act} from "react";

const initial = {
    expenses: [],
    pageNo: 0,
    maxEntry: 10,
    isFetching: false,
    totalExpenses: 0,

    searchExpenses: [],
    searchPageNo: 0,
    searchMaxEntry: 10,
    isFetchingSearchExpenses: false,
    totalSearchExpenses: 0,

    fromDate: moment().format("YYYY-MM-DD"),
    toDate: moment().format("YYYY-MM-DD"),
    query: "",
    categories: [],
    amount: 0,
    isExpensesExists: false,
    category: "All expenses",
    range: "Today",
    oldCopy: {
        fromDate: "",
        toDate: "",
        category: "",
        range: "",
        customRangeStartDate: "",
        customRangeEndDate: ""
    },
    subId: [],
    currentExpensesId: "",
    currentExpense: {},
    currentCategoryId: -1,
    currentSubId: 0,
    customRangeStartDate: "",
    customRangeEndDate: ""
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

export const getExpenseCategoryId = () => async (dispatch, getState) => {
    const { expenses } = getState();
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside loadExpensesFilterFromDb)" + e);
    }

    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/expense/getListofExpenseCategoryForBusiness", {
            business_id: await getBusinessId(),
        },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
        dispatch(updateExpenseId(response.data.data));

    }
    catch (e) {
        console.log(e + " error occurred in getting the expense Id")
    }
}

export const getExpenseSubCategoryId = (subId) => async (dispatch, getState) => {
    const { expenses } = getState();
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside loadExpensesFilterFromDb)" + e);
    }

    try {
        const response1 = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/expense/getListofExpenseSubCategoryForBusiness", {
                business_id: await getBusinessId(),
                expense_cat_id: subId
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

        dispatch(updateExpenseSubCategoryId(response1.data.data));
        return response1.data.data[0]
    }
    catch (e) {
        console.log(e + " error occurred in getting the expense sub category Id")
    }
}




export const loadExpensesFromDb = () => async (dispatch, getState) => {


    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside loadExpensesFilterFromDb)" + e);
    }

    const { expenses } = getState();
    if (expenses.isFetching) return;

    try {
        dispatch(updateFetchingState(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/expense/getListofExpenseForBusiness?pageSize=${expenses.maxEntry}&pageNo=${expenses.pageNo}`,
            {
                business_id: `${await getBusinessId()}`,
                fromDate: expenses.range === "Custom range" ? expenses.customRangeStartDate : expenses.fromDate,
                toDate: expenses.range === "Custom range" ? expenses.customRangeEndDate : expenses.toDate,
                expense_cat_id: expenses.currentCategoryId,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateTotalExpensesCount(response.data.data[0].overall_count));
        dispatch(updateExpenseAmount(response.data.data[0].total_expense));
        dispatch(updateExpensesList(response.data.data[0].expense_details));
        dispatch(updateIsExpensesExists(response.data.data[0].isExpenseExists));
        dispatch(updateFetchingState(false));
    } catch (error) {
        console.error("Error fetching expenses data11: ", error);
        dispatch(updateFetchingState(false));
    }
};

export const loadSearchExpensesFromDb = (query) => async (dispatch, getState) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside ExpensesSlice loadSearchExpensesFilterFromDb)" + e);
    }

    const { expenses } = getState();
    if (expenses.isFetchingSearchExpenses) return;

    try {
        dispatch(updateSearchExpensesFetchingState(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/expense/searchExpense`,
            {
                business_id: `${await getBusinessId()}`,
                query: query.trim(),
                expense_cat_id: expenses.currentCategoryId,
                fromDate: expenses.fromDate,
                toDate: expenses.toDate,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        // dispatch(updateTotalSearchExpensesCount(response.data.data[0].overall_count));
        // dispatch(updateSearchExpensesList(response.data.data[0].expense_details));
        dispatch(updateTotalExpensesCount(response.data.data[0].overall_count));
        dispatch(updateExpenseAmount(response.data.data[0].overall_expense));
        dispatch(updateExpensesList(response.data.data[0].expense_details));
        dispatch(updateIsExpensesExists(response.data.data[0].isExpenseExists));
        dispatch(updateSearchExpensesFetchingState(false));

    } catch (error) {
        console.error("Error fetching Expenses data2: ", error);
        dispatch(updateSearchExpensesFetchingState(false));
    }
}




export const ExpensesSlice = createSlice({
    name: "expenses",
    initialState: initial,
    reducers: {
        updateExpensesList(state, action) {
            state.expenses = [...action.payload];
        },
        resetExpensesPageNo(state, action) {
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
        updateTotalExpensesCount(state, action) {
            state.totalExpenses = action.payload;
        },
        updateSearchExpensesList(state, action) {
            state.searchExpenses = [...action.payload];
        },
        updateSearchExpensesFetchingState(state, action) {
            state.isFetchingSearchExpenses = action.payload;
        },
        resetSearchExpenses(state, action) {
            state.searchExpenses = [];
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
        updateTotalSearchExpensesCount(state, action) {
            state.totalSearchExpenses = action.payload;
        },
        updateSearchExpensesMaxEntry(state, action) {
            state.searchMaxEntry = action.payload;
        },
        resetMaxEntry(state, action) {
            state.maxEntry = 10;
            state.searchClientMaxEntry = 10;
        },
        updateExpenseId(state, action) {
            state.categories = action.payload;
        },
        updateExpenseAmount(state, action) {
            state.amount = action.payload;
        },
        updateIsExpensesExists(state, action) {
            state.isExpensesExists = action.payload;
        },
        updateFilters(state, action) {
            state.fromDate = action.payload.fromDate;
            state.toDate = action.payload.toDate;
            state.category = action.payload.category;
            state.range = action.payload.range;
            state.customRangeStartDate = action.payload.customRangeStartDate;
            state.customRangeEndDate = action.payload.customRangeEndDate;
        },
        updateOldCopy(state, action) {
            state.oldCopy.fromDate = action.payload.fromDate;
            state.oldCopy.toDate = action.payload.toDate;
            state.oldCopy.category = action.payload.category;
            state.oldCopy.range = action.payload.range;
            state.customRangeStartDate = action.payload.customRangeStartDate;
            state.customRangeEndDate = action.payload.customRangeEndDate;
        },
        updateExpenseSubCategoryId(state, action) {
            state.subId = action.payload;
        },
        updateCurrentExpensesId(state, action) {
            state.currentExpensesId = action.payload;
        },
        updateCurrentExpense(state, action) {
            state.currentExpense = action.payload;
        },
        updateCurrentCategoryId(state, action) {
            state.currentCategoryId = action.payload;
        },
        updateCurrentSubCategoryId(state, action) {
            state.currentSubId = action.payload;
        },
        updateCustomRangeStartEndDate(state, action) {
            state.customRangeStartEndDate = action.payload.startDate;
            state.customRangeEndDate = action.payload.endDate;
        }



    }
});

export const {
    updateClientsList,
    updateFetchingState,
    updateTotalSearchExpensesCount,
    updateExpensesList,
    updateMaxEntry,
    updateSearchExpensesMaxEntry,
    updateSearchExpensesFetchingState,
    updateSearchExpensesList,
    updateTotalExpensesCount,
    updateSearchClientFetchingState,
    updateSearchClientList,
    updateExpenseAmount,
    updateTotalSearchClientCount,
    updateExpenseId,
    decrementPageNumber,
    incrementPageNumber,
    incrementSearchClientPageNumber,
    decrementSearchPageNumber,
    updateIsExpensesExists,
    updateFilters,
    updateOldCopy,
    updateExpenseSubCategoryId,
    updateCurrentExpensesId,
    updateCurrentExpense,
    updateCurrentCategoryId,
    updateCurrentSubCategoryId,
    resetExpensesPageNo,
    updateCustomRangeStartEndDate

} = ExpensesSlice.actions;

export default ExpensesSlice.reducer;
