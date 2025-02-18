import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const getCommissionProfileDetailsAPI = async (profile_id) => {

    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/getCommissionProfileDetailsById", {
            business_id: await SecureStore.getItemAsync('businessId'),
            profile_id: profile_id,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: get commission profile by id API")
        return e.response;

    }
}

export default getCommissionProfileDetailsAPI;