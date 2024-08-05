import {View, Text, TextInput, StyleSheet, Pressable} from "react-native";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import {useState} from "react";
import { Checkbox } from 'react-native-paper';
import {useNavigation} from "@react-navigation/native";
import axios from "axios";

export default function EmailLogin() {
    let responseUserMessage = '';
    const navigation = useNavigation();
    const platform = "BUSINESS";

    let isUserFound = false;

    const [checked, setChecked] = useState(false);

    const [isEmailClicked, setIsEmailClicked] = useState(true);

    const [password, setPassword] = useState("");

    const [email, setEmail] = useState("");

    const [isEmailBlur, setIsEmailBlur] = useState(false);
    const [isPasswordBlur, setIsPasswordBlur] = useState(false);

    const BaseURL = 'https://gamma.vipsline.com/api/v1'


    function emailOnPressHandler() {
        setIsEmailClicked(true);
    }


    function PasswdOnPressHandler() {
        setIsEmailClicked(false);
    }


    function forgetPasswordOnPressHandler() {
        navigation.navigate('ForgetPassword');
    }


    async function findUser() {
        let response = "something went wrong"
        try {
            response = await axios.post(BaseURL + '/user/findUser', {
                platform: platform,
                userName: email
            })
            responseUserMessage = response.data.message;

        }
        catch (error) {
            console.log("user not found: " + error);
        }

        // console.log(response);
        return responseUserMessage;
    }

    async function signInHandler() {
        isUserFound = await findUser() === "user found";
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
            }
            isAuthenticationSuccessful = response.data.message === "User authenticated";
        }

        if (isAuthenticationSuccessful) {
            navigation.navigate('ForgetPassword');
        }



    }

    const styles = StyleSheet.create({
        emailInput: {
            borderWidth: 2,
            padding: 8,
            borderRadius: 8,
            borderColor: isEmailClicked ? Colors.highlight:  Colors.grey400,
        },
        passwordInput: {
            borderWidth: 2,
            padding: 8,
            borderRadius: 8,
            borderColor: !isEmailClicked ? Colors.highlight:  Colors.grey400,
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
            width: '100%', backgroundColor: Colors.highlight,
        }
    })

    return (
        <View style={styles.emailContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                placeholder="Email Address"
                style={styles.emailInput}
                onPress={emailOnPressHandler}
                onChangeText={setEmail}
                value={email}
                onBlur={() => {
                    setIsEmailBlur(true);
                }}

                />
                <Text style={[styles.inputLabel, {marginTop: 16}]}>Password</Text>
                <TextInput
                placeholder="Password"
                value={password}
                style={styles.passwordInput}
                onPress={PasswdOnPressHandler}
                onChangeText={setPassword}
                secureTextEntry={!checked}
                onBlur={() => {
                    setIsPasswordBlur(true);
                }}
                />
            <View style={{marginVertical: 8, width: '100%',flexDirection:'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setChecked(!checked);
                    }}

                />
                    <Text>Show Password</Text>
                </View>
                <Pressable
                    onPress={forgetPasswordOnPressHandler}
                >
                    <Text style={{color: Colors.highlight, fontWeight: "600"}}>Forgot Password?</Text>
                </Pressable>
            </View>
                <PrimaryButton
                    label='Sign in'
                    buttonStyle={styles.signInButton}
                    textStyle={{color: Colors.onHighlight}}
                    onPress={signInHandler}
                />
        </View>
    );
}


