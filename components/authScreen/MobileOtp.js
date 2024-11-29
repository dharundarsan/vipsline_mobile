import { Text, TextInput, View, StyleSheet, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";
import textTheme from "../../constants/TextTheme";


export default function MobileOtp() {
    const navigation = useNavigation();
    const [mobileNumber, setMobileNumber] = useState("");

    const [isFocussed, setIsFocussed] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [isUserTyping, setIsUserTyping] = useState(false);
    const [isUserFound, setIsUserFound] = useState(true);

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

    async function findUser() {
        let response = "something went wrong"
        try {
            response = await axios.post(BaseURL + '/user/findUser', {
                platform: platform,
                userName: mobileNumber
            })
            if (response.data.message === "user found") {
                responseUserMessage = response.data.message;
            }
            else {
                responseUserMessage = "error"
            }

        } catch (error) {
        }

        return responseUserMessage;
    }

    async function sendOtp() {
        setIsLoading(true);
        if (mobileNumber.trim().length !== 0) {
            if (await findUser() === "user found") {
                try {
                    const response = await axios.post(
                        BaseURL + "/user/sendOtp",
                        {
                            userName: mobileNumber,
                            platform: platform,
                        })
                    // console.log(response.data);

                    navigation.navigate('VerificationCodeScreen',
                        {
                            mobileNumber: mobileNumber
                        });
                    setIsUserFound(true);
                    setIsUserTyping(true);
                } catch (error) {
                }

            } else {
                setIsUserFound(false);
                setIsUserTyping(false);
            }
        }
        else {
            setIsUserFound(false);
            setIsUserTyping(false);
        }
        setIsLoading(false);

    }

    const styles = StyleSheet.create({
        mobileOtpContainer: {
            width: '85%',
        },
        mobileNumberInput: {
            width: '100%',
            borderWidth: 2,
            paddingVertical: 8,
            borderColor:
                isUserTyping ?
                    Colors.highlight :
                    isFocussed ?
                        isUserFound ?
                            Colors.highlight :
                            Colors.error :
                        !isUserFound ?
                            Colors.error :
                            Colors.grey400,
            borderRadius: 6,
            paddingHorizontal: 12,
        },
        mobileNumberContainer: {
            alignItems: "flex-start",
            // borderWidth: 2,
            width: '100%',
        },
        sendOtpButton: {
            width: '100%',
            backgroundColor: Colors.highlight,
            height: 45,
            marginTop: 16
        }
    });

    return (
        <View style={styles.mobileOtpContainer}>
            <View style={{ marginTop: 30, marginBottom: 8, width: '82%', }}>
                <Text style={[textTheme.titleSmall]}>Mobile number</Text>
            </View>
            <View style={styles.mobileNumberContainer}>


                <TextInput
                    style={[textTheme.titleSmall, styles.mobileNumberInput]}
                    placeholder='Enter mobile number'
                    keyboardType="number-pad"
                    onFocus={onFocusHandler}
                    onBlur={onFocusOutHandler}
                    value={mobileNumber}
                    onChangeText={(text) => {
                        setMobileNumber(text);
                        setIsUserTyping(true);
                        setIsSendOtpPressed(false)
                    }}
                    maxLength={10}
                />
                {
                    isUserTyping ?
                        <Text></Text> :
                        mobileNumber.trim().length === 0 && isSendOtpPressed ?
                            <Text style={[textTheme.titleSmall, { color: Colors.error }]}>Mobile number is required</Text> :
                            !isUserFound ?
                                <Text style={[textTheme.titleSmall, { color: Colors.error }]}>Incorrect Mobile number</Text> :
                                // isSendOtpPressed ?
                                //     <Text style={[textTheme.titleSmall, {color: Colors.error}]}>Mobile number is required</Text> :
                                <Text> </Text>
                }
                <PrimaryButton
                    buttonStyle={styles.sendOtpButton}
                    onPress={async () => {
                        await sendOtp();
                        setIsSendOtpPressed(true)
                    }}
                >
                    {
                        !isLoading ?
                            <Text style={[textTheme.titleSmall, { color: Colors.onHighlight }]}>Send OTP</Text> :
                            <ActivityIndicator color={Colors.onHighlight} />
                    }

                </PrimaryButton>
            </View>
        </View>
    );
}

