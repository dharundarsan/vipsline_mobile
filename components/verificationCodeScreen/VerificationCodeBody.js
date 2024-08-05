import { View, Text, StyleSheet } from 'react-native';
import Colors from "../../constants/Colors";
import { OtpInput } from "react-native-otp-entry";
import {useRef, useEffect} from "react";
import OTPTextInput from "react-native-otp-textinput"
import OTPInput from "./otpInputBox";
import OtpInputBox from "./otpInputBox";
import PrimaryButton from "../../ui/PrimaryButton";

export default function VerificationCodeBody() {

    const otpInputRef = useRef(null);
    function func() {
        console.log("hello");
    }


    return (
        <View style={styles.verificationCodeBody}>
            <Text style={styles.verificationText}>Verification Code</Text>
            <View style={styles.verificationMessage}>
                <Text>Enter the 4-digit number we sent to</Text>
                <Text style={styles.mobileNumber}>+91 902552 2263 - <Text style={styles.editNumberText}>Edit Number</Text></Text>

            </View>

            <OtpInputBox style={styles.otpContainer}/>

            <View style={styles.resendOtpContainer}>
                <Text style={styles.didntGetCodeText}>Didn't get a code?</Text>
                <Text style={styles.resendOtp}>Resend OTP in <Text style={styles.timer}>60 sec</Text></Text>
            </View>

            <PrimaryButton label="SUBMIT" buttonStyle={styles.submitButton}/>



        </View>
    );
}

const styles = StyleSheet.create({
    verificationCodeBody: {
        flex: 1,
        alignItems: 'center',
    },
    verificationText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.regularFont,
        marginTop: 30,
    },
    editNumberText: {
        textDecorationLine: 'underline',
        fontWeight: '600',

    },
    verificationMessage: {
        marginTop: 16,
    },
    mobileNumber: {
        fontWeight: '600',
    },
    otpContainer: {
        marginTop: 30,
        width: '75%'
    },
    resendOtpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '75%',
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