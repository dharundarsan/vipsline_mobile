import axios from "axios";
import {EXPO_PUBLIC_API_URI} from "@env";
import * as SecureStore from 'expo-secure-store';
export default async function authenticateWithOTPApi(mobileNumber, otp, platform) {
    let isAuthenticated;

    const BaseURL = process.env.EXPO_PUBLIC_API_URI
    let message = '';
    try {
        const response = await axios.post(BaseURL + "/authenticateWithOtp", {
            userName: mobileNumber,
            otp: otp,
            platform: platform,
        });
        message = response.data.message;

        try {
            // await AsyncStorage.setItem('authKey', response.data.other_message);
            await SecureStore.setItemAsync('authKey',response.data.other_message)
        } catch (e) {
        }

        if (message === "User authenticated") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}