import {useDispatch} from "react-redux";
import axios from "axios";
import {updateBusinessNotificationDetails} from "../../store/listOfBusinessSlice";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";

export default async function getBusinessNotificationDetailsAPI(businessId) {
    const dispatch = useDispatch();
    console.log("fun ction callledddddd")
    try{
        const response = await axios.post(
            process.env.EXPO_PUBLIC_API_URI + "/business/getBusinessNotificationDetails",
            {
                business_id: businessId,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                }
            }
        );
        console.log("APIIIIIIII")
        console.log(response.data.data[0]);
        // dispatch(updateBusinessNotificationDetails(response.data.data[0]));
    }
    catch(error){
        console.error("Error business notification details data:", error);
    }


}
