import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const addServicesForStaff = async (resource_id, services) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/addMultipleServicesForResource", {
            resource_id: resource_id,
            services: services
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: update Staff services API")
        return e.response;
    }
}

export default addServicesForStaff;