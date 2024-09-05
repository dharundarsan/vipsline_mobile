import axios from "axios";

const calculateCartPriceAPI = async (data) => {
    try {
        console.log("API DATA")
        console.log(data)
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + '/appointment/compute/calculatePriceAtCheckout', {
                ...data,
                business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            })
        console.log("RESULT")
        console.log(response.data.data)
        return response.data.data;
    } catch (error) {
    }
}

export default calculateCartPriceAPI;