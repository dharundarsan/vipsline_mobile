import {View, Text, StyleSheet, StatusBar, TouchableWithoutFeedback, Keyboard} from "react-native";
import SignInHeader from "../components/authScreen/SignInHeader";
import Toast from "../ui/Toast";
import ForgetPasswordOTP from "../components/forgetPasswordScreen/ForgetPasswordOTP";
import ForgetPasswordEmailOrNumber from "../components/forgetPasswordScreen/ForgetPasswordEmailOrNumber";
import {SafeAreaView} from "react-native-safe-area-context";
import {useRef, useState} from "react";
import textTheme from "../constants/TextTheme";
import Colors from "../constants/Colors";
import CustomTextInput from "../ui/CustomTextInput";
import {checkNullUndefined} from "../util/Helpers";
import PrimaryButton from "../ui/PrimaryButton";
import resetPasswordAPI from "../apis/authApis/resetPasswordAPI";
import {useNavigation} from "@react-navigation/native";

export default function ChangePasswordScreen(props) {
    const toastRef = useRef(null);

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [onFocus, setOnFocus] = useState(0);


    const navigation = useNavigation();

    const [checked, setChecked] = useState(true);

    const [emptyChecker, setEmptyChecker] = useState(0);

    const newPasswordRef = useRef();
    const confirmPasswordRef = useRef();






    return <SafeAreaView style={styles.safeAreaView}>
        <StatusBar style="light" />
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
        <View style={styles.forgetPassword}>
            <SignInHeader />
            <Toast
                ref={toastRef}
            />
            <View style={styles.changePassword}>
                <Text style={[textTheme.titleLarge, styles.resetPasswordText]}>
                    Reset Password
                </Text>

                <View style={styles.inputContainer}>
                    <CustomTextInput
                        type={"text"}
                        label={"Enter new password"}
                        labelTextStyle={[textTheme.titleSmall]}
                        placeholder={"Enter new password"}
                        textInputStyle={[styles.textInput, {borderColor: onFocus === 1 ? Colors.highlight : Colors.grey250}]}
                        container={styles.textInputContainer}
                        cursorColor={Colors.black}
                        onChangeText={setNewPassword}
                        validator={(text) => {
                            if(newPassword.trim().length === 0 || emptyChecker === 1) {
                                return "New Password should not be empty"
                            }
                            if((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{6,}$/).test(newPassword)) return true;
                            else return "Password must be at least 6 characters with a mix of uppercase, lowercase & numbers"
                        }}
                        onFocus={() => setOnFocus(1)}
                        secureTextEntry={checked}
                        onSave={(callback) => {
                            newPasswordRef.current = callback;
                        }}
                    />
                    <CustomTextInput
                        type={"text"}
                        label={"Re-Enter new password"}
                        labelTextStyle={[textTheme.titleSmall]}
                        placeholder={"Re-Enter new password"}
                        textInputStyle={[styles.textInput, {borderColor: onFocus === 2 ? Colors.highlight : Colors.grey250}]}
                        container={styles.textInputContainer}
                        cursorColor={Colors.black}
                        onChangeText={setConfirmPassword}
                        validator={(text) => {
                            if(confirmPassword.trim().length === 0 || emptyChecker === 2) {
                                return "Re-Enter New Password should not be empty"
                            }
                            if(confirmPassword === newPassword) {
                                return true
                            }
                            else {
                                return "Entered Password does not match";
                            }
                        }}
                        onFocus={() => setOnFocus(2)}
                        secureTextEntry={checked}
                        onSave={(callback) => {
                            confirmPasswordRef.current = callback;
                        }}

                    />
                </View>
                <PrimaryButton
                    label={"CHANGE PASSWORD"}
                    textStyle={[textTheme.titleMedium]}
                    buttonStyle={styles.buttonStyle}
                    onPress={async () => {

                        const newPasswordValid = newPasswordRef.current();
                        const confirmPasswordValid = confirmPasswordRef.current();

                        if(!newPasswordValid || !confirmPasswordValid) {
                            console.log("fgfs")
                            return;
                        }


                        if(newPassword.trim().length === 0) {
                            setEmptyChecker(1);
                            return;
                        }
                        if(confirmPassword.trim().length === 0) {
                            setEmptyChecker(2);
                            return;
                        }
                        if((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{6,}$/).test(newPassword) && newPassword === confirmPassword){
                            const message = await resetPasswordAPI(props.route.params.username, "BUSINESS", props.route.params.otp, newPassword);
                            toastRef.current.show(message);
                            if(message === "YEYYY!! Your password is changed") {
                                navigation.navigate("AuthScreen", {
                                    message: message
                                });
                            }
                        }
                    }}
                />
            </View>


        </View>
        </TouchableWithoutFeedback>

    </SafeAreaView>
}
const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: Colors.darkBlue
    },
    changePassword: {
        flex: 1,
        alignItems: 'center',
    },
    resetPasswordText: {
        color: Colors.black,
        marginTop: 32,
        fontWeight: '700'
    },
    forgetPassword: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    textInput: {
        width: '100%',
        borderWidth :1.8

    },
    textInputContainer: {
        width: '80%',
        marginTop: 12
    },
    inputContainer: {
        marginTop: 50,
        width: '100%',
        alignItems: 'center'
    },
    buttonStyle: {
        marginTop: 16,
        backgroundColor: Colors.highlight,

    }
})

