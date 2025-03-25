import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getListOfPromotionTypesAPI(type) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/getListOfPromotionTypes`, {
            type: type,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: get list of promotion types API")
        throw e.response;
    }
}