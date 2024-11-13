import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import * as SecureStore from 'expo-secure-store';
import moment from "moment";

export default async function addExpensesAPI(data, id, subId) {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside creatNewClientAPI)" + e);
    }

    async function getBusinessId() {
        let businessId = ""
        try {
            // const value = await AsyncStorage.getItem('businessId');
            const value = await SecureStore.getItemAsync('businessId');
            if (value !== null) {
                return value;
            }
        } catch (e) {
        }
    }

    const api = process.env.EXPO_PUBLIC_API_URI + "/expense/addExpense";
    let response;
    try {
        response = await axios.post(api,
            {
                amount: data.amount,
                business_id: await getBusinessId(),
                date: moment(data.expenseDate).format("YYYY-MM-DD"),
                expense_cat_id: id,
                expense_sub_cat_id: subId,
                notes: data.notes,
                payment_mode: data.paymentMode.toUpperCase(),
                reference: data.reference,
            },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
    } catch (e) {
        return false
    }
    if (response.data.message === "Expense created successfully") {
        return true;
    } else {
        return false;
    }
}