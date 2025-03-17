import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getListOfSegmentSubType(customer_type_id) {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/client/getListOfSegmentSubType`, {
            business_id: await SecureStore.getItemAsync('businessId'),
            customer_type_id: customer_type_id,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: getListOfSegmentSubType API")
        throw e.response;
    }
}