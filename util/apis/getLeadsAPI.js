import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../Helpers";

const getLeadsAPI = async (pageNo, pageSize, search_term) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/leads/getLeadsByBusiness?pageNo=" + pageNo + "&pageSize=" + pageSize, {
            business_id: await SecureStore.getItemAsync('businessId'),
            search_term,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Get Leads API")
    }
}

export default getLeadsAPI;