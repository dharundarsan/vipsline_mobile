import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import {useDispatch} from "react-redux";
import { loadCartFromDB } from "../../store/cartSlice";

export default async function clearCartAPI(businessId) {
    const api = process.env.EXPO_PUBLIC_API_URI + "/cart/clearCart2ByUser";
    console.log("1")
    try {
        const response = await axios.post(api,
            {
                business_id:businessId
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            });
            console.log("2")
            
            console.log(response.data);
        } catch (e) {
            // throw e.response.data.other_message;
            console.log(e.response.data);
            console.log("1234567")
        }
        console.log("2")
}