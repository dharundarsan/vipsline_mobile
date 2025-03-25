import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getListOfClientByFilters(pageNo, pageSize, payload) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/client/getListOfClientByFilter?pageNo=${pageNo}&pageSize=${pageSize}`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            ...payload,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: getListOfClientByFilter API")
        throw e.response;
    }
}