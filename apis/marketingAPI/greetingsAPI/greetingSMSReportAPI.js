import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {getBusinessId} from "../../../store/cartSlice";

export default async function greetingSMSReportAPI(fromDate, toDate, pageNo, pageSize) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/marketing_campaign/getGreetingsReportByBusiness?pageNo=${pageNo}&pageSize=${pageSize}`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            fromDate: fromDate,
            toDate: toDate,

        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.error("Error: greeting SMS report API")
        throw e;
    }
}