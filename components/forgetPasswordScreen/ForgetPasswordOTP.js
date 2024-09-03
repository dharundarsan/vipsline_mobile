import PrimaryButton from "../../ui/PrimaryButton";
import {Text, View, StyleSheet, Pressable} from "react-native";
import Colors from "../../constants/Colors";
import OtpInputBox from "../verificationCodeScreen/otpInputBox";
import {Ionicons} from '@expo/vector-icons';
import textTheme from "../../constants/TextTheme";
import {useEffect, useState} from "react";
import sendOTPApi from "../../util/apis/sendOTPApi";
import {useDispatch} from "react-redux";
import authenticateWithOTPApi from "../../util/apis/authenticateWithOTPApi";
import {useNavigation} from "@react-navigation/native";

export default function ForgetPasswordOTP(props) {
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigation = useNavigation();
    const [changing, setChanging] = useState(false);

    const [timer, setTimer] = useState(60)
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

    async function resendOTPHandler() {
        await sendOTPApi(props.mobileNumber, "BUSINESS");
        setTimer(60);
    }

    return (
        <View style={styles.forgetPasswordBody}>
            <PrimaryButton
                buttonStyle={styles.buttonStyle}
                onPress={props.backHandler}
            >
                <Ionicons name="arrow-back-sharp" size={24} color="white"/>
            </PrimaryButton>
            <Text style={[textTheme.titleMedium, styles.forgetPasswordText]}>Forget Password</Text>
            <View style={{width: "75%", marginTop: 32}}>
                <Text
                    style={[textTheme.titleSmall, {textAlign: 'center'}]}>
                    Enter one-time password sent to your registered email and mobile number
                </Text>
            </View>
            <OtpInputBox
                style={styles.otpBox}
                otp={(otp) => setOtp(otp)}
                verify={isAuthenticated}
                changing={changing}
                setChanging={setChanging}
            />

            <View style={styles.resendOtpContainer}>
                <Text
                    style={[textTheme.titleSmall, styles.didntGetCodeText]}
                >
                    Didn't get a code?
                </Text>
                <Pressable onPress={timer === 0 ? resendOTPHandler : null}>
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
                label="VERIFY"
                buttonStyle={styles.submitButton}
                textStyle={[textTheme.titleMedium]}
                onPress={async () => {
                    const authStatus = await authenticateWithOTPApi(props.mobileNumber, otp, "BUSINESS")
                    setIsAuthenticated(authStatus);
                    setChanging(true);
                    if(authStatus === true) {
                        navigation.navigate("ListOfBusinessesScreen");
                    }
                }}
            />


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