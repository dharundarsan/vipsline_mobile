import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getListOfSMSTemplatesByType(template_type) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/getListofSmsTemplatesByType`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            template_type: template_type,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: get list of customer segment types API")
        throw e.response;
    }
}