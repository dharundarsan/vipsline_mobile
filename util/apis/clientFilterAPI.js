import axios from "axios";

export const clientFilterAPI = async (pageSize, filter, pageNo) =>  {
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/client/getClientReportBySegmentForBusiness?pageNo=${pageNo}&pageSize=${pageSize}`,
            {
                business_id: `${process.env.EXPO_PUBLIC_BUSINESS_ID}`,
                fromDate: "",
                sortItem: "name",
                sortOrder: "asc",
                toDate: "",
                type: filter,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );
        let count = response.data.data.pop();
        return response.data.data;
    } catch (error) {
        console.error("Error fetching data1: ", error);
    }
};