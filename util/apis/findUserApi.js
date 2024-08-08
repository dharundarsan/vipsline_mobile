import axios from "axios";
import {EXPO_PUBLIC_API_URI} from "@env";
/**
 * Finds a user by email and platform using the VIPS Line API.
 * use await in front of the function call since for sending OTP takes time
 *
 * @param {string} email  - The email / mobile number of the user to find.
 * @param {string} platform - The platform to search on for ex: BUSINESS or CUSTOMER.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the user was found.
 *
 */

export default async function findUser(email, platform) {
    const BaseURL = process.env.EXPO_PUBLIC_API_URI;
    let isFound = false;
    let response = "something went wrong"
    try {
        response = await axios.post(BaseURL + '/user/findUser', {
            platform: platform,
            userName: email
        })
        isFound = true;
    }
    catch (error) {
        console.log("user not found: " + error);
        isFound = false;
    }

    // console.log(response);
    return isFound;
}

