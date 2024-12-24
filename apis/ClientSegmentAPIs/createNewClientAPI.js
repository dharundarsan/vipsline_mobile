import axios from "axios";
import {EXPO_PUBLIC_API_URI, EXPO_PUBLIC_AUTH_KEY, EXPO_PUBLIC_BUSINESS_ID} from "@env";
import * as SecureStore from 'expo-secure-store';

export default async function createNewClientAPI(data) {

    let authToken = ""
    try {
        // const value = await AsyncStorage.getItem('authKey');
        const value = await SecureStore.getItemAsync('authKey');
        if (value !== null) {
            authToken = value;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside creatNewClientAPI)" + e);
    }

    const api = process.env.EXPO_PUBLIC_API_URI + "/user/addWalkInUser";
    let response;
    try{
        response = await axios.post(api,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
    } catch (e) {
        console.log("already exists from api")
        return false
    }
    if(response.data.message === "User added Successfully") {
        return response.data.other_message;
    }
    else {
        return false;
    }
}