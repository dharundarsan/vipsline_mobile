import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";

export default async function getClientListApi() {
    const api = process.env.EXPO_PUBLIC_API_URI + "/client/getClientReportBySegmentForBusiness";

    try {
        const response = await axios.post(api,
            {
                business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
                fromDate: "",
                sortItem: "name",
                sortOrder: "asc",
                toDate: "",
                type: "All",
        },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
        })
        return response.data;
    }
    catch (error){
        console.log(error);
    }

    return "not found"

}