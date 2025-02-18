import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const updateCommissionProfileMappingAPI = async (resource_id, commission_id) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/update",
            {
                resource_id: resource_id,
                data: {
                    business_id: await SecureStore.getItemAsync('businessId'),
                    commission_id: commission_id,
                },

            }, {
                headers: {
                    'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
                }
            })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: update commission mapping API");
        return e.response;
    }
}

export default updateCommissionProfileMappingAPI;