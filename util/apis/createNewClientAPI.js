import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";

export default async function createNewClientAPI(data) {
    const api = process.env.EXPO_PUBLIC_API_URI + "/user/addWalkInUser";
    try{
        const response = await axios.post(api,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            })
    } catch (e) {
        throw e.response.data.other_message;
    }
}