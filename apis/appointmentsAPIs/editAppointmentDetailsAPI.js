import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../../util/Helpers";

const editAppointmentDetailsAPI = async (data) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + `/calendarBookings/editAppointmentDetails`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            ...data
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: Edit Appointment Details API")
        return e.response;
    }
}

export default editAppointmentDetailsAPI;