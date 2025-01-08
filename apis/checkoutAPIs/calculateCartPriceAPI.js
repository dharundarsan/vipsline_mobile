import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const calculateCartPriceAPI = async (data) => {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside calculateCartPriceAPI)" + e);
    }


    let businessId = ""
    try {
        // const value = await AsyncStorage.getItem('businessId');
        const value = await SecureStore.getItemAsync('businessId');
        if (value !== null) {
            businessId = value;
        }
    } catch (e) {
        console.log("businessId fetching error. (inside calculateCartPriceAPI)" + e);
    }

    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + '/appointment/compute/calculatePriceAtCheckout', {
                ...data,
                business_id: businessId,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
        if(response.data.status_code > 400){
            throw response;
        }
        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export default calculateCartPriceAPI;