import {View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, KeyboardAvoidingView} from "react-native";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import {useState} from "react";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import CheckBox from 'react-native-check-box'
import findUser from "../../util/apis/findUserApi";
import textTheme from "../../constants/TextTheme";
import {useDispatch} from "react-redux";
import {updateAuthStatus, updateAuthToken} from "../../store/authSlice";
import * as SecureStore from 'expo-secure-store';

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

    const [isEmailTyping, setIsEmailTyping] = useState(false);
    const [isPasswordTyping, setIsPasswordTyping] = useState(false);

    const [emailPrompt, setEmailPrompt] = useState("");
    const [passwordPrompt, setPasswordPrompt] = useState("");

    const BaseURL = process.env.EXPO_PUBLIC_API_URI

    const dispatch = useDispatch();

    /**
     * UI logics ---------------------------------------------------------------------------
     */

    function forgetPasswordOnPressHandler() {
        navigation.navigate('ForgetPasswordScreen');
    }

    const storeData = async (value) => {
        try {
            // await AsyncStorage.setItem('my-key', value);
            await SecureStore.setItemAsync('my-key',value);
        } catch (e) {
            // saving error
        }
    };

    /** Authentication Logic
     *
     * @returns {Promise<string>}
     */

    async function signInHandler() {
        setIsLoading(true);
        setIsIsUserFound(await findUser(email, platform));
        let response = '';
        let isAuthenticationSuccessful = false;
        if (await findUser(email, platform)) {
            setIsIsUserFound(true);
            setEmailPrompt("");
            try {
                response = await axios.post(BaseURL + '/authenticateWithPassword', {
                    platform: platform,
                    userName: email,
                    password: password
                });
                dispatch(updateAuthToken(response.data.other_message));
                try {
                    // await AsyncStorage.setItem('authKey', response.data.other_message);
                    await SecureStore.setItemAsync('authKey', response.data.other_message)
                } catch (e) {
                }
            } catch (error) {
                setIsLoading(false);
                setIsPasswordValid(false);
            }
            isAuthenticationSuccessful = response.data.message === undefined ?
                "" :
                response.data.message === "User authenticated";
        }
        else {
            setIsIsUserFound(false);
            setEmailPrompt("Incorrect email");
        }



        if (isAuthenticationSuccessful) {
            setPasswordPrompt("");
            setIsPasswordValid(true);
            dispatch(updateAuthStatus(true));
        } else {
            setPasswordPrompt("Incorrect password")
            setIsPasswordValid(false);
            dispatch(updateAuthStatus(false));
        }
        setIsLoading(false);


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
            isEmailTyping ?
                Colors.highlight :
                passwordPrompt.trim().length > 0 ?
                    Colors.error :
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
            isPasswordTyping ?
                Colors.highlight :
                passwordPrompt.trim().length > 0 ?
                    Colors.error :
            isPasswordFocussed ?
                    isPasswordValid ?
                        Colors.highlight :
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
            fontWeight: '500',
            marginTop: 6,
        },
        signInButton: {
            width: '100%',
            backgroundColor: Colors.highlight,
            height: 45,
            marginTop: 16
        },
        activityIndicator: {},
        showPasswordText: {
            marginLeft: 6
        }
    })

    /** UI part--------------------------------------------------------------------------------
     *
     */

    return (
        <View style={styles.emailContainer}>
            <Text style={[textTheme.titleSmall, styles.inputLabel]}>Email Address</Text>
            <TextInput
                autoCapitalize={"none"}
                placeholder="Enter email Address"
                style={[textTheme.titleSmall, styles.emailInput]}
                onChangeText={(text) => {
                    setEmail(text);
                    setIsEmailTyping(true);
                }}
                value={email}
                onFocus={() => {
                    setIsEmailFocussed(true)
                    setIsPasswordFocussed(false);
                }}

            />
            {
                isEmailTyping ?
                    <Text></Text> :
                emailPrompt.trim().length > 0 ?
                    <Text style={[textTheme.titleSmall, {color: Colors.error}]}>{emailPrompt}</Text> :
                    // !isUserFound ?
                    //     <Text style={[textTheme.titleSmall, {color: Colors.error}]}>Incorrect email</Text> :
                        <Text></Text>
            }
            <Text style={[textTheme.titleSmall, styles.inputLabel]}>Password</Text>
            <TextInput
                placeholder="Enter password"
                value={password}
                style={[textTheme.titleSmall, styles.passwordInput]}
                onChangeText={(text) => {
                    setPassword(text)
                    setIsPasswordTyping(true)
                }}
                secureTextEntry={!isChecked}
                onFocus={() => {
                    setIsPasswordFocussed(true)
                    setIsEmailFocussed(false);
                }}
            />
            {
                isPasswordTyping ?
                    <Text></Text> :
                passwordPrompt.trim().length > 0 ?
                    <Text style={[textTheme.titleSmall, {color: Colors.error}]}>{passwordPrompt}</Text> :
                    // !isPasswordValid ?
                    //     <Text style={[textTheme.titleSmall, {color: Colors.error}]}>Incorrect password</Text> :
                        <Text></Text>
            }
            <View style={{
                marginTop: 6,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <CheckBox
                        onClick={() => {
                            setIsChecked(!isChecked);
                        }}
                        isChecked={isChecked}
                        checkBoxColor={Colors.highlight}
                        uncheckedCheckBoxColor={Colors.grey400}


                    />
                    <Text style={[textTheme.titleSmall, styles.showPasswordText]}>Show Password</Text>
                </View>
                <Pressable
                    onPress={forgetPasswordOnPressHandler}
                >
                    <Text style={[textTheme.titleSmall, {color: Colors.highlight, fontWeight: "600"}]}>Forgot
                        Password?</Text>
                </Pressable>
            </View>
            <PrimaryButton
                buttonStyle={styles.signInButton}
                onPress={async () => {
                    if(isLoading) {
                        // console.log("1")
                        return null;
                    }
                    if(email.trim().length === 0 && password.trim().length > 0) {
                        setEmailPrompt("Email is required");
                        setPasswordPrompt("");
                        // console.log("2")

                    }
                    else if(email.trim().length > 0 && password.trim().length === 0){
                        setPasswordPrompt("Password is required")
                        setEmailPrompt("");
                        // console.log("3")

                    }

                    else if(email.trim().length === 0 && password.trim().length === 0) {
                        setEmailPrompt("Email is required")
                        setPasswordPrompt("Password is required")
                        // console.log("4")
                    }
                    else {
                        await signInHandler();
                        setIsEmailTyping(false);
                        setIsPasswordTyping(false)
                        // console.log(isUserFound);
                        // console.log(isPasswordValid);
                        // if(isUserFound) {
                        //     setEmailPrompt("");
                        // }
                        // else {
                        //     setEmailPrompt("Incorrect email");
                        // }
                        // if(isPasswordValid) {
                        //     setPasswordPrompt("");
                        // }
                        // else {
                        //     setPasswordPrompt("Incorrect password")
                        // }
                        // console.log("5")
                    }


                }}
            >
                {
                    !isLoading ?
                        <Text style={[textTheme.titleSmall, {color: Colors.onHighlight, fontWeight: '600'}]}>Sign
                            in</Text> :
                        <ActivityIndicator color={Colors.onHighlight} style={styles.activityIndicator}/>
                }

            </PrimaryButton>
        </View>
    );
}