import axios from "axios";

export default async function getClientListApi() {
    const api = "https://gamma.vipsline.com/api/v1/client/getClientReportBySegmentForBusiness";

    try {
        const response = await axios.post(api,
            {
                business_id: "9359e749-b190-40f4-9953-f0c24fd1a1db",
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