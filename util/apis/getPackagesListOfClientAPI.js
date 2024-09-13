import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function getPackagesListOfClientAPI(clientId, businessId) {
    let authToken = "";
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error: " + e);
    }

    const api =  process.env.EXPO_PUBLIC_API_URI + "/package/getListOfClientPackageDetailByClientId";
    try {
        const response = await axios.post(api,
            {
                client_id: clientId,
                business_id: businessId
            },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        );

        const activePackages = response.data.data.filter(item => item.validity === "Active");
        return activePackages;

    } catch (e) {
        console.error("API error: ", e.response?.data || e.message);
        return []; // Return an empty array or handle errors accordingly
    }
}
