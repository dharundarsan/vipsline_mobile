import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY} from "@env";


export default async function getDiscountAPI(data) {
    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/cart/getDiscountAmount",
            data,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        )
        return(response.data.data[0].percent_amount);
    } catch (error) {
        console.log("sendOtp error: " + error.response.message);
    }
}