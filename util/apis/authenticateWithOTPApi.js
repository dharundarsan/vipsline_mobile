import axios from "axios";
import {EXPO_PUBLIC_API_URI} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function authenticateWithOTPApi(mobileNumber, otp, platform) {
    let isAuthenticated;

    const BaseURL = process.env.EXPO_PUBLIC_API_URI
    let message = '';
    try {
        // console.log(`${otp} ${mobileNumber} ${platform}`);
        const response = await axios.post(BaseURL + "/authenticateWithOtp", {
            userName: mobileNumber,
            otp: otp,
            platform: platform,
        });
        message = response.data.message;

        try {
            await AsyncStorage.setItem('authKey', response.data.other_message);
        } catch (e) {
            console.log("error storing auth token" + e);
        }

        if (message === "User authenticated") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("incorrect Otp: " + error);
        return false;
    }
}