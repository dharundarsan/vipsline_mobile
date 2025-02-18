import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const deleteStaffCommissionAPI = async (id) => {

    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/deleteCommissionProfile", {
            business_id: await SecureStore.getItemAsync('businessId'),
            id: id
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: delete Shift timing API")
        return e.response;

    }
}

export default deleteStaffCommissionAPI;