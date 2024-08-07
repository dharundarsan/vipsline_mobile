import axios from "axios";
import findUser from "./findUserApi";

export default async function sendOTPApi(mobileNumber, platform) {
    let otpSend = false;
    const BaseURL = process.env.EXPO_PUBLIC_API_URI;
    if(await findUser(mobileNumber, platform)) {
        try {
            const response = await axios.post(
                BaseURL + "/user/sendOtp",
                {
                    userName:mobileNumber,
                    platform:platform,
                })
            otpSend = true
        }
        catch (error) {
            console.log("sendOtp error: " + error);
            otpSend = false;
        }
        return otpSend;
    }




}