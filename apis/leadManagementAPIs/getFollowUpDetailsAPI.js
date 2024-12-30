import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../../util/Helpers";

const getFollowUpDetailsAPI = async (leadId) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/leads/getFollowupDetailsByLeadId", {
            business_id: await SecureStore.getItemAsync('businessId'),
            lead_id: leadId,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Get Lead Follow Up Details API")
    }
}

export default getFollowUpDetailsAPI;