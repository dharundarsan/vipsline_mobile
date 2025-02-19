import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default async function getListOfDataToDisplayForStaffCommissionProfile(
    type,
    commission_id = undefined,
    commission_value = undefined,
    commission_type = undefined,
) {
    try {

        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/getListOfDatasToDisplayForMobileApp", {
            business_id: await SecureStore.getItemAsync('businessId'),
            commission_id: commission_id,
            commission_value: commission_value,
            commission_type: commission_type,
            type: type,
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        });

        if (!response.data.data) {
            return console.error("API response does not contain expected data");
        }



        return response.data.data;

    } catch (e) {
        console.error("Error: Get Staff schedules API111");
    }
};