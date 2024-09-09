import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialClientState = {
    pageNo: 0,
    clients: [],
    clientCount: [],
    isFetching: false,
};

async function getBusinessId() {
    let businessId = ""
    try {
        const value = await AsyncStorage.getItem('businessId');
        if (value !== null) {
            return value;
        }
    } catch (e) {
        console.log("business token fetching error." + e);
    }
}

export const loadClientsFromDb = () => async (dispatch, getState) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clientSlice loadClientFromDb)" + e);
    }

    const { client } = getState();
    if (client.isFetching) return;

    try {
        dispatch(updateFetchingState(true));
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/business/getClientDetailsOfBusiness?pageNo=${client.pageNo}&pageSize=20`,
            {
                business_id: await getBusinessId(),
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        dispatch(updateClientsList(response.data.data));
        dispatch(updateFetchingState(false));
    } catch (error) {
        console.error("Error fetching data: ", error);
        dispatch(updateFetchingState(false));
    }
};

export const loadClientCountFromDb = () => async (dispatch) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clientSlice loadClientCountFromDb)" + e);
    }

    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/client/getClientCountBySegmentForBusiness",
            {
                business_id: await getBusinessId()
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
        dispatch(updateClientCount(response.data.data));
    } catch (error) {
        console.log("fetching the client count error: " + error)
    }
}

export const clientSlice = createSlice({
    name: "client",
    initialState: initialClientState,
    reducers: {
        updateClientsList(state, action) {
            state.clients.push(...action.payload);
            state.pageNo++;
        },
        updateClientCount(state, action) {
            state.clientCount = action.payload;
        },
        updateFetchingState(state, action) {
            state.isFetching = action.payload;
        }
    }
});

export const {updateClientsList, updateClientCount, updateFetchingState} = clientSlice.actions;

export default clientSlice.reducer;
