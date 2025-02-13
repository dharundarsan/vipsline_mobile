import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const calculateCommissionValueByIdAPI = async (type, commission_type, commission_value, data_id) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/calculateCommissionValueById", {
            type: type,
            commission_type: commission_type,
            commission_value: commission_value,
            data_id: data_id
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: calculate commission value by id API")
        return e.response;
    }
}

export default calculateCommissionValueByIdAPI;