import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {checkAPIError, formatDate, formatTime} from "../../util/Helpers";

const editEnquiryNotes = async (followUpDate, followUpTime, leadId, leadOwner, leadStatus, notes, leadFollowUpId) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/leads/updateFollowupDetails", {
            business_id: await SecureStore.getItemAsync('businessId'),
            followup_date: formatDate(followUpDate, "yyyy-mm-dd"),
            followup_time: formatTime(followUpTime, "hh:mm:ss"),
            lead_id: leadId,
            lead_owner: leadOwner,
            lead_status: leadStatus,
            notes: notes,
            lead_follow_up_id: leadFollowUpId,

        }, {
            headers: {
                'Authorization':
                    `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        checkAPIError(response)
        return response;
    } catch (e) {
        console.error("Error: Edit Enquiry Notes API")
    }
}

export default editEnquiryNotes;