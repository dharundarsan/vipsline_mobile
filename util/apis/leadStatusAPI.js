import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../Helpers";

const leadStatusAPI = async () => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/leads/getListOfLeadsStatus", {}, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Lead status API")
    }
}

export default leadStatusAPI;