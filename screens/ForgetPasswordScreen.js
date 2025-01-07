import {View, StyleSheet} from "react-native";
import SignInHeader from "../components/authScreen/SignInHeader";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import Colors from "../constants/Colors";
import {useRef, useState} from "react";
import ForgetPasswordEmailOrNumber from "../components/forgetPasswordScreen/ForgetPasswordEmailOrNumber";
import ForgetPasswordOTP from "../components/forgetPasswordScreen/ForgetPasswordOTP";
import Toast from "../ui/Toast";

export default function ForgetPasswordScreen() {
    function sendOtpHandler(message) {
        setIsOtp(true);
        toastRef.current.show(message);
    }

    function backHandler() {
        setIsOtp(false);
    }

    function verifyOTPMessage(message) {
        toastRef.current.show(message === "something went wrong" ? "Entered OTP is wrong" : message);
    }

    /**
     * @constant {isOtp}  - send otp button is clicked or not in {ForgetPasswordEmailOrNumber} screen
     */

    const [isOtp, setIsOtp] = useState(false);

    const [mobileNumber, setMobileNumber] = useState("");
    const toastRef = useRef(null);


    return(
        <>
        <SafeAreaView style={styles.safeAreaView}>
            <StatusBar style="light" />
            <View style={styles.forgetPassword}>
                <SignInHeader />
                <Toast
                    ref={toastRef}
                />
                {
                    isOtp ?
                        <ForgetPasswordOTP backHandler={backHandler} mobileNumber={mobileNumber} verifyOTP={verifyOTPMessage}/> :
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