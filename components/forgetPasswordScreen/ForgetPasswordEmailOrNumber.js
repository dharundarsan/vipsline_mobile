import PrimaryButton from "../../ui/PrimaryButton";
import {Text, TextInput, View, StyleSheet, ActivityIndicator} from "react-native";
import Colors from "../../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import textTheme from "../../constants/TextTheme";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import forgetPasswordAPI from "../../apis/authApis/forgetPasswordAPI";
import Toast from "../../ui/Toast";

export default function ForgetPasswordEmailOrNumber(props) {
    const navigation = useNavigation();
    const [mobileNumber, setMobileNumber] = useState("");

    const [isFocussed, setIsFocussed] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [isUserTyping, setIsUserTyping] = useState(false);
    const [isUserFound, setIsUserFound] = useState(true);

    const [emailPrompt, setEmailPrompt] = useState("");

    const textRef = useRef(null);

    const [isTyping, setIsTyping] = useState(false);
    const [isSendOtpPressed, setIsSendOtpPressed] = useState(false);

    const BaseURL = process.env.EXPO_PUBLIC_API_URI
    const platform = "BUSINESS";



    let responseUserMessage = "";


    function onFocusHandler() {
        setIsFocussed(true);
    }

    function onFocusOutHandler() {
        setIsFocussed(false);
    }

    function isAlphaNumeric(str) {
        return /^[A-Za-z0-9]+$/.test(str);
    }


    async function findUser() {
        let response = "something went wrong"
        try {
            response = await axios.post(BaseURL + '/user/findUser', {
                platform: platform,
                userName: mobileNumber
            })
            responseUserMessage = response.data.message;

        } catch (error) {
        }

        return responseUserMessage;
    }

    async function sendOtp() {
        setIsLoading(true);
        if (await findUser() === "user found") {
            try {
                const response = await axios.post(
                    BaseURL + "/user/sendOtp",
                    {
                        userName: mobileNumber,
                        platform: platform,
                    })

                setIsUserFound(true);
                props.otpHandler();
                props.setMobileNumber(mobileNumber);
            } catch (error) {
            }

        } else {
            setIsUserFound(false);
        }

        setIsLoading(false);

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
            paddingVertical: 8,
            borderColor:
                isUserTyping ?
                    Colors.highlight:
                    isUserFound ?
                        Colors.highlight :
                        Colors.error,
            borderRadius: 6,
            paddingHorizontal: 12,
        },
        mobileNumberContainer: {
            alignItems: "flex-start",
            width: '100%',
        },
        sendOtpButton: {
            width: '85%',
            backgroundColor: Colors.highlight,
            height: 45,
            marginTop: 16
        },
        inputContainer: {
            marginTop: 32,
            width: '85%',
        },
        inputLabel: {
            marginBottom: 8,
        }
    })

    return (
        <View style={styles.forgetPasswordBody}>

            <PrimaryButton
                buttonStyle={styles.buttonStyle}
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <Ionicons name="arrow-back-sharp" size={24} color="white"/>
            </PrimaryButton>
            <Text style={[textTheme.titleMedium, styles.forgetPasswordText]}>Forget Password</Text>

            <View style={styles.inputContainer}>
                <Text style={[textTheme.titleMedium, styles.inputLabel]}>Mobile number / Email</Text>
                <TextInput
                    ref={textRef}
                    style={[textTheme.bodyMedium, styles.mobileNumberInput]}
                    placeholder='Mobile number / Email'
                    onFocus={onFocusHandler}
                    onBlur={onFocusOutHandler}
                    value={mobileNumber}
                    onChangeText={(text) => {
                        setMobileNumber(text);
                        setIsUserTyping(true);
                        setIsSendOtpPressed(false)

                    }}
                />
                {
                    isUserTyping ?
                        <Text></Text> :
                        isSendOtpPressed && mobileNumber.trim().length === 0 ?
                                <Text style={[textTheme.titleSmall, {color: Colors.error}]}>Mobile number / Email is required </Text> :
                        !isUserFound ?
                            <Text style={[textTheme.titleSmall, {color: Colors.error}]}>
                                Incorrect Mobile number / email
                            </Text> :
                            <Text></Text>


                }
            </View>
            <PrimaryButton
                buttonStyle={styles.sendOtpButton}
                onPress={async () => {
                    if (isLoading) {
                        return null;
                    }
                    else {
                        setIsLoading(true);
                        const message = await forgetPasswordAPI(mobileNumber, "BUSINESS");
                        setIsLoading(false);

                        if(message === "OTP has been sent") {
                            setIsUserFound(true)
                            setEmailPrompt("");
                            setIsUserTyping(false);
                            props.setMobileNumber(mobileNumber);
                            props.otpHandler(message);
                        }
                        else {
                            setIsUserFound(false)
                        }
                    }

                    setIsSendOtpPressed(true);
                    setIsUserTyping(false)


                }}
            >
                {
                    !isLoading ?
                        <Text style={[textTheme.titleSmall, {color: Colors.onHighlight}]}>Send OTP</Text> :
                        <ActivityIndicator color={Colors.onHighlight}/>
                }

            </PrimaryButton>
        </View>
    );

}

