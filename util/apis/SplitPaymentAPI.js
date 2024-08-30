import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY} from "@env";


export default async function splitPaymentAPI(data) {
    console.log("DATA")
    console.log(data)
    try {
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/appointment/getDifferenceInAmount",
            data,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        )
        console.log("API")
        console.log(response.data.data)
        return(response.data.data)
    } catch (error) {
        console.log("sendOtp error: " + error.response.message);
    }
}