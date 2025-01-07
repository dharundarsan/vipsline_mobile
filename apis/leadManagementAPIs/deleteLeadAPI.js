import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../../util/Helpers";

const deleteLeadAPI = async (leadId) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/leads/deleteLeadsForBusiness", {
            business_id: await SecureStore.getItemAsync('businessId'),
            leads_id: leadId
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Edit Leads API")
    }
}

export default deleteLeadAPI;