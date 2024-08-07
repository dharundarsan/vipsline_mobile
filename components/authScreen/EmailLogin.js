import {View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, KeyboardAvoidingView} from "react-native";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import CheckBox from 'react-native-check-box'
import findUser from "../../util/findUserApi";

export default function EmailLogin() {
    const navigation = useNavigation();
    const platform = "BUSINESS";

    /**
     * use States ------------------------------------------------------------------------
     */

    const [isChecked, setIsChecked] = useState(false);

    const [isEmailFocussed, setIsEmailFocussed] = useState(false);
    const [isPasswordFocussed, setIsPasswordFocussed] = useState(false);

    const [password, setPassword] = useState("");

    const [email, setEmail] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [isUserFound, setIsIsUserFound] = useState(true);

    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const BaseURL = process.env.EXPO_PUBLIC_API_URI

    /**
     * UI logics ---------------------------------------------------------------------------
     */

    function forgetPasswordOnPressHandler() {
        navigation.navigate('ForgetPassword');
    }

    /** Authentication Logic
     *
     * @returns {Promise<string>}
     */

    async function signInHandler() {
        setIsLoading(true);
        setIsIsUserFound(await findUser(email, platform));
        let response = '';
        let isAuthenticationSuccessful = false;
        if (isUserFound) {
            try {
                response = await axios.post(BaseURL + '/authenticateWithPassword', {
                    platform: platform,
                    userName: email,
                    password: password
                });
            }
            catch (error) {
                console.log("could not authenticate with email: " + error);
                setIsLoading(false);
                setIsPasswordValid(false);
            }
            isAuthenticationSuccessful = response.data.message === undefined ?
                                            "" :
                                            response.data.message === "User authenticated";
        }


        if (isAuthenticationSuccessful) {
            setIsPasswordValid(true);
            console.log("Signed In Successfully!!!");
        }
        else {
            setIsPasswordValid(false);
        }
        setIsLoading(false);

        // console.log(email + " " + password + " " + isPasswordFocussed + " " + isPasswordValid);

    }

    /**
     * styles -------------------------------------------------------------------------------------
     */

    const styles = StyleSheet.create({
        emailInput: {
            borderWidth: 2,
            paddingVertical: 8,
            borderRadius: 8,
            borderColor:
                isEmailFocussed ?
                    isUserFound ?
                        Colors.highlight :
                        Colors.error :
                    !isUserFound ?
                        Colors.error :
                        Colors.grey400,
            paddingHorizontal: 12,
        },
        passwordInput: {
            borderWidth: 2,
            paddingVertical: 8,
            borderRadius: 8,
            borderColor:
                isPasswordFocussed ?
                    isPasswordValid ?
                        Colors.highlight:
                        Colors.error :
                    !isPasswordValid ?
                        Colors.error :
                        Colors.grey400,
            paddingHorizontal: 12,
        },
        emailContainer: {
            width: "85%",
            marginTop: 30,
        },
        inputLabel: {
            marginBottom: 8,
            fontWeight: '500'
        },
        signInButton: {
            width: '100%',
            backgroundColor: Colors.highlight,
            height: 45,
            marginTop: 16
        },
        activityIndicator: {

        }
    })

    /** UI part--------------------------------------------------------------------------------
     *
     */

    return (
        <View style={styles.emailContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                placeholder="Enter email Address"
                style={[styles.emailInput]}
                onChangeText={setEmail}
                value={email}
                onFocus={() => {
                    setIsEmailFocussed(true)
                    setIsPasswordFocussed(false);
                }}

                />
            {
                !isUserFound ?
                    <Text style={{color: Colors.error}}>Incorrect email</Text> :
                    <Text></Text>

            }
                <Text style={[styles.inputLabel, {marginTop: 6}]}>Password</Text>
                <TextInput
                placeholder="Enter password"
                value={password}
                style={styles.passwordInput}
                onChangeText={setPassword}
                secureTextEntry={!isChecked}
                onFocus={() => {
                    setIsPasswordFocussed(true)
                    setIsEmailFocussed(false);
                }}
                />
            {
                !isPasswordValid ?
                    <Text style={{color: Colors.error}}>Incorrect password</Text> :
                    <Text></Text>
            }
            <View style={{marginTop: 6, width: '100%',flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <CheckBox
                    onClick={() => {
                        setIsChecked(!isChecked);
                    }}
                    isChecked={isChecked}
                    checkBoxColor={Colors.highlight}
                    uncheckedCheckBoxColor={Colors.grey400}


                />
                    <Text style={{marginLeft: 6}}>Show Password</Text>
                </View>
                <Pressable
                    onPress={forgetPasswordOnPressHandler}
                >
                    <Text style={{color: Colors.highlight, fontWeight: "600"}}>Forgot Password?</Text>
                </Pressable>
            </View>
                <PrimaryButton
                    buttonStyle={styles.signInButton}
                    onPress={isLoading ? null : signInHandler}
                >
                    {
                        !isLoading ?
                            <Text style={{color: Colors.onHighlight, fontWeight: '600'}}>Sign in</Text> :
                            <ActivityIndicator color={Colors.onHighlight} style={styles.activityIndicator}/>
                    }

                </PrimaryButton>
        </View>
    );
}