import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError, formatDate, formatTime} from "../Helpers";

const addEnquiryNotesAPI = async (followUpDate, followUpTime, leadId, leadOwner, leadStatus, notes) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/leads/addFollowupDetails", {
            business_id: await SecureStore.getItemAsync('businessId'),
            followup_date: formatDate(followUpDate, "yyyy-mm-dd"),
            followup_time: formatTime(followUpTime, "hh:mm:ss"),
            lead_id: leadId,
            lead_owner: leadOwner,
            lead_status: leadStatus,
            notes: notes,

        }, {
            headers: {
                'Authorization':
                    `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Add Enquiry Notes API")
    }
}

export default addEnquiryNotesAPI;