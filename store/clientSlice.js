import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialClientState = {
    pageNo: 0,
    clients: []
};

// Helper function to check for unique clients
const getUniqueClients = (existingClients, newClients) => {
    const existingClientIds = new Set(existingClients.map(client => client.id)); // Assuming `id` is the unique identifier

    return newClients.filter(client => !existingClientIds.has(client.id));
};

export const loadClientsFromDb = (pageNo) => async (dispatch) => {
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/business/getClientDetailsOfBusiness?pageNo=${pageNo}&pageSize=5`,
            {
                business_id: "9359e749-b190-40f4-9953-f0c24fd1a1db",
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );
        dispatch(updateClientsList(response.data.data));
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
};

export const clientSlice = createSlice({
    name: "client",
    initialState: initialClientState,
    reducers: {
        updateClientsList(state, action) {
            const uniqueClients = getUniqueClients(state.clients, action.payload);
            state.pageNo++;
            state.clients.push(...uniqueClients);
        },
    }
});

export const { updateClientsList } = clientSlice.actions;

export default clientSlice.reducer;
