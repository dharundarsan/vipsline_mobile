import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import * as SecureStore from 'expo-secure-store';

export default async function deleteExpenseAPI(id) {

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error.(inside deleteClientAPI)" + e);
    }

    let businessId = ""
    try {
        // const value = await AsyncStorage.getItem('businessId');
        const value = await SecureStore.getItemAsync('businessId');
        if (value !== null) {
            businessId = value;
        }
    } catch (e) {
        console.log("businessId fetching error.  (inside clientFilterAPI)" + e);
    }

    console.log(id)

    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/expense/deleteExpense",
            {
                business_id: businessId,
                expense_id: id,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        )
    } catch (error) {
    }
}