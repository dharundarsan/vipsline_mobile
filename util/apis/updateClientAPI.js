import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";

    export default async function updateClientAPI(clientId, data) {
    const api = process.env.EXPO_PUBLIC_API_URI + "/client/editClient";
    console.log(data);
    console.log("clientId: "+clientId);
    try {
        const response = await axios.put(api,
            {
                client_id: clientId,
                data: data
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            });

        console.log(response.data)
    } catch (e) {
        // throw e.response.data.other_message;
        console.log(e.response.data);
    }
}