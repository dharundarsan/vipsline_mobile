import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getAllowedPagesForStaffAPI(resource_id) {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/getAllowedPagesForStaff", {
            business_id:  await SecureStore.getItemAsync('businessId'),
            resource_id: resource_id,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: get permission for staff API")
        return e.response;

    }
}