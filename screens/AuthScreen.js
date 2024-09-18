import {View, Text, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView} from "react-native";
import Colors from "../constants/Colors";
import SignInHeader from "../components/authScreen/SignInHeader";
import {SafeAreaView} from "react-native-safe-area-context";
import PrimaryButton from "../ui/PrimaryButton";
import {Entypo} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import MobileOtp from "../components/authScreen/MobileOtp";
import EmailLogin from "../components/authScreen/EmailLogin";
import {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import textTheme from "../constants/TextTheme";
import { StatusBar } from 'expo-status-bar';
import {
    loadMembershipsDataFromDb,
    loadPackagesDataFromDb,
    loadProductsDataFromDb,
    loadServicesDataFromDb
} from "../store/catalogueSlice";
import {loadClientCountFromDb, loadClientsFromDb} from "../store/clientSlice";
import {loadClientFiltersFromDb} from "../store/clientFilterSlice";
import {loadBusinessesListFromDb} from "../store/listOfBusinessSlice";
import {loadLoginUserDetailsFromDb} from "../store/loginUserSlice";
import {useDispatch} from "react-redux";

function AuthScreen() {
    const navigate = useNavigation();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(loadServicesDataFromDb("women"));
    //     dispatch(loadServicesDataFromDb("men"));
    //     dispatch(loadServicesDataFromDb("kids"));
    //     dispatch(loadServicesDataFromDb("general"));
    //     dispatch(loadProductsDataFromDb());
    //     dispatch(loadPackagesDataFromDb());
    //     dispatch(loadMembershipsDataFromDb());
    //     dispatch(loadClientsFromDb());
    //     dispatch(loadClientCountFromDb());
    //     dispatch(loadClientFiltersFromDb(10, "All"));
    //     dispatch(loadBusinessesListFromDb());
    //     dispatch(loadLoginUserDetailsFromDb());
    // }, []);


    function signUpHandler() {
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
        },
        body: {
            flex: 1,
            backgroundColor: Colors.white,
            alignItems: "center",

        },
        signInText: {
            fontWeight: '600',
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
            letterSpacing: 0,
        },
        emailButtonTextStyle: {
            fontWeight: '700',
            color: !isMobileOtp ? Colors.white : Colors.black,
            marginLeft: 12,
            letterSpacing: 0,

        },
        orContainer: {
            flexDirection: "row",
            width: '80%',
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
            marginTop: 16,
            marginBottom: 32
        },
        signUpText: {
            fontWeight: '600',
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
        <>


        <SafeAreaView style={styles.signIn}>
            <StatusBar
                backgroundColor={Colors.darkBlue}
                style="light"
                barStyle={"dark-content"}


            />
            <ScrollView style={{flex: 1, backgroundColor: Colors.white}}>
            <SignInHeader/>
            <View style={styles.body}>
                <Text style={[textTheme.headlineMedium, styles.signInText]}>Sign in</Text>
                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        buttonStyle={styles.mobileOtpButtonStyle}
                        textStyle={{color: Colors.highlight}}
                        onPress={mobileOtpButtonPressHandler}
                    >
                        <View style={{flexDirection: "row"}}>
                            <Entypo name="mobile" size={20} color={isMobileOtp ? Colors.white : "black"}/>
                            <Text style={[textTheme.labelLarge, styles.mobileButtonTextStyle]}>Mobile otp</Text>
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
                            <Text style={[textTheme.labelLarge, styles.emailButtonTextStyle]}>Email</Text>
                        </View>
                    </PrimaryButton>
                </View>
                {isMobileOtp ? <MobileOtp /> : <EmailLogin />}
                <View style={styles.orContainer}>

                    <View style={styles.hr}></View>
                    <Text style={[textTheme.bodyMedium, {paddingHorizontal: 8}]}>or</Text>
                    <View style={styles.hr}></View>

                </View>

                <View style={styles.signUpContainer}>
                    <Text style={[textTheme.bodyMedium, {fontWeight: '600'}]}>Don't have an account? </Text>
                    <Pressable onPress={signUpHandler}>
                        <Text style={[textTheme.bodyMedium, styles.signUpText]}>Sign Up Now</Text>
                    </Pressable>
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
        </>
    );
}

export default AuthScreen;


