import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getListOfCustomerSegmentTypesAPI() {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URI}/client/getListOfCustomerSegmentTypes`, {
            businessId: await SecureStore.getItemAsync('businessId'),
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        return response;
    } catch (e) {
        console.log("Error: get list of customer segment types API")
        throw e.response;
    }
}