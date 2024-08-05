import {Text, TextInput, View, StyleSheet} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import axios from "axios";


export default function MobileOtp() {

    const [isFocussed, setIsFocussed] = useState(false);

    function onFocusHandler() {
        setIsFocussed(true);
    }

    function onFocusOutHandler() {
        setIsFocussed(false);
    }

    function fundUser() {

    }





    const styles = StyleSheet.create({
        mobileOtpContainer: {
            // borderWidth: 2,
            width: '85%'
        },
        mobileNumberInput: {
            width: '100%',
            borderWidth: 2,
            padding: 8,
            borderColor: isFocussed ? Colors.highlight: Colors.grey600,
            borderRadius: 6,
            marginBottom: 32,
        },
        mobileNumberContainer: {
            alignItems: "flex-start",
            // borderWidth: 2,
            width:'100%',
        },
    });


    const navigation = useNavigation();

    const [mobileNUmber, setMobileNUmber] = useState("");






    return (
        <View style={styles.mobileOtpContainer}>
            <View style={{marginTop: 30, marginBottom: 8, width: '82%', }}>
                <Text>Mobile number</Text>
            </View>
            <View style={styles.mobileNumberContainer}>
                <TextInput
                    style={styles.mobileNumberInput}
                    placeholder='Enter mobile number'
                    keyboardType= "number-pad"
                    onFocus={onFocusHandler}
                    onBlur={onFocusOutHandler}
                    value={mobileNUmber}

                />
                <PrimaryButton
                    label='Send OTP'
                    buttonStyle={{width: '100%', backgroundColor: Colors.highlight}}
                    textStyle={{color: Colors.onHighlight}}
                    onPress={() => {
                        navigation.navigate('VerifyOTP');
                }}
                    >

                </PrimaryButton>
            </View>
        </View>
    );
}

