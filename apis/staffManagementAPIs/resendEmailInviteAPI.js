import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const resendEmailInvite = async (resource_id, user_id) => {
    try {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_URI + "/resource/resendPasswordEmailToStaff", {
            business_id: await SecureStore.getItemAsync('businessId'),
            resource_id: resource_id,
            staff_user_id: user_id
        }, {
            headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('authKey')}`
            }
        })
        // checkAPIError(response)
        return response;
    } catch (e) {
        console.log("Error: resend email invite API")
        return e.response;
    }
}

export default resendEmailInvite;