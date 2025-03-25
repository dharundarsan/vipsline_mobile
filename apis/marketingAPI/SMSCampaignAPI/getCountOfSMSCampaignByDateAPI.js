import axios from "axios";
import * as SecureStore from "expo-secure-store";
import moment from "moment";

export default async function getCountOfSMSCampaignByDateAPI(fromDate, toDate) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/getCountOfSmsCampaignsByDate`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            fromDate: fromDate,
            toDate: toDate,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: getCountOfSMSCampaignByDateAPI")
        throw e.response;
    }
}