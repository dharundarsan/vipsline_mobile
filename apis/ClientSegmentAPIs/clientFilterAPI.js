import axios from "axios";
import * as SecureStore from 'expo-secure-store';

export const clientFilterAPI = async (pageSize, filter, pageNo) =>  {
    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside clientFilterAPI)" + e);
    }

    let businessId = ""
    try {
        // const value = await AsyncStorage.getItem('businessId');
        const value = await SecureStore.getItemAsync('businessId');
        if (value !== null) {
            businessId = value;
        }
    } catch (e) {
        console.log("businessId fetching error.  (inside clientFilterAPI)" + e);
    }


    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URI}/client/getClientReportBySegmentForBusiness?pageNo=${pageNo}&pageSize=${pageSize}`,
            {
                business_id: `${businessId}`,
                fromDate: "",
                sortItem: "name",
                sortOrder: "asc",
                toDate: "",
                type: filter,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        let count = response.data.data.pop();
        return response.data.data;
    } catch (error) {
        console.error("Error fetching data1: ", error);
    }
};