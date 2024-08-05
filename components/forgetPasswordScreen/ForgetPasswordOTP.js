import PrimaryButton from "../../ui/PrimaryButton";
import {Text, TextInput, View, StyleSheet, Image} from "react-native";
import Colors from "../../constants/Colors";
import {OtpInput} from "react-native-otp-entry";
import OtpInputBox from "../verificationCodeScreen/otpInputBox";
import { Ionicons } from '@expo/vector-icons';

export default function ForgetPasswordOTP({backHandler}) {
    return (
        <View style={styles.forgetPasswordBody}>
            <PrimaryButton
                buttonStyle={styles.buttonStyle}
                onPress={backHandler}
            >
                <Ionicons name="arrow-back-sharp" size={24} color="white" />
                </PrimaryButton>
            <Text style={styles.forgetPasswordText}>Forget Password</Text>
            <View style={{width: "75%", marginTop: 32}}>
                <Text
                    style={{textAlign: 'center'}}>
                    Enter one-time password sent to your registered email and mobile number
                </Text>
            </View>
            <OtpInputBox style={styles.otpBox}/>

            <View style={styles.resendOtpContainer}>
                <Text
                    style={styles.didntGetCodeText}
                >
                    Didn't get a code?
                </Text>
                <Text style={styles.resendOtp}>Resend OTP in <Text style={styles.timer}>60 sec</Text></Text>
            </View>

            <PrimaryButton label="VERIFY" buttonStyle={styles.submitButton}/>


        </View>
    );

}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: Colors.grey550,
        width: '20%',
        marginTop: 32,
    },
    forgetPasswordBody: {
        alignItems: "center",
    },
    forgetPasswordText: {
        color: Colors.black,
        fontSize: 20,
        fontWeight: '600',
        marginTop: 32,
    },
    mobileNumberInput: {
        width: '100%',
        borderWidth: 2,
        borderColor: Colors.highlight,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    inputContainer: {
        marginTop: 32,
        width: '85%',
    },
    inputLabel: {
        marginBottom: 8,
    },
    otpBox: {
        marginTop: 32,
    },
    resendOtpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%',
        marginTop: 32,
    },
    didntGetCodeText: {
        fontWeight: '700',
        fontSize: 14
    },
    timer: {
        fontWeight: '600',
        color: Colors.highlight,
        fontSize: 14
    },
    resendOtp: {
        color: Colors.grey600,
        fontSize: 14
    },
    submitButton: {
        width: '85%',
        alignSelf: 'auto',
        marginTop: 32,
        backgroundColor: Colors.highlight,
    }
})