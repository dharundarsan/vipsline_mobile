import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const updateCommissionProfileAPI = async (data) => {
    try {
        const response = await axios.put(process.env.EXPO_PUBLIC_API_URI + "/resource/updateCommissionProfile",
            {
                ...data
            }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: update commission API");
        return e.response;
    }
}

export default updateCommissionProfileAPI;