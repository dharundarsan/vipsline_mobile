import {View, StyleSheet} from "react-native";
import SignInHeader from "../components/authScreen/SignInHeader";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import Colors from "../constants/Colors";
import {useState} from "react";
import ForgetPasswordEmailOrNumber from "../components/forgetPasswordScreen/ForgetPasswordEmailOrNumber";
import ForgetPasswordOTP from "../components/forgetPasswordScreen/ForgetPasswordOTP";

export default function ForgetPasswordScreen() {
    function sendOtpHandler() {
        setIsOtp(true);
    }

    function backHandler() {
        setIsOtp(false);
    }

    /**
     * @constant {isOtp}  - send otp button is clicked or not in {ForgetPasswordEmailOrNumber} screen
     */

    const [isOtp, setIsOtp] = useState(false);

    const [mobileNumber, setMobileNumber] = useState("");

    // console.log("mobile number", mobileNumber);

    return(
        <>
        <SafeAreaView style={styles.safeAreaView}>
            <StatusBar style="light" />
            <View style={styles.forgetPassword}>
                <SignInHeader />
                {
                    isOtp ?
                        <ForgetPasswordOTP backHandler={backHandler} mobileNumber={mobileNumber} /> :
                        <ForgetPasswordEmailOrNumber otpHandler={sendOtpHandler} setMobileNumber={setMobileNumber} />
                }

            </View>

        </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: Colors.onBackground,
    },
    forgetPassword: {
        flex: 1,
        backgroundColor: Colors.white,

    },

})