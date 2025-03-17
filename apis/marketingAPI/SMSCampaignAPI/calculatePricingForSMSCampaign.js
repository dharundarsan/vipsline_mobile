import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function calculatePricingForSMSCampaign(template_string) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/calculatePricingForSmsCampaign`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            is_test_sms: false,
            mobile_list: [],
            template_string: template_string,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: get count of sms of campaign by date")
        throw e.response;
    }
}