import {useDispatch} from "react-redux";
import axios from "axios";
import {updateBusinessNotificationDetails} from "../../store/listOfBusinessSlice";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function getBusinessNotificationDetailsAPI() {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error.(inside getBusinessNotificationDetailsAPI)" + e);
    }


    let businessId = ""
    try {
        const value = await AsyncStorage.getItem('businessId');
        if (value !== null) {
            businessId = value;
        }
    } catch (e) {
        console.log("businessID fetching error. (inside getBusinessNotificationDetailsAPI)" + e);
    }

    const dispatch = useDispatch();
    // console.log("fun ction callledddddd")
    try{
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/business/getBusinessNotificationDetails",
            {
                business_id: businessId,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        // console.log("APIIIIIIII")
        // console.log(response.data.data[0]);
    }
    catch(error){
        console.error("Error business notification details data:", error);
    }


}
