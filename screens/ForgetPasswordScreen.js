import {View, StyleSheet} from "react-native";
import SignInHeader from "../components/authScreen/SignInHeader";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";
import Colors from "../constants/Colors";
import {useState} from "react";
import ForgetPasswordEmailOrNumber from "../components/forgetPasswordScreen/ForgetPasswordEmailOrNumber";
import ForgetPasswordOTP from "../components/forgetPasswordScreen/ForgetPasswordOTP";

export default function ForgetPasswordScreen({navigation}) {
    function sendOtpHandler() {
        setIsOtp(true);
    }

    function backHandler() {
        setIsOtp(false);
    }

    const [isOtp, setIsOtp] = useState(false);

    return(
        <>
        <SafeAreaView style={styles.safeAreaView}>
            <StatusBar style="light" />
            <View style={styles.forgetPassword}>
                <SignInHeader />
                {isOtp ? <ForgetPasswordOTP backHandler={backHandler}/> : <ForgetPasswordEmailOrNumber otpHandler={sendOtpHandler} />}

            </View>

        </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: Colors.onBackground,
        // borderWidth: 3,
        // borderColor: 'blue'
    },
    forgetPassword: {
        flex: 1,
        backgroundColor: Colors.white,

        // borderWidth: 3,
        // borderColor: 'green'
    },

})