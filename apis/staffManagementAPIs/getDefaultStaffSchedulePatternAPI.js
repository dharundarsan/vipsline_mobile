import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const getDefaultStaffSchedulePatternAPI = async (schedule_type) => {

    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/getDefaultStaffSchedulePattern", {
            business_id: await SecureStore.getItemAsync('businessId'),
            schedule_type: schedule_type === 1 ?
                "WEEKLY" : schedule_type === 2 ?
                    "EVERY_2_WEEKS" : schedule_type === 3 ?
                        "EVERY_3_WEEKS" : schedule_type === 4 ?
                            "EVERY_4_WEEKS" : "WEEKLY"
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: get default schedule API")
        return e.response;

    }
}

export default getDefaultStaffSchedulePatternAPI;