// import axios from "axios";
// import * as SecureStore from "expo-secure-store";
// import {checkAPIError} from "../../util/Helpers";
//
//  export default async function GetSchedulesForStaffByDatesAPI() {
//     try {
//         const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/staffschedule/getScheduleForAStaffByDates", {
//             business_id: await SecureStore.getItemAsync('businessId'),
//             start_date: start_date,
//             end_date: end_date,
//             resource_id: resource_id,
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
//             }
//         })
//         return response;
//     } catch (e) {
//         console.error("Error: Get Staff List API")
//         return e.response;
//     }
// }