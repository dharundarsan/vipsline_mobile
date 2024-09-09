import axios from "axios";

const calculateCartPriceAPI = async (data) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + '/appointment/compute/calculatePriceAtCheckout', {
                ...data,
                business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            })
            console.log("123");
            
        return response.data.data;
    } catch (error) {
    }
}

export default calculateCartPriceAPI;