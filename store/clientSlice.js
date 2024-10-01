import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_BUSINESS_ID, EXPO_PUBLIC_AUTH_KEY} from "@env";
import {useSelector} from "react-redux";
import * as SecureStore from 'expo-secure-store';

const initialClientState = {
    pageNo: 0,
    clients: [],
    clientCount: [],
    isFetching: false,
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

export const loadClientsFromDb = () => async (dispatch, getState) => {

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clientSlice loadClientFromDb)" + e);
    }

    // let businessId = ""
    // try {
    //     const value = await AsyncStorage.getItem('businessId');
    //     if (value !== null) {
    //         return value;
    //     }
    // } catch (e) {
    // }


    const {client, authDetails} = getState();


    try {
        if (client.isFetching) return;
        dispatch(updateFetchingState(true));
        const response = await axios.post(

            `${process.env.EXPO_PUBLIC_API_URI}/business/getClientDetailsOfBusiness?pageNo=${0}&pageSize=50`,
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
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');

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
    }
}

export const clientSlice = createSlice({
    name: "client",
    initialState: initialClientState,
    reducers: {
        updateClientsList(state, action) {
            state.clients = action.payload;
            state.pageNo++;
        },
        updateClientCount(state, action) {
            state.clientCount = action.payload;
        },
        updateFetchingState(state, action) {
            state.isFetching = action.payload;
        },
        clearClientsList(state, action) {
            state.clients = [];
        }
    }
});

export const {updateClientsList, updateClientCount, updateFetchingState, clearClientsList} = clientSlice.actions;

export default clientSlice.reducer;
