import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const createSchedulePatternAPI = async (payload) => {

    try {
        const response = await axios.put(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/createSchedulePattern", {
            ...payload
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: update schedule pattern API")
        return e.response;

    }
}

export default createSchedulePatternAPI;