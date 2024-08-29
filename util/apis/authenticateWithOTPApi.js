import axios from "axios";
import {EXPO_PUBLIC_API_URI} from "@env";
import {useDispatch} from "react-redux";
import {updateAuthStatus} from "../../store/authSlice";

export default async function authenticateWithOTPApi(mobileNumber, otp, platform) {
    let isAuthenticated;
    const BaseURL = process.env.EXPO_PUBLIC_API_URI
    let message = '';
    const dispatch = useDispatch();
    try {
        console.log(`${otp} ${mobileNumber} ${platform}`);
        const response = await axios.post(BaseURL + "/authenticateWithOtp", {
            userName: mobileNumber,
            otp: otp,
            platform: platform,
        });
        message = response.data.message;
        if (message === "User authenticated") {
            dispatch(updateAuthStatus(true));
        } else {
            dispatch(updateAuthStatus(false));
        }
    } catch (error) {
        console.log("incorrect Otp: " + error);
        dispatch(updateAuthStatus(false));
    }
}