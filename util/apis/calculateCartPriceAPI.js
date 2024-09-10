import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const calculateCartPriceAPI = async (data) => {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside calculateCartPriceAPI)" + e);
    }


    let businessId = ""
    try {
        const value = await AsyncStorage.getItem('businessId');
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
        return response.data.data;
    } catch (error) {
    }
}

export default calculateCartPriceAPI;