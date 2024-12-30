import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import * as SecureStore from 'expo-secure-store';

export default async function getClientListApi() {

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside getClientListApi)" + e);
    }

    let businessId = ""
    try {
        // const value = await AsyncStorage.getItem('businessId');
        const value = await SecureStore.getItemAsync('businessId');
        if (value !== null) {
            businessId = value;
        }
    } catch (e) {
        console.log("businessId fetching error. (inside getClientListApi)" + e);
    }


    const api = process.env.EXPO_PUBLIC_API_URI + "/client/getClientReportBySegmentForBusiness";

    try {
        const response = await axios.post(api,
            {
                business_id: businessId,
                fromDate: "",
                sortItem: "name",
                sortOrder: "asc",
                toDate: "",
                type: "All",
        },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
        })
        return response.data;
    }
    catch (error){
            }

    return "not found"

}