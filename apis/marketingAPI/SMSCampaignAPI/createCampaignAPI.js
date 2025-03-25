import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function createCampaignAPI(name, template, credit_per_sms, customer_sub_type,customer_type_id, mobile_number_list, total_credits) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/createCampaign`, {

            "business_id": await SecureStore.getItemAsync('businessId'),
            "name": name,
            "customer_type_id": customer_type_id,
            "customer_subtype_id": customer_sub_type,
            "template": template,
            "totalCredits": total_credits,
            "creditPerSms": credit_per_sms,
            "mobile_list": mobile_number_list,
            "campaign_from": "Campaign"
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: get createCampaign API")
        return e.response;
    }
}