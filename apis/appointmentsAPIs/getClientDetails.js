import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../../util/Helpers";

const getClientDetailsByIdAPI = async (data) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + `/business/getClientDetailById`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            ...data
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Get Client Detail API")
        throw e.response;
    }
}

export default getClientDetailsByIdAPI;