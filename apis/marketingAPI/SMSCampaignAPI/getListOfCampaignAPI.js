import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getListOfCampaignAPI(pageNo, pageSize) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/getListOfCampaign?pageNo=${pageNo}&pageSize=${pageSize}`, {
            businessId: await SecureStore.getItemAsync('businessId'),
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: get list of campaign API")
        throw e.response;
    }
}