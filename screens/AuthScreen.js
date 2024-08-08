import {View, Text, StyleSheet, Pressable} from "react-native";
import Colors from "../constants/Colors";
import SignInHeader from "../components/authScreen/SignInHeader";
import PrimaryButton from "../ui/PrimaryButton";
import {Entypo} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import MobileOtp from "../components/authScreen/MobileOtp";
import EmailLogin from "../components/authScreen/EmailLogin";
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";

function AuthScreen() {
    const navigate = useNavigation();


    function signUpHandler() {
        console.log("signUpHandler");
    }

    const [isMobileOtp, setIsMobileOtp] = useState(true);

    function mobileOtpButtonPressHandler() {
        setIsMobileOtp(true);
    }

    function emailLoginHandler() {
        setIsMobileOtp(false);
    }

    const styles = StyleSheet.create({
        signIn: {
            flex: 1,
            // borderWidth: 7,
            // borderColor: 'pink',
        },
        body: {
            flex: 1,
            backgroundColor: "#ffffff",
            alignItems: "center",
            // borderWidth: 10,
            // borderColor: 'purple',
            // height: '100%'

        },
        signInText: {
            fontSize: 20,
            fontWeight: "600",
            marginTop: 30,
        },
        buttonContainer: {
            width: '100%',
            justifyContent: "space-evenly",
            flexDirection: "row",
            marginTop: 40,

        },
        mobileButtonTextStyle: {
            fontWeight: '700',
            color: isMobileOtp ? Colors.white : Colors.black,
            marginLeft: 12,
        },
        emailButtonTextStyle: {
            fontWeight: '700',
            color: !isMobileOtp ? Colors.white : Colors.black,
            marginLeft: 12,

        },
        orContainer: {
            flexDirection: "row",
            width: '80%',
            // borderWidth: 2,
            alignItems: "center",
            marginTop: 16
        },
        hr: {
            backgroundColor: 'black',
            height: 1,
            flex: 1,
        },
        signUpContainer: {
            flexDirection: 'row',
            marginTop: 16
        },
        mobileOtpButtonStyle: {
            backgroundColor: isMobileOtp ? Colors.darkBlue : Colors.grey200,
            width: '40%',
        },
        emailButtonStyle: {
            backgroundColor: !isMobileOtp ? Colors.darkBlue : Colors.grey200,
            width: '40%',
        }
    });


    return (
        <View style={styles.signIn}>
            <SignInHeader/>
            <View style={styles.body}>
                <Text style={styles.signInText}>Sign In</Text>
                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        buttonStyle={styles.mobileOtpButtonStyle}
                        textStyle={{color: Colors.highlight}}
                        onPress={mobileOtpButtonPressHandler}
                    >
                        <View style={{flexDirection: "row"}}>
                            <Entypo name="mobile" size={20} color={isMobileOtp ? Colors.white : "black"}/>
                            <Text style={styles.mobileButtonTextStyle}>Mobile otp</Text>
                        </View>

                    </PrimaryButton>
                    <PrimaryButton
                        buttonStyle={[styles.emailButtonStyle]}
                        textStyle={{color: Colors.darkBlue}}
                        onPress={emailLoginHandler}
                    >
                        <View style={{flexDirection: "row"}}>
                            <MaterialCommunityIcons name="email-outline" size={20}
                                                    color={!isMobileOtp ? Colors.white : "black"}/>
                            <Text style={styles.emailButtonTextStyle}>Email</Text>
                        </View>
                    </PrimaryButton>
                </View>
                {isMobileOtp ? <MobileOtp /> : <EmailLogin />}
                {/*<EmailLogin />*/}
                <View style={styles.orContainer}>

                    <View style={styles.hr}></View>
                    <Text style={{paddingHorizontal: 8}}>or</Text>
                    <View style={styles.hr}></View>

                </View>

                <View style={styles.signUpContainer}>
                    <Text style={{fontWeight: '600'}}>Don't have an account? </Text>
                    <Pressable onPress={signUpHandler}>
                        <Text style={{color: Colors.highlight, fontWeight: '600'}}>Sign Up Now</Text>
                    </Pressable>
                </View>
                {/*<PrimaryButton buttonStyle={{marginTop: 20}} onPress={() => navigate.navigate('Checkout')}*/}
                {/*               label="Dummy Navigate to Checkout Screen"/>*/}
            </View>
        </View>
    );
}

export default AuthScreen;


