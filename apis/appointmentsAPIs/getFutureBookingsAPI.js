import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError} from "../../util/Helpers";

const getFutureBookingsAPI = async (pageNo, maxEntry, data) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + `/appointment/byBusiness/fromTo/futureBookings?pageSize=${maxEntry}&pageNo=${pageNo}`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            ...data
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Get Future Bookings API")
        throw e.response;
    }
}

export default getFutureBookingsAPI;