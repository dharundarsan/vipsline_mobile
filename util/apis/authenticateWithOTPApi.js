import axios from "axios";
import {EXPO_PUBLIC_API_URI} from "@env";

export default async function authenticateWithOTPApi(mobileNumber, otp, platform) {
    let isAuthenticated;
    const BaseURL = process.env.EXPO_PUBLIC_API_URI
    let message = '';
    try {
        console.log(`${otp} ${mobileNumber} ${platform}`);
        const response = await axios.post(BaseURL + "/authenticateWithOtp", {
            userName: mobileNumber,
            otp: otp,
            platform: platform,
        });
        message = response.data.message;
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