import axios from "axios";

export default async function authenticateWithOTPApi(mobileNumber, otp, platform) {
    let isAuthenticated = false;
    const BaseURL = process.env.EXPO_PUBLIC_API_URI
    let message = '';
    try {
        console.log(`${otp} ${mobileNumber} ${platform}`);
        const response = await axios.post(BaseURL + "/authenticateWithOtp", {
            userName: mobileNumber,
            otp: otp,
            platform: platform,
        });
        isAuthenticated = true
        message = response.data.message;
    }
    catch (error) {
        console.log("incorrect Otp: " + error);
        isAuthenticated = false;
    }
    if(message === "User authenticated") {
        console.log(message + "with OTP");
        isAuthenticated = true;
    }
    else {
        isAuthenticated = false;
    }

    return isAuthenticated
}