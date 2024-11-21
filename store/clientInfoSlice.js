import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import * as SecureStore from 'expo-secure-store';

const initialClientInfoState = {
    isClientSelected: false,
    details: {},
    membershipDetails: [],
    membershipList: [],
    packageDetails: [],
    packageHistory: [],
    fetchingAnalytics: false,
    analyticDetails: [],
    prepaidDetails: [],
    prepaidCount: 0,
    clientId: "",

    totalSales: 0,
    pageNo: 0,
    maxEntry: 10,

};

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

export const loadClientInfoFromDb = (clientId) => async (dispatch) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clientInfoSlice loadClientInfoFromDb)" + e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/business/getClientDetailById`,
            {
                client_id: clientId,
                business_id: await getBusinessId(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );

        if(response.data.data[0].wallet_status) {
            try {

                const prepaidDetails = await axios.post(
                    `${process.env.EXPO_PUBLIC_API_URI}/wallet/getWalletHistoryByClientForBusiness?pageNo=0&pageSize=50`,
                    {
                        client_id: clientId,
                        business_id: await getBusinessId(),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                );
                dispatch(updatePrepaidCount(prepaidDetails.data.data.pop()));
                dispatch(updatePrepaidDetails(prepaidDetails.data.data));
            }
            catch (e) {
                console.log("prepaid error " + e )
            }
        }
        const membershipDetails = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/membership/getListOfActiveMembershipForClient`,
            {
                client_id: clientId,
                business_id: await getBusinessId(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        const membershipList = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/membership/getListOfMembershipForClient`,
            {
                client_id: clientId,
                business_id: await getBusinessId(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        const packageDetails = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/package/getListOfActiveClientPackageDetailByClientId`,
            {
                client_id: clientId,
                business_id: await getBusinessId(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        const packageList = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/package/getListOfClientPackageDetailByClientId`,
            {
                client_id: clientId,
                business_id: await getBusinessId(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        const data = {
            membershipDetails: membershipDetails.data.data,
            packageDetails: packageDetails.data.data,
            packageList: packageList.data.data,
            membershipList: membershipList.data.data,
            response: response.data.data[0],

        }
        dispatch(setDetails(data));

    } catch (error) {
        console.error("Error fetching data client info slice: " + error);
    }
};

export const loadAnalyticsClientDetailsFromDb = (user_id) => async (dispatch, getState) => {
    const {clientInfo} = getState();
    // if(clientFilter.fetchingAnalytics) return;

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clientInfoSlice loadAnalyticDataFromDb)" + e);
    }



    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getAnalyticsForBusinessByCustomer?pageSize=${clientInfo.maxEntry}&pageNo=${clientInfo.pageNo}`,
            {
                business_id: await getBusinessId(),
                user_id: user_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );


        dispatch(updateAnalyticDetails(response.data.data[0]));
        dispatch(updateTotalSales(response.data.data[0].total_appointments));
    } catch (e) {
        console.log("error1" + e)
    }

    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/analytics/getFeedbackByClient?pageNo=0&pageSize=100",
            {
                business_id: await getBusinessId(),
                client_id: user_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            }
        );
        dispatch(updateFeedback(response.data.data[0].no_of_feedbacks));
    } catch (e) {
    }

}

export const packageHistoryDetails = (package_id) => async (dispatch, getState) => {

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clientInfoSlice loadClientInfoFromDb)" + e);
    }
    const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URI}/package/getClientPackageDetailById`,
        {
            client_package_id: package_id,
            business_id: await getBusinessId(),
        },
        {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        }
    );

    dispatch(updatePackageHistoryDetails(response.data.data[0]));
}

export const clientInfoSlice = createSlice({
    name: "clientInfo",
    initialState: initialClientInfoState,
    reducers: {
        setDetails(state, action) {
            state.isClientSelected = true;
            state.details = action.payload.response;
            state.membershipDetails = action.payload.membershipDetails;
            state.membershipList = action.payload.membershipList;
            state.packageDetails = action.payload.packageDetails;
            state.packageList = action.payload.packageList;
        },
        clearClientInfo(state, action) {
            state.details = {};
            state.isClientSelected = false;
        },
        updateAnalyticDetails(state, action) {
            state.analyticDetails = action.payload;
        },
        updateFeedback(state, action) {
            state.analyticDetails["feedbacks"] = action.payload;
        },
        updateClientId(state, action) {
            state.clientId = action.payload;
        },
        updateTotalSales(state, action) {
            state.totalSales = action.payload;
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
        updateSalesMaxEntry(state, action) {
            state.maxEntry = action.payload;
        },
        updatePageNo(state, action) {
            state.pageNo = action.payload;
        },
        updatePrepaidDetails(state, action) {
            state.prepaidDetails = action.payload;
        },
        updatePrepaidCount(state, action) {
            state.prepaidCount = action.payload;
        },
        updatePackageHistoryDetails(state, action) {
            state.packageHistory = action.payload;
        }
    }
});


export const {
    setDetails,
    clearClientInfo,
    updateAnalyticDetails,
    updateFeedback,
    updateClientId,
    updateTotalSales,
    decrementPageNumber,
    incrementPageNumber,
    updateSalesMaxEntry,
    updatePageNo,
    updatePrepaidDetails,
    updatePrepaidCount,
    updatePackageHistoryDetails,
} = clientInfoSlice.actions;

export default clientInfoSlice.reducer;
