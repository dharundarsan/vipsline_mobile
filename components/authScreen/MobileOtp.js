import {Text, TextInput, View, StyleSheet, ActivityIndicator, KeyboardAvoidingView} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import axios from "axios";


export default function MobileOtp() {
    const navigation = useNavigation();
    const [mobileNUmber, setMobileNUmber] = useState("");

    const [isFocussed, setIsFocussed] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [isUserTyping, setIsUserTyping] = useState(false);
    const [isUserFound, setIsUserFound] = useState(true);

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
                userName: mobileNUmber
            })
            responseUserMessage = response.data.message;

        }
        catch (error) {
            console.log("user not found: " + error);
        }

        // console.log(response);
        return responseUserMessage;
    }

    async function sendOtp() {
        setIsLoading(true);
        if(await findUser() === "user found") {
            try {
                const response = await axios.post(
                    BaseURL + "/user/sendOtp",
                    {
                        userName:mobileNUmber,
                        platform:platform,
                    })
                navigation.navigate('VerifyOTP',
                    {
                        mobileNumber: mobileNUmber
                    });
                setIsUserFound(true);
            }
            catch (error) {
                console.log("sendOtp error: " + error);
            }

        }
        else {
            setIsUserFound(false);
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
            borderColor: isFocussed ? isUserFound ? Colors.highlight : Colors.error : !isUserFound ? Colors.error :Colors.grey400,
            borderRadius: 6,
            paddingHorizontal: 12,
        },
        mobileNumberContainer: {
            alignItems: "flex-start",
            // borderWidth: 2,
            width:'100%',
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
            <View style={{marginTop: 30, marginBottom: 8, width: '82%', }}>
                <Text style={{fontWeight: '500'}}>Mobile number</Text>
            </View>
            <View style={styles.mobileNumberContainer}>


                <TextInput
                    style={styles.mobileNumberInput}
                    placeholder='Enter mobile number'
                    keyboardType= "number-pad"
                    onFocus={onFocusHandler}
                    onBlur={onFocusOutHandler}
                    value={mobileNUmber}
                    onChangeText={(text) => {
                        setMobileNUmber(text);
                        setIsUserTyping(true);
                        // if(text.length === 10) {
                        //     await findUser() === "user found" ? setIsUserFound(true) : setIsUserFound(false);
                        // }
                    }}
                    maxLength={10}
                />
                {
                    !isUserFound ?
                        <Text style={{color: Colors.error}}>Incorrect Mobile number</Text> :
                        <Text > </Text>
                }
                <PrimaryButton
                    buttonStyle={styles.sendOtpButton}
                    onPress={sendOtp}
                    >
                    {
                        !isLoading ?
                            <Text style={{color: Colors.onHighlight}}>Send OTP</Text> :
                            <ActivityIndicator color={Colors.onHighlight}/>
                    }

                </PrimaryButton>
            </View>
        </View>
    );
}

