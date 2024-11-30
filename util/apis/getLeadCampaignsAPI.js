import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../Helpers";

const getLeadCampaignsAPI = async (leadSourceId) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/leads/getListOfCampaignNameById", {
            business_id: await SecureStore.getItemAsync('businessId'),
            lead_source_id: leadSourceId,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Get Lead Campaigns API")
    }
}

export default getLeadCampaignsAPI;