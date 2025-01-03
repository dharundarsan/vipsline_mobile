import {View, Text, StyleSheet, Pressable} from 'react-native';
import Colors from "../../constants/Colors";
import {useEffect, useRef, useState} from "react";
import OtpInputBox from "./otpInputBox";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import {useDispatch, useSelector} from "react-redux";
import {updateAuthStatus} from "../../store/authSlice";
import {useNavigation} from "@react-navigation/native";
import authenticateWithOTPApi from "../../apis/authApis/authenticateWithOTPApi";
import sendOTPApi from '../../apis/authApis/sendOTPApi';
import Toast from "../../ui/Toast";

export default function VerificationCodeBody(props) {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [changing, setChanging] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [otp, setOtp] = useState("");

    const [emptyChecker, setEmptyChecker] = useState(false);
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [timer, setTimer] = useState(60);

    const toastRef = useRef(null);

    useEffect(() => {
        if (timer <= 0) {
            return
        }
        const s = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000)
        return () => {
            clearInterval(s);
        }
    }, [timer])

    function resendOTPHandler() {
        setTimer(60);
    }

    function handleOTP(otp) {
        setOtp(otp);
    }

    // async function verifyWithOTP() {
    //
    //
    //     // setIsAuthenticated(true);
    //
    //     const isAuthenticated = await authenticateWithOTPApi(props.mobileNumber, otp, "BUSINESS");
    //
    //     if(isAuthenticated) {
    //
    //         navigation.navigate(
    //             'ListOfBusinessesScreen',
    //         );
    //     }
    // }

    return (
        <View style={styles.verificationCodeBody}>
            <Toast ref={toastRef}/>
            <Text style={styles.verificationText}>Verification Code</Text>
            <View style={styles.verificationMessage}>
                <Text>Enter the 4-digit number we sent to</Text>
                <View style={styles.editNumberContainer}>
                    <Text
                        style={[textTheme.titleSmall, styles.mobileNumber]}>
                        +91 {props.mobileNumber.slice(0, 5)} {props.mobileNumber.slice(5, 10)} - <Text></Text>

                    </Text>
                    <Pressable onPress={() => props.navigation.goBack()}>
                        <Text style={[textTheme.titleSmall, styles.editNumberText]}>
                            Edit Number
                        </Text>
                    </Pressable>
                </View>
            </View>

            <OtpInputBox
                style={styles.otpContainer}
                otp={handleOTP}
                verify={isAuthenticated}
                changing={changing}
                setChanging={setChanging}
            />
            {
                emptyChecker ?
                    <View style={{marginTop: 14, width: '70%', alignItems: 'center'}}>
                        <Text style={[textTheme.titleSmall, {textAlign: "left", color: Colors.error}]}>Enter OTP</Text>
                    </View> :
                    <></>

            }

            <View style={styles.resendOtpContainer}>
                <Text style={[textTheme.titleMedium, styles.didntGetCodeText]}>Didn't get a code?</Text>
                <Pressable onPress={() => {
                        if(timer === 0) {
                            resendOTPHandler();
                            sendOTPApi(props.mobileNumber, "BUSINESS")
                        }
                    
                    }}
                    style={{justifyContent:"center"}}>
                    <Text style={[textTheme.titleSmall, styles.resendOtp]}>
                        Resend OTP {
                        timer > 0 ?
                            <Text style={[textTheme.titleSmall, styles.timer]}>
                                <Text style={[textTheme.titleSmall, styles.resendOtp]}>
                                    in
                                </Text> {timer} sec</Text> : <Text></Text>
                    }
                    </Text>
                </Pressable>
            </View>

            <PrimaryButton
                label="SUBMIT"
                buttonStyle={styles.submitButton}
                textStyle={[textTheme.titleSmall]}
                onPress={async () => {
                    if(otp.trim().length === 0) {
                        setEmptyChecker(true);
                        return;
                    }
                    else {
                        setEmptyChecker(false);
                    }

                    const authStatus = await authenticateWithOTPApi(props.mobileNumber, otp, "BUSINESS");
                    setIsAuthenticated(authStatus);
                    setChanging(true);
                    if(authStatus === true) {
                        dispatch(updateAuthStatus(true));
                    }
                    else {
                        toastRef.current.show("Entered OTP is wrong");
                    }
                }}
            />



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
    },
    editNumberContainer: {
        flexDirection: 'row',
    }
})