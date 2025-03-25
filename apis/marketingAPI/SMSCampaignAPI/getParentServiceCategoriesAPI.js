import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getParentServiceCategoriesAPI() {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/resourceCategory/getParent`, {
            business_id: await SecureStore.getItemAsync('businessId'),

        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: /resourceCategory/getParent API")
        throw e.response;
    }
}