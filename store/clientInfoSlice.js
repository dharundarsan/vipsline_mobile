import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialClientInfoState = {
    isClientSelected: false,
    details: {},
    membershipDetails:[],
    packageDetails:[],
    fetchingAnalytics: false,
    analyticDetails: [],
    clientId: "",
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

export const loadClientInfoFromDb = (clientId) => async (dispatch) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
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
        const data = {
            membershipDetails: membershipDetails.data.data,
            packageDetails: packageDetails.data.data,
            response: response.data.data[0],
        }
        dispatch(setDetails(data));

    } catch (error) {
        console.error("Error fetching data client info slice: " + error);
    }
};

export const loadAnalyticsClientDetailsFromDb = (pageSize, pageNo, user_id) => async (dispatch, getState) => {
    // const {clientFilter} = getState();
    // if(clientFilter.fetchingAnalytics) return;

    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clientInfoSlice loadAnalyticDataFromDb)" + e);
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/analytics/getAnalyticsForBusinessByCustomer?pageSize=10&pageNo=0`,
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
    }
    catch (e) {
        console.log("error" + e)
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
    }
    catch (e) {
            }

}

export const clientInfoSlice = createSlice({
    name: "clientInfo",
    initialState: initialClientInfoState,
    reducers: {
        setDetails(state, action) {
            state.isClientSelected = true;
            state.details = action.payload.response;
            state.membershipDetails = action.payload.membershipDetails;
            state.packageDetails = action.payload.packageDetails;
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
        }
    }
});



export const {
    setDetails,
    clearClientInfo,
    updateAnalyticDetails,
    updateFeedback,
    updateClientId
} = clientInfoSlice.actions;

export default clientInfoSlice.reducer;
