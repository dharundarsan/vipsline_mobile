import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getSMSCreditBalanceAPI(pageNo, pageSize) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/getSMSCreditBalance`, {
            businessId: await SecureStore.getItemAsync('businessId'),
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: getListOfCampaignAPI")
        throw e.response;
    }
}